"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  RotateCcw, Sparkles, ArrowDown, Check, Loader2, ShieldCheck, XCircle,
  Database, Gift, Users, DollarSign,
  Scissors, BarChart2, Network, Zap, Globe,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  PATTERN_SUBTYPES,
  EpicenterSchema,
  PatternSchema,
  PatternSubtypeSchema,
} from "@/schemas/architecture.schema"
import type {
  ArchitectureData,
  EpicenterType,
  PatternType,
  PatternSubtypeType,
} from "@/schemas/architecture.schema"
import { patchArchitectureEpicenter, patchArchitecturePattern, validateArchitecture } from "@/services/architecture"
import { architectureStyles as s } from "./styles"

const EPICENTER_ICONS: Record<EpicenterType, React.ReactNode> = {
  "resource-driven": <Database   className="h-5 w-5" />,
  "offer-driven":    <Gift       className="h-5 w-5" />,
  "customer-driven": <Users      className="h-5 w-5" />,
  "finance-driven":  <DollarSign className="h-5 w-5" />,
}

const PATTERN_ICONS: Record<PatternType, React.ReactNode> = {
  "unbundling":           <Scissors  className="h-5 w-5" />,
  "long-tail":            <BarChart2 className="h-5 w-5" />,
  "multi-sided-platform": <Network   className="h-5 w-5" />,
  "free":                 <Zap       className="h-5 w-5" />,
  "open-business-model":  <Globe     className="h-5 w-5" />,
}

function EditableText({
  initialText,
  field,
  className,
  onInput,
}: {
  initialText: string
  field:       string
  className?:  string
  onInput?:    () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.textContent = initialText
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div
      ref={ref}
      data-field={field}
      contentEditable
      suppressContentEditableWarning
      onInput={onInput}
      className={className}
    />
  )
}

function SelectorGroup<T extends string>({
  options, value, onChange, getLabel, size = "md", originalValue,
}: {
  options:        T[]
  value:          T
  onChange:       (v: T) => void
  getLabel:       (v: T) => string
  size?:          "md" | "sm"
  originalValue?: T
}) {
  const hasChanged = originalValue !== undefined && value !== originalValue

  return (
    <div className={cn("flex flex-wrap gap-2", size === "sm" && "gap-1.5")}>
      {options.map((opt) => {
        const isCurrent  = opt === value
        const isOldValue = hasChanged && opt === originalValue

        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "relative rounded-lg border font-medium transition-all",
              size === "md" ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]",
              isCurrent && hasChanged
                ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                : isOldValue
                ? "border-amber-300 bg-amber-50 text-amber-600"
                : isCurrent
                ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700",
            )}
          >
            {getLabel(opt)}
            {isOldValue && (
              <span className="absolute -top-1.5 -right-1.5 h-2.5 w-2.5 rounded-full bg-amber-400 border-2 border-white" />
            )}
          </button>
        )
      })}
    </div>
  )
}

type SaveStatus     = "idle" | "dirty" | "saving" | "saved" | "error"
type ValidateStatus = "idle" | "validating" | "valid" | "invalid"

interface Props {
  projectId:        string
  locale:           string
  architectureData: ArchitectureData
  hasCanvas:        boolean
  onGoToCanvas:     () => void
}

