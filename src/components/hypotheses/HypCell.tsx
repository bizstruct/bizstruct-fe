"use client"

import React, { useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Archive, Bookmark, Plus, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Hypothesis, HypothesisCategory, HypothesisQuadrant } from "@/schemas/hypotheses.schema"
import { HYP_CAT_CFG, HYP_Q_CFG, HYP_Q_META, hypothesesStyles } from "./styles"
import { HypCard } from "./HypCard"

const ICONS: Record<string, React.ElementType> = {
  zap:      Zap,
  star:     Star,
  archive:  Archive,
  bookmark: Bookmark,
}

const DT_KEY = "hyp-card-id"
const CATEGORIES: HypothesisCategory[] = ["desirability", "viability", "feasibility"]

interface Props {
  id: HypothesisQuadrant
  items: Hypothesis[]
  editingCardId: string | null
  onReorder: (quadrant: HypothesisQuadrant, draggedId: string, insertBeforeId: string | null) => void
  onAdd: (quadrant: HypothesisQuadrant, text: string, category: HypothesisCategory) => void
  onDelete: (id: string) => void
  onEditStart: (id: string) => void
  onEditEnd: () => void
  onTextChange: (id: string, text: string) => void
}

export function HypCell({
  id, items, editingCardId,
  onReorder, onAdd, onDelete,
  onEditStart, onEditEnd, onTextChange,
}: Props) {
  const t    = useTranslations("HypothesesView")
  const cfg  = HYP_Q_CFG[id]
  const meta = HYP_Q_META[id]
  const Icon = ICONS[meta.icon]

  const [draggingId,    setDraggingId]    = useState<string | null>(null)
  const [dragOverId,    setDragOverId]    = useState<string | null>(null)
  const [draftText,     setDraftText]     = useState<string | null>(null)
  const [draftCategory, setDraftCategory] = useState<HypothesisCategory>("desirability")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const itemIds = new Set(items.map((h) => h.id))

  function handleDrop(e: React.DragEvent, insertBeforeId: string | null) {
    e.preventDefault()
    e.stopPropagation()
    const draggedId = e.dataTransfer.getData(DT_KEY)
    if (draggedId && itemIds.has(draggedId) && draggedId !== insertBeforeId) {
      onReorder(id, draggedId, insertBeforeId)
    }
    setDraggingId(null)
    setDragOverId(null)
  }

  function openDraft() {
    setDraftText("")
    setDraftCategory("desirability")
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  function commitDraft() {
    const trimmed = draftText?.trim()
    if (trimmed) onAdd(id, trimmed, draftCategory)
    setDraftText(null)
  }

  function cancelDraft() {
    setDraftText(null)
  }

  return (
    <div
      className={hypothesesStyles.cell(cfg.bg)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, null)}
    >
      {/* zone badge */}
      <div
        aria-hidden
        className={cn(
          "absolute top-2.5 right-2.5 z-20 pointer-events-none select-none",
          "flex items-center gap-1 rounded-full px-2 py-[3px] backdrop-blur-sm",
          cfg.tagBg,
        )}
      >
        <Icon className={cn("h-2.5 w-2.5 shrink-0", cfg.tagText)} />
        <span className={cn("text-[8px] font-bold uppercase tracking-[0.12em]", cfg.tagText)}>
          {meta.label}
        </span>
      </div>

      {/* faint corner watermark */}
      <div aria-hidden className={hypothesesStyles.cellWatermark}>
        <span className={hypothesesStyles.cellWatermarkText(cfg.labelColor)}>
          {t(`quadrants.${id}` as Parameters<typeof t>[0])}
        </span>
      </div>

      <ul className={hypothesesStyles.cellInner}>
        {items.map((h) => {
          const isEditing = editingCardId === h.id
          return (
            <li
              key={h.id}
              draggable={!isEditing}
              onDragStart={(e) => {
                e.dataTransfer.setData(DT_KEY, h.id)
                e.dataTransfer.effectAllowed = "move"
                setDraggingId(h.id)
              }}
              onDragEnd={() => { setDraggingId(null); setDragOverId(null) }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverId(h.id) }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverId(null) }}
              onDrop={(e) => handleDrop(e, h.id)}
              className={cn(
                "list-none transition-all duration-150",
                draggingId === h.id && "opacity-40 scale-[0.97]",
                dragOverId === h.id && draggingId !== h.id && "scale-[1.01] shadow-lg -translate-y-0.5",
              )}
            >
              <HypCard
                hypothesis={h}
                isDragging={draggingId === h.id}
                isEditingThis={isEditing}
                onEditStart={onEditStart}
                onEditEnd={onEditEnd}
                onTextChange={onTextChange}
                onDelete={onDelete}
              />
            </li>
          )
        })}

        {/* draft new item */}
        {draftText !== null && (
          <li className="list-none">
            <div className={cn(hypothesesStyles.card, HYP_CAT_CFG[draftCategory].border)}>
              <textarea
                ref={textareaRef}
                value={draftText}
                rows={2}
                placeholder={t("newItemPlaceholder" as Parameters<typeof t>[0])}
                onChange={(e) => setDraftText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitDraft() }
                  if (e.key === "Escape") cancelDraft()
                }}
                className="w-full resize-none bg-transparent text-[11.5px] leading-snug text-slate-800 font-medium outline-none placeholder:text-slate-300"
              />
              {/* category picker */}
              <div className="flex items-center gap-1.5 mt-1">
                {CATEGORIES.map((cat) => {
                  const c = HYP_CAT_CFG[cat]
                  return (
                    <button
                      key={cat}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setDraftCategory(cat)}
                      className={cn(
                        "text-[9px] font-bold px-2 py-[3px] rounded-full tracking-wide transition-opacity",
                        c.badge,
                        draftCategory !== cat && "opacity-30",
                      )}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-1.5 mt-1.5">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={commitDraft}
                  className="text-[9px] font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  {t("confirm" as Parameters<typeof t>[0])}
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={cancelDraft}
                  className="text-[9px] font-semibold text-slate-400 hover:text-slate-600"
                >
                  {t("cancel" as Parameters<typeof t>[0])}
                </button>
              </div>
            </div>
          </li>
        )}
      </ul>

      {/* add button */}
      {draftText === null && (
        <button
          onClick={openDraft}
          className="relative z-10 mx-3 mb-2 mt-auto flex items-center gap-1 text-[9px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Plus className="h-3 w-3" /> {t("addItem" as Parameters<typeof t>[0])}
        </button>
      )}
    </div>
  )
}
