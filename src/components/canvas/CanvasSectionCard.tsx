"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Handshake, Zap, Package, Gem, Heart,
  Radio, Users, Landmark, TrendingUp,
  Plus, GripVertical, Trash2, Undo2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { useProjectStore } from "@/store/use-project-store"
import type { CanvasCard, CanvasSectionKey } from "@/schemas/canvas.schema"
import { apiReorderSection } from "@/services/canvas"
import { canvasStyles } from "./styles"

const DRAFT_ID = "__draft__"

const SECTION_CFG: Record<CanvasSectionKey, {
  labelKey: string
  Icon:     React.ElementType
  card:     string
  item:     string
  accent:   string
  icon:     string
  gridArea: string
}> = {
  keyPartners:           { labelKey: "sections.keyPartners",           Icon: Handshake,  card: "border-violet-100 bg-violet-50/40",   item: "bg-violet-50 border-l-2 border-violet-300 hover:bg-violet-100/70",    accent: "text-violet-700",  icon: "bg-violet-100 text-violet-600",   gridArea: "col-span-2 row-span-2" },
  keyActivities:         { labelKey: "sections.keyActivities",         Icon: Zap,        card: "border-sky-100 bg-sky-50/40",          item: "bg-sky-50 border-l-2 border-sky-300 hover:bg-sky-100/70",             accent: "text-sky-700",     icon: "bg-sky-100 text-sky-600",         gridArea: "col-span-2" },
  keyResources:          { labelKey: "sections.keyResources",          Icon: Package,    card: "border-indigo-100 bg-indigo-50/40",    item: "bg-indigo-50 border-l-2 border-indigo-300 hover:bg-indigo-100/70",    accent: "text-indigo-700",  icon: "bg-indigo-100 text-indigo-600",   gridArea: "col-span-2" },
  valuePropositions:     { labelKey: "sections.valuePropositions",     Icon: Gem,        card: "border-amber-100 bg-amber-50/40",      item: "bg-amber-50 border-l-2 border-amber-300 hover:bg-amber-100/70",       accent: "text-amber-700",   icon: "bg-amber-100 text-amber-600",     gridArea: "col-span-2 row-span-2" },
  customerRelationships: { labelKey: "sections.customerRelationships", Icon: Heart,      card: "border-rose-100 bg-rose-50/40",        item: "bg-rose-50 border-l-2 border-rose-300 hover:bg-rose-100/70",          accent: "text-rose-700",    icon: "bg-rose-100 text-rose-600",       gridArea: "col-span-2" },
  channels:              { labelKey: "sections.channels",              Icon: Radio,      card: "border-cyan-100 bg-cyan-50/40",        item: "bg-cyan-50 border-l-2 border-cyan-300 hover:bg-cyan-100/70",          accent: "text-cyan-700",    icon: "bg-cyan-100 text-cyan-600",       gridArea: "col-span-2" },
  customerSegments:      { labelKey: "sections.customerSegments",      Icon: Users,      card: "border-teal-100 bg-teal-50/40",        item: "bg-teal-50 border-l-2 border-teal-300 hover:bg-teal-100/70",          accent: "text-teal-700",    icon: "bg-teal-100 text-teal-600",       gridArea: "col-span-2 row-span-2" },
  costStructure:         { labelKey: "sections.costStructure",         Icon: Landmark,   card: "border-slate-100 bg-slate-50/40",      item: "bg-slate-50 border-l-2 border-slate-300 hover:bg-slate-100/70",       accent: "text-slate-700",   icon: "bg-slate-100 text-slate-600",     gridArea: "col-span-5" },
  revenueStreams:        { labelKey: "sections.revenueStreams",        Icon: TrendingUp, card: "border-emerald-100 bg-emerald-50/40",  item: "bg-emerald-50 border-l-2 border-emerald-300 hover:bg-emerald-100/70", accent: "text-emerald-700", icon: "bg-emerald-100 text-emerald-600", gridArea: "col-span-5" },
}

export const CANVAS_ORDER: CanvasSectionKey[] = [
  "keyPartners", "keyActivities", "valuePropositions", "customerRelationships", "customerSegments",
  "keyResources", "channels",
  "costStructure", "revenueStreams",
]

interface Props {
  sectionKey:       CanvasSectionKey
  savedAt:          number
  onHasChanges:     (dirty: boolean) => void
  onPendingDeletes: (ids: Set<string>) => void
  onPendingNew:     (commit: (() => Promise<void>) | null) => void
}