export function ArchitectureView({ projectId, locale, architectureData, hasCanvas, onGoToCanvas }: Props) {
  const t  = useTranslations("ArchitectureView")
  const tc = useTranslations("Common.actions")

  const [epicenter,      setEpicenter]      = useState<EpicenterType>(architectureData.epicenter.value)
  const [pattern,        setPattern]        = useState<PatternType>(architectureData.pattern.value)
  const [patternSubtype, setPatternSubtype] = useState<PatternSubtypeType | null>(architectureData.pattern.subtype)
  const [saveStatus,     setSaveStatus]     = useState<SaveStatus>("idle")
  const [validateStatus, setValidateStatus] = useState<ValidateStatus>("idle")

  // Track what was loaded from the backend so we can show "was: X" diffs
  const original = useRef({
    epicenter:     architectureData.epicenter.value,
    pattern:       architectureData.pattern.value,
    patternSubtype: architectureData.pattern.subtype,
  })

  const epicenterDescRef = useRef<HTMLDivElement>(null)
  const patternDescRef   = useRef<HTMLDivElement>(null)

  function markDirty() {
    setSaveStatus((prev) => prev === "idle" || prev === "saved" ? "dirty" : prev)
    setValidateStatus("idle")
  }

  function handleEpicenterChange(v: EpicenterType) {
    setEpicenter(v)
    markDirty()
  }

  function handlePatternChange(v: PatternType) {
    setPattern(v)
    const subtypes = PATTERN_SUBTYPES[v]
    setPatternSubtype(subtypes ? subtypes[0] : null)
    markDirty()
  }

  function handleSubtypeChange(v: PatternSubtypeType) {
    setPatternSubtype(v)
    markDirty()
  }

  function getDesc(ref: React.RefObject<HTMLDivElement | null>, fallback: string) {
    return ref.current?.querySelector<HTMLElement>("[data-field='desc']")?.textContent?.trim() || fallback
  }

  async function handleSave() {
    if (saveStatus !== "dirty") return
    setSaveStatus("saving")
    try {
      await Promise.all([
        patchArchitectureEpicenter(projectId, locale, {
          value:       epicenter,
          description: getDesc(epicenterDescRef, architectureData.epicenter.description),
        }),
        patchArchitecturePattern(projectId, locale, {
          value:       pattern,
          subtype:     patternSubtype ?? undefined,
          description: getDesc(patternDescRef, architectureData.pattern.description),
        }),
      ])
      original.current = { epicenter, pattern, patternSubtype }
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("dirty"), 3000)
    }
  }

  async function handleValidate() {
    if (saveStatus !== "dirty") return
    setValidateStatus("validating")
    try {
      await validateArchitecture(projectId, locale, {
        epicenter:            epicenter,
        pattern:              pattern,
        subtype:              patternSubtype,
        epicenterDescription: getDesc(epicenterDescRef, architectureData.epicenter.description),
        patternDescription:   getDesc(patternDescRef, architectureData.pattern.description),
      })
      setValidateStatus("valid")
      setTimeout(() => setValidateStatus("idle"), 3000)
    } catch {
      setValidateStatus("invalid")
      setTimeout(() => setValidateStatus("idle"), 3000)
    }
  }

  const epicenters = EpicenterSchema.options
  const patterns   = PatternSchema.options
  const subtypes   = PATTERN_SUBTYPES[pattern] ?? []

  const epicenterChanged  = epicenter     !== original.current.epicenter
  const patternChanged    = pattern       !== original.current.pattern
  const subtypeChanged    = patternSubtype !== original.current.patternSubtype

  const saveBtnClass = {
    idle:   s.saveBtnIdle,
    dirty:  s.saveBtnDirty,
    saving: s.saveBtnSaving,
    saved:  s.saveBtnSaved,
    error:  "h-8 gap-1.5 text-xs font-medium bg-red-500 text-white",
  }[saveStatus]

  return (
    <div className={s.root}>
      <div className={s.inner}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <header className={s.header}>
          <div className={s.headerLeft}>
            <p className={s.headerLabel}>{t("title")}</p>
            <p className={s.headerSubtitle}>{t("subtitle")}</p>
          </div>
          <div className={s.headerActions}>
            <Button
              size="sm"
              disabled={saveStatus === "idle" || saveStatus === "saving"}
              onClick={() => void handleSave()}
              className={cn("transition-colors", saveBtnClass)}
            >
              {saveStatus === "saving" ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>
              ) : saveStatus === "saved" ? (
                <><Check className="h-3 w-3" /> {tc("save")}</>
              ) : saveStatus === "error" ? (
                <>Error</>
              ) : (
                <><Check className="h-3 w-3" /> {tc("save")}</>
              )}
            </Button>
            <Button
              variant="outline" size="sm"
              disabled={saveStatus !== "dirty" || validateStatus === "validating"}
              onClick={() => void handleValidate()}
              className={cn(
                "h-8 gap-1.5 text-xs font-medium transition-colors",
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
            {!hasCanvas && (
              <Button
                variant="outline" size="sm"
                className="h-8 gap-1.5 text-xs opacity-50 cursor-not-allowed"
                disabled
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t("changeConceptBtn")}
              </Button>
            )}
          </div>
        </header>

        {/* ── Cards ──────────────────────────────────────────────── */}
        <div className={s.cardsWrap}>

          {/* Epicenter */}
          <Card className={cn(s.card, epicenterChanged ? s.epicenterCardChanged : s.epicenterCard)}>
            <div className={s.cardTop}>
              <div className={s.cardTopLeft}>
                <div className={s.cardIconIndigo}>{EPICENTER_ICONS[epicenter]}</div>
                <div className={s.cardTypeLabel}>{t("epicenterLabel")}</div>
              </div>
              <span className={s.cardBadgeDetermined}>{t("determined")}</span>
            </div>

            <SelectorGroup
              options={epicenters}
              value={epicenter}
              onChange={handleEpicenterChange}
              getLabel={(v) => t(`epicenters.${v}` as Parameters<typeof t>[0])}
              originalValue={original.current.epicenter}
            />

            <div ref={epicenterDescRef} className={s.descWrap}>
              <div className={s.descLabel}>{t("epicenterDesc")}</div>
              <EditableText
                initialText={architectureData.epicenter.description}
                field="desc"
                onInput={markDirty}
                className={s.cardDesc}
              />
            </div>
          </Card>

          {/* Divider */}
          <div className={s.divider}>
            <div className={s.dividerDot} />
            <div className={s.dividerLine} />
            <span className={s.dividerPlus}>+</span>
            <div className={s.dividerLine} />
            <div className={s.dividerDot} />
          </div>

          {/* Pattern */}
          <Card className={cn(s.card, patternChanged || subtypeChanged ? s.patternCardChanged : s.patternCard)}>
            <div className={s.cardTop}>
              <div className={s.cardTopLeft}>
                <div className={s.cardIconViolet}>{PATTERN_ICONS[pattern]}</div>
                <div className={s.cardTypeLabel}>{t("patternLabel")}</div>
              </div>
              <span className={s.cardBadgeSystem}>{t("systemSelection")}</span>
            </div>

            <SelectorGroup
              options={patterns}
              value={pattern}
              onChange={handlePatternChange}
              getLabel={(v) => t(`patterns.${v}` as Parameters<typeof t>[0])}
              originalValue={original.current.pattern}
            />

            {subtypes.length > 0 && (
              <div className={s.subtypeWrap}>
                <div className={s.subtypeLabel}>{t("subtypeLabel")}</div>
                <SelectorGroup
                  options={subtypes}
                  value={patternSubtype ?? subtypes[0]}
                  onChange={handleSubtypeChange}
                  getLabel={(v) => t(`subtypes.${v}` as Parameters<typeof t>[0])}
                  size="sm"
                  originalValue={original.current.patternSubtype ?? undefined}
                />
              </div>
            )}

            <div ref={patternDescRef} className={s.descWrap}>
              <div className={s.descLabel}>{t("patternDesc")}</div>
              <EditableText
                initialText={architectureData.pattern.description}
                field="desc"
                onInput={markDirty}
                className={s.cardDesc}
              />
            </div>
          </Card>
        </div>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <div className={s.cta}>
          <ArrowDown className={cn("h-5 w-5", s.ctaArrow)} />
          <Button onClick={onGoToCanvas} className={s.ctaBtn}>
            <Sparkles className="h-4 w-4" />
            {t("generateCanvas")}
          </Button>
        </div>

      </div>
    </div>
  )
}
