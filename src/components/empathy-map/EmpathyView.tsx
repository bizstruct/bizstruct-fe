"use client"

import React, { useState, useEffect, useRef } from "react"
import { RefreshCw, Check, Loader2, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useProjectStore } from "@/store/use-project-store"
import type { EmpathyCategory, EmpathyData, EmpathyItem } from "@/schemas/empathy-map.schema"
import { addItem, updateItem, deleteItem } from "@/utils/mappers/empathy"
import { saveEmpathyMap } from "@/services/empathy-map"
import { empathyStyles } from "./styles"
import { EmpathyCardList } from "./EmpathyCardList"

const TOP_CATEGORIES:    EmpathyCategory[] = ["says", "thinks", "does", "feels"]
const BOTTOM_CATEGORIES: EmpathyCategory[] = ["pains", "gains"]

type SaveStatus = "idle" | "dirty" | "saving" | "saved"

interface Props {
  projectId:          string
  projectName:        string
  initialData:        EmpathyData
  onNext?:            () => void
  hasSubsequentData?: boolean
}

export function EmpathyView({ projectId, projectName, initialData, onNext, hasSubsequentData }: Props) {
  const t             = useTranslations("EmpathyView")
  const history       = useProjectStore((s) => s.history)
  const setStoreState = useProjectStore.setState

  const projectHistoryItem = history.find((h) => h.id === projectId)

  const [state, setState] = useState<Record<EmpathyCategory, EmpathyItem[]>>(() => ({
    ...initialData,
    pains: projectHistoryItem?.empathy?.pains
      ? projectHistoryItem.empathy.pains.map((text, i) => ({ id: i + 1, text }))
      : initialData.pains,
    gains: projectHistoryItem?.empathy?.gains
      ? projectHistoryItem.empathy.gains.map((text, i) => ({ id: i + 1, text }))
      : initialData.gains,
  }))

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [savedAt,    setSavedAt]    = useState(0)

  // dirty categories from children
  const dirtyRef       = useRef<Set<EmpathyCategory>>(new Set())
  const pendingDeletes = useRef<Partial<Record<EmpathyCategory, Set<number>>>>({})

  useEffect(() => {
    if (projectHistoryItem?.empathy) {
      setState((prev) => ({
        ...prev,
        pains: projectHistoryItem.empathy!.pains.map((text, i) => ({ id: i + 1, text })),
        gains: projectHistoryItem.empathy!.gains.map((text, i) => ({ id: i + 1, text })),
      }))
    }
  }, [projectHistoryItem?.id])

  function update(cat: EmpathyCategory, id: number, text: string) {
    setState((prev) => ({ ...prev, [cat]: updateItem(prev[cat], id, text) }))
  }

  function del(cat: EmpathyCategory, id: number) {
    setState((prev) => ({ ...prev, [cat]: deleteItem(prev[cat], id) }))
  }

  function add(cat: EmpathyCategory): number {
    let newId = 0
    setState((prev) => {
      const result = addItem(prev[cat])
      newId = result.newId
      return { ...prev, [cat]: result.items }
    })
    return newId
  }

  function reorder(cat: EmpathyCategory, fromIdx: number, toIdx: number) {
    setState((prev) => {
      const items = [...prev[cat]]
      const [moved] = items.splice(fromIdx, 1)
      items.splice(toIdx, 0, moved)
      return { ...prev, [cat]: items }
    })
  }

  function handleHasChanges(cat: EmpathyCategory, dirty: boolean) {
    if (dirty) dirtyRef.current.add(cat)
    else dirtyRef.current.delete(cat)
    setSaveStatus(dirtyRef.current.size > 0 ? "dirty" : "idle")
  }

  function handlePendingDeletes(cat: EmpathyCategory, ids: Set<number>) {
    pendingDeletes.current[cat] = ids
  }

  async function save() {
    if (saveStatus === "idle" || saveStatus === "saving") return
    setSaveStatus("saving")

    // build final state: exclude pending-delete IDs from each category
    const finalState: EmpathyData = {} as EmpathyData
    for (const cat of [...TOP_CATEGORIES, ...BOTTOM_CATEGORIES] as EmpathyCategory[]) {
      const pending = pendingDeletes.current[cat] ?? new Set()
      finalState[cat] = state[cat].filter((item) => !pending.has(item.id))
    }

    try {
      await saveEmpathyMap(projectId, finalState)

      // update local store
      const empathy = {
        pains: finalState.pains.map((p) => p.text),
        gains: finalState.gains.map((g) => g.text),
      }
      const exists = history.some((h) => h.id === projectId)
      setStoreState({
        history: exists
          ? history.map((h) => h.id === projectId ? { ...h, empathy } : h)
          : [{ id: projectId, title: projectName, empathy }, ...history],
      })

      setSavedAt((n) => n + 1)   // triggers EmpathyCardList to commit pending deletes
      dirtyRef.current.clear()
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch {
      setSaveStatus("dirty")     // revert to dirty so user can retry
    }
  }

  const saveBtnClass = {
    idle:   "h-7 gap-1.5 text-xs font-semibold cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-100",
    dirty:  "h-7 gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white",
    saving: "h-7 gap-1.5 text-xs font-semibold bg-indigo-400 text-white cursor-wait",
    saved:  "h-7 gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-600 text-white",
  }[saveStatus]

  return (
    <div className={empathyStyles.root}>
      <div className={empathyStyles.header}>
        <div>
          <span className={empathyStyles.headerTitle}>{t("title")}</span>
          <p className={empathyStyles.headerSubtitle}>{t("subtitle")}</p>
          <div className="flex items-center gap-3 mt-1.5">
            {[
              { color: "bg-green-400",  label: "New"            },
              { color: "bg-amber-400",  label: "Modified"       },
              { color: "bg-purple-400", label: "Reordered"      },
              { color: "bg-slate-300",  label: "Pending delete" },
            ].map(({ color, label }) => (
              <span key={label} className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                <span className={cn("h-2 w-2 rounded-full inline-block", color)} /> {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            {!hasSubsequentData && (
              <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700">
                <RefreshCw className="h-3 w-3" /> {t("regenerate")}
              </Button>
            )}
            <Button
              size="sm"
              disabled={saveStatus === "idle" || saveStatus === "saving"}
              onClick={() => void save()}
              className={cn("transition-colors", saveBtnClass)}
            >
              {saveStatus === "saving" ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>
              ) : saveStatus === "saved" ? (
                <><Check className="h-3 w-3" /> {t("saved")}</>
              ) : (
                <><Check className="h-3 w-3" /> {t("save")}</>
              )}
            </Button>
          </div>
          {onNext && (
            <Button size="sm" onClick={onNext} disabled={saveStatus === "dirty" || saveStatus === "saving"} className="h-7 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white w-full justify-between disabled:opacity-40 disabled:cursor-not-allowed">
              User Scenario <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <div className={empathyStyles.body}>
        <div className={empathyStyles.topGrid}>
          {TOP_CATEGORIES.map((cat) => (
            <EmpathyCardList
              key={cat}
              category={cat}
              items={state[cat]}
              onUpdate={(id, text) => update(cat, id, text)}
              onDelete={(id) => del(cat, id)}
              onAdd={() => add(cat)}
              onReorder={(from, to) => reorder(cat, from, to)}
              savedAt={savedAt}
              onHasChanges={(dirty) => handleHasChanges(cat, dirty)}
              onPendingDeletesChange={(ids) => handlePendingDeletes(cat, ids)}
            />
          ))}
        </div>
        <div className={empathyStyles.bottomGrid}>
          {BOTTOM_CATEGORIES.map((cat) => (
            <EmpathyCardList
              key={cat}
              category={cat}
              items={state[cat]}
              onUpdate={(id, text) => update(cat, id, text)}
              onDelete={(id) => del(cat, id)}
              onAdd={() => add(cat)}
              onReorder={(from, to) => reorder(cat, from, to)}
              savedAt={savedAt}
              onHasChanges={(dirty) => handleHasChanges(cat, dirty)}
              onPendingDeletesChange={(ids) => handlePendingDeletes(cat, ids)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