export function CanvasSectionCard({ sectionKey, savedAt, onHasChanges, onPendingDeletes, onPendingNew }: Props) {
  const t   = useTranslations("CanvasView")
  const cfg = SECTION_CFG[sectionKey]

  const cards            = useProjectStore((s) => s.canvasSections[sectionKey])
  const addCanvasCard    = useProjectStore((s) => s.addCanvasCard)
  const updateCanvasCard = useProjectStore((s) => s.updateCanvasCard)
  const moveCanvasCard   = useProjectStore((s) => s.moveCanvasCard)

  // Unified visual order: real card ids + DRAFT_ID if draft exists
  const [itemIds,          setItemIds]          = useState<string[]>(() => cards.map(c => c.id))
  const [draftText,        setDraftText]        = useState<string | null>(null)
  const [editingId,        setEditingId]        = useState<string | null>(null)
  const [modifiedIds,      setModifiedIds]      = useState<Set<string>>(new Set())
  const [reorderedIds,     setReorderedIds]     = useState<Set<string>>(new Set())
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(new Set())
  const [dragOver,         setDragOver]         = useState<number | null>(null)
  const [draggingIdx,      setDraggingIdx]      = useState<number | null>(null)

  const dragIdx    = useRef<number | null>(null)
  const isDragging = useRef(false)

  // Sync itemIds when cards change externally — skip during drag to avoid interference
  useEffect(() => {
    if (isDragging.current) return
    setItemIds((prev) => {
      const storeIds = cards.map(c => c.id)
      const prevReal = prev.filter(id => id !== DRAFT_ID)
      const kept     = prevReal.filter(id => storeIds.includes(id))
      const added    = storeIds.filter(id => !prevReal.includes(id))
      const newReal  = [...kept, ...added]
      const draftPos = prev.indexOf(DRAFT_ID)
      if (draftPos === -1) return newReal
      const insertAt = Math.min(draftPos, newReal.length)
      return [...newReal.slice(0, insertAt), DRAFT_ID, ...newReal.slice(insertAt)]
    })
  }, [cards])

  // Reset on parent save
  useEffect(() => {
    setDraftText(null)
    setItemIds(cards.map(c => c.id))
    setModifiedIds(new Set())
    setReorderedIds(new Set())
    setPendingDeleteIds(new Set())
  }, [savedAt])

  // Dirty state
  useEffect(() => {
    const hasDraft = draftText !== null && draftText.trim().length > 0
    const dirty    = hasDraft || modifiedIds.size > 0 || reorderedIds.size > 0 || pendingDeleteIds.size > 0
    onHasChanges(dirty)
  }, [draftText, modifiedIds, reorderedIds, pendingDeleteIds])

  useEffect(() => { onPendingDeletes(pendingDeleteIds) }, [pendingDeleteIds])

  // Expose commit function to parent
  useEffect(() => {
    const text = draftText?.trim()
    if (!text) { onPendingNew(null); return }

    const commit = async () => {
      const capturedIds = [...itemIds]
      const newId = await addCanvasCard(sectionKey, text)
      if (!newId) return
      const finalIds = capturedIds.map(id => id === DRAFT_ID ? newId : id)
      const { activeProjectId } = useProjectStore.getState()
      if (!activeProjectId) return
      const storeCards = useProjectStore.getState().canvasSections[sectionKey]
      const ordered = finalIds
        .map(id => storeCards.find(c => c.id === id))
        .filter((c): c is CanvasCard => !!c)
      await apiReorderSection(activeProjectId, sectionKey, ordered)
      // Sync store with correct order so savedAt reset reads the right state
      const state = useProjectStore.getState()
      state.setCanvasSections({ ...state.canvasSections, [sectionKey]: ordered })
    }

    onPendingNew(commit)
  }, [draftText, itemIds])

  function itemStyle(id: string) {
    if (id === DRAFT_ID)               return "bg-green-200 border-l-[3px] border-green-700 shadow-sm"
    if (pendingDeleteIds.has(id))      return "bg-slate-100 border-l-2 border-slate-300 opacity-50"
    if (modifiedIds.has(id))           return "bg-amber-200 border-l-[3px] border-amber-700 shadow-sm"
    if (reorderedIds.has(id))          return "bg-purple-100 border-l-[3px] border-purple-600 shadow-sm"
    return cfg.item
  }

  function handleAdd() {
    if (draftText !== null) return
    setDraftText("")
    setItemIds(prev => [...prev.filter(id => id !== DRAFT_ID), DRAFT_ID])
  }

  function handleSaveEdit(card: CanvasCard, text: string) {
    const trimmed = text.trim()
    if (trimmed && trimmed !== card.text) {
      void updateCanvasCard(sectionKey, card.id, trimmed)
      setModifiedIds((s) => new Set(s).add(card.id))
    }
    setEditingId(null)
  }

  function handleDrop(fromIdx: number, toIdx: number) {
    const fromId = itemIds[fromIdx]
    const newIds = [...itemIds]
    const [moved] = newIds.splice(fromIdx, 1)
    newIds.splice(toIdx, 0, moved)
    setItemIds(newIds)

    const isDraftInvolved = fromId === DRAFT_ID
    if (!isDraftInvolved) {
      // Real card moved — update store and call API immediately
      moveCanvasCard({ section: sectionKey, cardId: fromId }, { section: sectionKey, index: toIdx })
      setReorderedIds(s => new Set(s).add(fromId))
      const reordered = newIds
        .filter(id => id !== DRAFT_ID)
        .map(id => cards.find(c => c.id === id))
        .filter((c): c is CanvasCard => !!c)
      const { activeProjectId } = useProjectStore.getState()
      if (activeProjectId) void apiReorderSection(activeProjectId, sectionKey, reordered)
    }
    // If draft moved: order is captured at save time via itemIds snapshot in commit fn
  }

  // Build display list from itemIds
  const displayItems = itemIds.map(id => {
    if (id === DRAFT_ID) return { id: DRAFT_ID, text: draftText ?? "", isAiGenerated: false, isDraft: true }
    const card = cards.find(c => c.id === id)
    return card ? { ...card, isDraft: false } : null
  }).filter((item): item is NonNullable<typeof item> => item !== null)

  const visibleCount = displayItems.filter(item => item.id !== DRAFT_ID && !pendingDeleteIds.has(item.id)).length
    + (draftText !== null ? 1 : 0)

  return (
    <Card className={cn(canvasStyles.card, cfg.card, cfg.gridArea)}>
      <div className={canvasStyles.cardInner}>

        <div className={canvasStyles.cardHeader}>
          <div className={cn("flex items-center justify-center h-5 w-5 rounded-md shrink-0", cfg.icon)}>
            <cfg.Icon className="h-3 w-3" />
          </div>
          <h3 className={cn(canvasStyles.cardTitle, cfg.accent)}>
            {t(cfg.labelKey as Parameters<typeof t>[0])}
          </h3>
          <span className={cn(canvasStyles.cardCount, cfg.icon)}>{visibleCount}</span>
          <button onClick={handleAdd} className={canvasStyles.cardAddBtn}>
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {displayItems.length === 0 ? (
          <div className={canvasStyles.emptyState}>
            <span className={canvasStyles.emptyText}>{t("empty")}</span>
          </div>
        ) : (
          <ul className={canvasStyles.list}>
            {displayItems.map((item, idx) => {
              const isDraft   = item.isDraft
              const isPending = !isDraft && pendingDeleteIds.has(item.id)

              return (
                <li
                  key={`${sectionKey}-${item.id}`}
                  draggable={editingId !== item.id && !isPending}
                  onDragStart={() => { isDragging.current = true; dragIdx.current = idx; setDraggingIdx(idx) }}
                  onDragEnd={() => { isDragging.current = false; dragIdx.current = null; setDraggingIdx(null); setDragOver(null) }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(idx) }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => {
                    if (dragIdx.current !== null && dragIdx.current !== idx) {
                      handleDrop(dragIdx.current, idx)
                    }
                    dragIdx.current = null; setDraggingIdx(null); setDragOver(null)
                  }}
                  className={cn(
                    canvasStyles.listItem,
                    itemStyle(item.id),
                    "transition-all duration-150",
                    !isDraft && editingId === item.id && "cursor-text",
                    draggingIdx === idx && "opacity-40 scale-[0.97] shadow-none",
                    dragOver === idx && draggingIdx !== idx && "scale-[1.01] shadow-md opacity-80",
                  )}
                >
                  <GripVertical className={cn(canvasStyles.grip, isPending && "invisible")} />

                  {isDraft ? (
                    <textarea
                      autoFocus
                      value={draftText ?? ""}
                      rows={1}
                      ref={(el) => {
                        if (el) { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px` }
                      }}
                      placeholder={t("newItemPlaceholder" as Parameters<typeof t>[0])}
                      onChange={(e) => {
                        setDraftText(e.target.value)
                        e.target.style.height = "auto"
                        e.target.style.height = `${e.target.scrollHeight}px`
                      }}
                      onKeyDown={(e) => { if (e.key === "Escape") { setDraftText(null); setItemIds(prev => prev.filter(id => id !== DRAFT_ID)) } }}
                      className={canvasStyles.itemTextarea}
                    />
                  ) : editingId === item.id ? (
                    <textarea
                      autoFocus
                      defaultValue={item.text}
                      rows={1}
                      ref={(el) => {
                        if (el) {
                          el.style.height = "auto"
                          el.style.height = `${el.scrollHeight}px`
                          const len = el.value.length
                          el.setSelectionRange(len, len)
                        }
                      }}
                      onChange={(e) => {
                        e.target.style.height = "auto"
                        e.target.style.height = `${e.target.scrollHeight}px`
                      }}
                      onBlur={(e) => handleSaveEdit(item as CanvasCard, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur() }
                        if (e.key === "Escape") setEditingId(null)
                      }}
                      className={canvasStyles.itemTextarea}
                    />
                  ) : (
                    <p
                      onClick={() => { if (!isPending && !isDraft) setEditingId(item.id) }}
                      className={cn(
                        canvasStyles.itemText,
                        isPending && "line-through text-slate-400 select-none",
                      )}
                    >
                      {item.text}
                    </p>
                  )}

                  {isDraft ? null : isPending ? (
                    <button
                      onClick={() => setPendingDeleteIds((s) => { const n = new Set(s); n.delete(item.id); return n })}
                      className="shrink-0 mt-0.5 text-slate-400 hover:text-green-600 transition-colors"
                    >
                      <Undo2 className="h-3 w-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => { setEditingId(null); setPendingDeleteIds((s) => new Set(s).add(item.id)) }}
                      className={canvasStyles.itemDelete}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}

      </div>
    </Card>
  )
}
