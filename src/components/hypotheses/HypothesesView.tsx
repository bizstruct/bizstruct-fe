"use client"

import React, { useState } from "react"
import { Check, GripVertical, Loader2, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Hypothesis, HypothesisCategory, HypothesisQuadrant } from "@/schemas/hypotheses.schema"
import { saveHypotheses } from "@/services/hypotheses"
import { HYP_CAT_CFG, hypothesesStyles } from "./styles"
import { HypCell } from "./HypCell"

type SaveStatus = "idle" | "dirty" | "saving" | "saved"

interface Props {
  initialHypotheses: Hypothesis[]
}

export function HypothesesView({ initialHypotheses }: Props) {
  const t                          = useTranslations("HypothesesView")
  const params                     = useParams()
  const projectId                  = (params?.id as string) ?? ""
  const [hyps,          setHyps]          = useState<Hypothesis[]>(initialHypotheses)
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [saveStatus,    setSaveStatus]    = useState<SaveStatus>("idle")

  function handleReorder(quadrant: HypothesisQuadrant, draggedId: string, insertBeforeId: string | null) {
    setHyps((prev) => {
      const dragged = prev.find((h) => h.id === draggedId)
      if (!dragged) return prev
      const without = prev.filter((h) => h.id !== draggedId)
      if (insertBeforeId === null) return [...without, dragged]
      const idx = without.findIndex((h) => h.id === insertBeforeId)
      if (idx === -1) return [...without, dragged]
      const result = [...without]
      result.splice(idx, 0, dragged)
      return result
    })
    setSaveStatus((s) => (s === "saving" ? s : "dirty"))
  }

  function handleAdd(quadrant: HypothesisQuadrant, text: string, category: HypothesisCategory) {
    const newId = `H${Date.now()}`
    const newHyp: Hypothesis = { id: newId, text, category, quadrant }
    setHyps((prev) => [...prev, newHyp])
    setSaveStatus((s) => (s === "saving" ? s : "dirty"))
  }

  function handleDelete(id: string) {
    setHyps((prev) => prev.filter((h) => h.id !== id))
    setSaveStatus((s) => (s === "saving" ? s : "dirty"))
  }

  function handleTextChange(id: string, text: string) {
    setHyps((prev) => prev.map((h) => (h.id === id ? { ...h, text } : h)))
    setSaveStatus((s) => (s === "saving" ? s : "dirty"))
  }

  async function handleSave() {
    if (saveStatus !== "dirty") return
    setSaveStatus("saving")
    try {
      await saveHypotheses(projectId, hyps)
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
    <div className={hypothesesStyles.root}>
      <div className={hypothesesStyles.header}>
        <span className={hypothesesStyles.headerTitle}>{t("title")}</span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={saveStatus === "idle" || saveStatus === "saving"}
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
          <Button size="sm" className="h-7 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700">
            <RefreshCw className="h-3 w-3" /> {t("syncCanvas")}
          </Button>
        </div>
      </div>

      <div className={hypothesesStyles.body}>
        <div className={hypothesesStyles.matrixWrap}>
          <div className={hypothesesStyles.yAxis}>
            <span>{t("axis.high")}</span>
            <span className={hypothesesStyles.yLabel}>{t("axis.importance")}</span>
            <span>{t("axis.low")}</span>
          </div>
          <div className={hypothesesStyles.matrixInner}>
            <div className={hypothesesStyles.grid}>
              {(["q1", "q2", "q3", "q4"] as HypothesisQuadrant[]).map((qId) => (
                <HypCell
                  key={qId}
                  id={qId}
                  items={hyps.filter((h) => h.quadrant === qId)}
                  editingCardId={editingCardId}
                  onReorder={handleReorder}
                  onAdd={handleAdd}
                  onDelete={handleDelete}
                  onEditStart={(id) => setEditingCardId(id)}
                  onEditEnd={() => setEditingCardId(null)}
                  onTextChange={handleTextChange}
                />
              ))}
            </div>
            <div className={hypothesesStyles.xAxis}>
              <span>{t("axis.low")}</span>
              <span>{t("axis.evidence")}</span>
              <span>{t("axis.high")}</span>
            </div>
          </div>
        </div>

        <div className={hypothesesStyles.legend}>
          {(Object.keys(HYP_CAT_CFG) as Array<keyof typeof HYP_CAT_CFG>).map((cat) => (
            <div key={cat} className={hypothesesStyles.legendItem}>
              <div className={hypothesesStyles.legendDot(HYP_CAT_CFG[cat].dot)} />
              <span>{t(`categories.${cat}` as Parameters<typeof t>[0])}</span>
            </div>
          ))}
          <div className={hypothesesStyles.legendDrag}>
            <GripVertical className="h-3 w-3" />
            <span>{t("dragToReclassify")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
