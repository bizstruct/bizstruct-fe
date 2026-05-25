"use client"

import React, { useState, useRef, useEffect } from "react"
import { Plus, X, Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useProjectStore } from "@/store/use-project-store"
import type { CanvasSectionKey } from "@/schemas/canvas.schema"
import { CanvasCardItem } from "./CanvasCardItem"
import { canvasStyles } from "./styles"

const SECTION_CFG: Record<CanvasSectionKey, {
  labelKey: string
  icon: React.ElementType
  bg: string
  border: string
  text: string
  iconColor: string
  gridArea: string
}> = {
  keyPartners:           { labelKey: "sections.keyPartners",           icon: () => null, bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700",  iconColor: "text-violet-500",  gridArea: "col-span-2 row-span-2" },
  keyActivities:         { labelKey: "sections.keyActivities",         icon: () => null, bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700",     iconColor: "text-sky-500",     gridArea: "col-span-2" },
  keyResources:          { labelKey: "sections.keyResources",          icon: () => null, bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-700",  iconColor: "text-indigo-500",  gridArea: "col-span-2" },
  valuePropositions:     { labelKey: "sections.valuePropositions",     icon: () => null, bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   iconColor: "text-amber-500",   gridArea: "col-span-2 row-span-2" },
  customerRelationships: { labelKey: "sections.customerRelationships", icon: () => null, bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700",    iconColor: "text-rose-500",    gridArea: "col-span-2" },
  channels:              { labelKey: "sections.channels",              icon: () => null, bg: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-700",  iconColor: "text-orange-500",  gridArea: "col-span-2" },
  customerSegments:      { labelKey: "sections.customerSegments",      icon: () => null, bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-700",    iconColor: "text-teal-500",    gridArea: "col-span-2 row-span-2" },
  costStructure:         { labelKey: "sections.costStructure",         icon: () => null, bg: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-700",   iconColor: "text-slate-500",   gridArea: "col-span-5" },
  revenueStreams:        { labelKey: "sections.revenueStreams",        icon: () => null, bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", iconColor: "text-emerald-500", gridArea: "col-span-5" },
}

export const CANVAS_ORDER: CanvasSectionKey[] = [
  "keyPartners", "keyActivities", "valuePropositions", "customerRelationships", "customerSegments",
  "keyResources", "channels",
  "costStructure", "revenueStreams",
]

interface Props {
  sectionKey: CanvasSectionKey
}

export function CanvasSection({ sectionKey }: Props) {
  const t            = useTranslations("CanvasView")
  const cfg          = SECTION_CFG[sectionKey]
  const cards        = useProjectStore((s) => s.canvasSections[sectionKey])
  const addCanvasCard = useProjectStore((s) => s.addCanvasCard)
  const [adding, setAdding] = useState(false)
  const [newText, setNewText] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus()
  }, [adding])

  function commitAdd() {
    const t2 = newText.trim()
    if (t2) addCanvasCard(sectionKey, t2)
    setNewText("")
    setAdding(false)
  }

  return (
    <div className={cn(canvasStyles.section(cfg.bg, cfg.border), cfg.gridArea)}>
      <div className={canvasStyles.sectionLabel(cfg.text)}>
        <span className={cn(canvasStyles.sectionLabelText)}>{t(cfg.labelKey as Parameters<typeof t>[0])}</span>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        {cards.map((c) => (
          <CanvasCardItem key={c.id} card={c} sectionKey={sectionKey} />
        ))}

        {cards.length === 0 && !adding && (
          <div className={canvasStyles.emptySection}>
            <span className={canvasStyles.emptyText}>{t("empty")}</span>
          </div>
        )}

        {adding && (
          <div className="flex flex-col gap-1">
            <textarea
              ref={inputRef}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitAdd() }
                if (e.key === "Escape") { setAdding(false); setNewText("") }
              }}
              rows={2}
              placeholder={t("addNote")}
              className={canvasStyles.addTextarea}
            />
            <div className={canvasStyles.inlineActions}>
              <button onClick={() => { setAdding(false); setNewText("") }} className="rounded p-0.5 text-slate-400 hover:text-slate-600">
                <X className="h-3 w-3" />
              </button>
              <button onClick={commitAdd} className="rounded p-0.5 text-indigo-500 hover:text-indigo-700">
                <Check className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {!adding && (
        <button onClick={() => setAdding(true)} className={canvasStyles.addButton(cfg.text)}>
          <Plus className="h-2.5 w-2.5" /> {t("common_add" as Parameters<typeof t>[0])}
        </button>
      )}
    </div>
  )
}
