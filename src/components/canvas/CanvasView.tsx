"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { AlertTriangle, Check, Loader2, Mic2, RefreshCw, ShieldCheck, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { useProjectStore } from "@/store/use-project-store"
import { getCanvas, apiDeleteCanvasCard, validateCanvas, regenerateCanvas } from "@/services/canvas"
import type { CanvasSectionKey } from "@/schemas/canvas.schema"
import { canvasStyles } from "./styles"
import { CanvasSectionCard, CANVAS_ORDER } from "./CanvasSectionCard"

type SaveStatus     = "idle" | "dirty" | "saving" | "saved"
type ValidateStatus = "idle" | "validating" | "valid" | "invalid"

interface Props {
  hasPitch?:     boolean
  onGoToPitch?:  () => void
  // Cheap safeguard, not the full fix: there's no canvas versioning/ETag
  // yet, so a user's edit racing an in-flight regeneration (or a delayed
  // ml hook) can be silently lost. Blocking edits outright while the
  // project is mid-generation avoids that specific race without the real
  // fix (document version + If-Match, or per-field locking) — see the
  // canvas task's B4 for what the real fix would need.
  isGenerating?: boolean
}

export function CanvasView({ hasPitch = false, onGoToPitch, isGenerating = false }: Props) {
  const t               = useTranslations("CanvasView")
  const router          = useRouter()
  const params          = useParams()
  const locale          = (params?.locale as string) ?? "en"
  const projectId       = (params?.id as string) ?? ""
  const setCanvasSections  = useProjectStore((s) => s.setCanvasSections)
  const setActiveProjectId = useProjectStore((s) => s.setActiveProjectId)
  const deleteCanvasCard   = useProjectStore((s) => s.deleteCanvasCard)

  const [saveStatus,     setSaveStatus]     = useState<SaveStatus>("idle")
  const [validateStatus, setValidateStatus] = useState<ValidateStatus>("idle")
  const [regenerating,   setRegenerating]   = useState(false)
  const [savedAt,    setSavedAt]    = useState(0)
  const [loadError,  setLoadError]  = useState(false)
  const [loading,    setLoading]    = useState(true)

  const dirtyRef       = useRef<Set<CanvasSectionKey>>(new Set())
  const pendingDeletes = useRef<Partial<Record<CanvasSectionKey, Set<string>>>>({})
  const pendingNew     = useRef<Partial<Record<CanvasSectionKey, () => Promise<void>>>>({})

  // Doesn't reset loading/error state itself (that would be a setState
  // called synchronously from the mount effect below) — loading/loadError
  // already start at the right values for a fresh mount. The retry button
  // resets them explicitly before calling this.
  const fetchCanvas = useCallback((projectId: string) => {
    getCanvas(projectId)
      .then((data) => {
        if (data) setCanvasSections(data)
      })
      .catch(() => {
        // A real backend error, not "not generated yet" — surface it
        // instead of silently leaving whatever was already in the store
        // (see Part C: no silent mock/stale fallback).
        setLoadError(true)
      })
      .finally(() => setLoading(false))
  }, [setCanvasSections])

  useEffect(() => {
    if (!projectId) return
    setActiveProjectId(projectId)
    fetchCanvas(projectId)
  }, [projectId, setActiveProjectId, fetchCanvas])

  function retryLoadCanvas() {
    if (!projectId) return
    setLoading(true)
    setLoadError(false)
    fetchCanvas(projectId)
  }

  async function handleRegenerate() {
    if (regenerating) return
    setRegenerating(true)
    try {
      const fresh = await regenerateCanvas(projectId, locale)
      if (fresh) {
        setCanvasSections(fresh)
        setSavedAt((n) => n + 1) // reset visual states in children
      }
    } finally {
      setRegenerating(false)
    }
  }

  async function handleValidate() {
    if (saveStatus !== "dirty") return
    setValidateStatus("validating")
    try {
      await validateCanvas(projectId)
      setValidateStatus("valid")
      setTimeout(() => setValidateStatus("idle"), 3000)
    } catch {
      setValidateStatus("invalid")
      setTimeout(() => setValidateStatus("idle"), 3000)
    }
  }

  function handleHasChanges(section: CanvasSectionKey, dirty: boolean) {
    if (dirty) dirtyRef.current.add(section)
    else dirtyRef.current.delete(section)
    setSaveStatus(dirtyRef.current.size > 0 ? "dirty" : "idle")
  }

  function handlePendingDeletes(section: CanvasSectionKey, ids: Set<string>) {
    pendingDeletes.current[section] = ids
  }

  function handlePendingNew(section: CanvasSectionKey, commit: (() => Promise<void>) | null) {
    if (commit) pendingNew.current[section] = commit
    else delete pendingNew.current[section]
  }

  async function handleSave() {
    if (saveStatus !== "dirty") return
    setSaveStatus("saving")
    try {
      // Snapshot pending deletes before any async work (the Set refs can change)
      const deleteSnapshot: Array<[CanvasSectionKey, string[]]> = Object.entries(pendingDeletes.current)
        .map(([section, ids]) => [section as CanvasSectionKey, ids ? [...ids] : []])

      // Delete sequentially within each section to avoid Zustand set() race conditions
      for (const [section, ids] of deleteSnapshot) {
        for (const id of ids) {
          await deleteCanvasCard(section, id)
        }
      }

      // Commit new items (each handles its own ordering)
      const commitFns = Object.values(pendingNew.current).filter(Boolean) as Array<() => Promise<void>>
      await Promise.all(commitFns.map(fn => fn()))

      pendingDeletes.current = {}
      pendingNew.current = {}
      dirtyRef.current.clear()
      setSavedAt((n) => n + 1)
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch {
      setSaveStatus("dirty")
    }
  }

  const saveBtnClass = {
    idle:   "h-7 gap-1.5 text-xs font-semibold cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-100",
    dirty:  "h-7 gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white",
    saving: "h-7 gap-1.5 text-xs font-semibold bg-indigo-400 text-white cursor-wait",
    saved:  "h-7 gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-600 text-white",
  }[saveStatus]

  return (
    <div className={canvasStyles.root}>
      <div className={canvasStyles.header}>
        <div>
          <span className={canvasStyles.headerTitle}>{t("title")}</span>
          <div className="flex items-center gap-3 mt-1">
            {[
              { color: "bg-green-400",  label: t("legend.new") },
              { color: "bg-amber-400",  label: t("legend.modified") },
              { color: "bg-purple-400", label: t("legend.reordered") },
              { color: "bg-slate-300",  label: t("legend.pendingDelete") },
            ].map(({ color, label }) => (
              <span key={label} className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                <span className={cn("h-2 w-2 rounded-full inline-block", color)} /> {label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={isGenerating || saveStatus === "idle" || saveStatus === "saving"}
            onClick={() => void handleSave()}
            className={cn("transition-colors", saveBtnClass)}
          >
            {saveStatus === "saving" ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> {t("saving")}</>
            ) : saveStatus === "saved" ? (
              <><Check className="h-3 w-3" /> {t("saved")}</>
            ) : (
              <><Check className="h-3 w-3" /> {t("save")}</>
            )}
          </Button>
          <Button
            variant="outline" size="sm"
            disabled={isGenerating || saveStatus !== "dirty" || validateStatus === "validating"}
            onClick={() => void handleValidate()}
            className={cn(
              "h-7 gap-1.5 text-xs font-medium transition-colors",
              validateStatus === "valid"
                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                : validateStatus === "invalid"
                ? "border-red-300 bg-red-50 text-red-600"
                : validateStatus === "validating"
                ? "border-indigo-200 text-indigo-400 cursor-wait"
                : saveStatus === "dirty"
                ? "border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                : "opacity-40 cursor-not-allowed",
            )}
          >
            {validateStatus === "validating" ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> {t("validating")}</>
            ) : validateStatus === "valid" ? (
              <><Check className="h-3 w-3" /> {t("validated")}</>
            ) : validateStatus === "invalid" ? (
              <><XCircle className="h-3 w-3" /> {t("validateFailed")}</>
            ) : (
              <><ShieldCheck className="h-3.5 w-3.5" /> {t("validateBtn")}</>
            )}
          </Button>
          {hasPitch && (
            <Button
              variant="outline" size="sm"
              disabled={isGenerating || regenerating}
              onClick={() => void handleRegenerate()}
              className="h-7 gap-1.5 text-xs font-medium border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              {regenerating
                ? <><Loader2 className="h-3 w-3 animate-spin" /> {t("regenerating")}</>
                : <><RefreshCw className="h-3 w-3" /> {t("regenerate")}</>
              }
            </Button>
          )}
          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs bg-violet-600 hover:bg-violet-700"
            onClick={() => onGoToPitch ? onGoToPitch() : router.push(`/${locale}${ROUTES.pitch(projectId)}`)}
          >
            <Mic2 className="h-3 w-3" /> {t("generatePitch")}
          </Button>
        </div>
      </div>

      {isGenerating && (
        <div className="mx-5 mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {t("generatingLock")}
        </div>
      )}

      {loadError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <p className="text-sm text-slate-600">{t("loadError")}</p>
          <Button size="sm" variant="outline" onClick={retryLoadCanvas}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> {t("retry")}
          </Button>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div
          className={cn(canvasStyles.gridWrapper, isGenerating && "pointer-events-none opacity-60")}
          aria-disabled={isGenerating}
        >
          <div className={canvasStyles.grid}>
            {CANVAS_ORDER.map((key) => (
              <CanvasSectionCard
                key={key}
                sectionKey={key}
                savedAt={savedAt}
                onHasChanges={(dirty) => handleHasChanges(key, dirty)}
                onPendingDeletes={(ids) => handlePendingDeletes(key, ids)}
                onPendingNew={(text) => handlePendingNew(key, text)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
