"use client"

import React, { useState, useRef, useEffect } from "react"
import { MessageSquare, School, Activity, Heart, AlertCircle, CheckCircle2, Plus, GripVertical, Trash2, Undo2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import type { EmpathyCategory, EmpathyItem } from "@/schemas/empathy-map.schema"
import { empathyStyles } from "./styles"

const CATEGORY_ICON: Record<EmpathyCategory, React.ElementType> = {
  says:   MessageSquare,
  thinks: School,
  does:   Activity,
  feels:  Heart,
  pains:  AlertCircle,
  gains:  CheckCircle2,
}

const CATEGORY_THEME: Record<EmpathyCategory, { card: string; item: string; accent: string; icon: string }> = {
  says:   { card: "border-sky-100 bg-sky-50/40",       item: "bg-sky-50 border-l-2 border-sky-300 hover:bg-sky-100/70",        accent: "text-sky-700",    icon: "bg-sky-100 text-sky-600"     },
  thinks: { card: "border-violet-100 bg-violet-50/40", item: "bg-violet-50 border-l-2 border-violet-300 hover:bg-violet-100/70", accent: "text-violet-700", icon: "bg-violet-100 text-violet-600" },
  does:   { card: "border-indigo-100 bg-indigo-50/40", item: "bg-indigo-50 border-l-2 border-indigo-300 hover:bg-indigo-100/70", accent: "text-indigo-700", icon: "bg-indigo-100 text-indigo-600" },
  feels:  { card: "border-pink-100 bg-pink-50/40",     item: "bg-pink-50 border-l-2 border-pink-300 hover:bg-pink-100/70",      accent: "text-pink-700",   icon: "bg-pink-100 text-pink-600"   },
  pains:  { card: "border-red-100 bg-red-50/40",       item: "bg-red-50 border-l-2 border-red-300 hover:bg-red-100/70",         accent: "text-red-700",    icon: "bg-red-100 text-red-600"     },
  gains:  { card: "border-cyan-100 bg-cyan-50/40",     item: "bg-cyan-50 border-l-2 border-cyan-300 hover:bg-cyan-100/70",      accent: "text-cyan-700",   icon: "bg-cyan-100 text-cyan-600"   },
}

interface Props {
  category:               EmpathyCategory
  items:                  EmpathyItem[]
  onUpdate:               (id: number, text: string) => void
  onDelete:               (id: number) => void
  onAdd:                  () => number
  onReorder:              (fromIdx: number, toIdx: number) => void
  savedAt:                number
  onHasChanges:           (dirty: boolean) => void
  onPendingDeletesChange: (ids: Set<number>) => void
}

export function EmpathyCardList({ category, items, onUpdate, onDelete, onAdd, onReorder, savedAt, onHasChanges, onPendingDeletesChange }: Props) {
  const t = useTranslations("EmpathyView")

  const [editingId,       setEditingId]       = useState<number | null>(null)
  const [dragOver,        setDragOver]        = useState<number | null>(null)
  const [draggingIdx,     setDraggingIdx]     = useState<number | null>(null)
  const [newIds,           setNewIds]           = useState<Set<number>>(new Set())
  const [modifiedIds,      setModifiedIds]      = useState<Set<number>>(new Set())
  const [reorderedIds,     setReorderedIds]     = useState<Set<number>>(new Set())
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<number>>(new Set())

  const dragIdx    = useRef<number | null>(null)
  const canDragRef = useRef(false)

  useEffect(() => {
    pendingDeleteIds.forEach((id) => onDelete(id))
    setNewIds(new Set())
    setModifiedIds(new Set())
    setReorderedIds(new Set())
    setPendingDeleteIds(new Set())
  }, [savedAt])

  useEffect(() => {
    const dirty = newIds.size > 0 || modifiedIds.size > 0 || reorderedIds.size > 0 || pendingDeleteIds.size > 0
    onHasChanges(dirty)
  }, [newIds, modifiedIds, reorderedIds, pendingDeleteIds])

  useEffect(() => {
    onPendingDeletesChange(pendingDeleteIds)
  }, [pendingDeleteIds])

  const Icon  = CATEGORY_ICON[category]
  const theme = CATEGORY_THEME[category]

  function itemStyle(id: number) {
    if (pendingDeleteIds.has(id)) return "bg-slate-100 border-l-2 border-slate-300 opacity-50"
    if (newIds.has(id))           return "bg-green-50 border-l-2 border-green-400"
    if (modifiedIds.has(id))      return "bg-amber-50 border-l-2 border-amber-400"
    if (reorderedIds.has(id))     return "bg-purple-50 border-l-2 border-purple-400"
    return theme.item
  }

  return (
    <Card className={cn(empathyStyles.card, theme.card)}>
      <div className={empathyStyles.cardInner}>
        <div className={empathyStyles.cardHeader}>
          <div className={cn("flex items-center justify-center h-6 w-6 rounded-md shrink-0", theme.icon)}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(empathyStyles.cardTitle, theme.accent)}>
              {t(`categories.${category}` as Parameters<typeof t>[0])}
            </h3>
          </div>
          <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", theme.icon)}>
            {items.filter(q => !pendingDeleteIds.has(q.id)).length}
          </span>
          <button
            onClick={() => {
              const newId = onAdd()
              setNewIds((s) => new Set(s).add(newId))
              setEditingId(newId)
            }}
            className={empathyStyles.cardAddBtn}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={empathyStyles.emptyState}>
            <span className={empathyStyles.emptyText}>{t("empty")}</span>
          </div>
        ) : (
          <ul className={empathyStyles.list}>
            {items.map((q, idx) => {
              const isPendingDelete = pendingDeleteIds.has(q.id)
              return (
                <li
                  key={q.id}
                  draggable={editingId !== q.id && !isPendingDelete}
                  onDragStart={(e) => {
                    if (!canDragRef.current) { e.preventDefault(); return }
                    dragIdx.current = idx
                    setDraggingIdx(idx)
                  }}
                  onDragEnd={() => { dragIdx.current = null; setDraggingIdx(null); setDragOver(null) }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(idx) }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => {
                    if (dragIdx.current !== null && dragIdx.current !== idx) {
                      const movedItem = items[dragIdx.current]
                      onReorder(dragIdx.current, idx)
                      if (movedItem) setReorderedIds((s) => new Set(s).add(movedItem.id))
                    }
                    dragIdx.current = null
                    setDraggingIdx(null)
                    setDragOver(null)
                  }}
                  className={cn(
                    empathyStyles.listItem,
                    itemStyle(q.id),
                    "transition-all duration-150",
                    editingId === q.id && "cursor-text",
                    draggingIdx === idx && "opacity-40 scale-[0.97] shadow-none",
                    dragOver === idx && draggingIdx !== idx && "scale-[1.01] shadow-md opacity-80",
                  )}
                >
                  <GripVertical
                    className={cn(empathyStyles.grip, isPendingDelete && "invisible")}
                    onMouseDown={() => { canDragRef.current = true }}
                    onMouseUp={() => { canDragRef.current = false }}
                  />

                  {editingId === q.id ? (
                    <textarea
                      autoFocus
                      value={q.text}
                      rows={1}
                      ref={(el) => {
                        if (el) { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px` }
                      }}
                      onChange={(e) => {
                        onUpdate(q.id, e.target.value)
                        if (!newIds.has(q.id)) setModifiedIds((s) => new Set(s).add(q.id))
                        e.target.style.height = "auto"
                        e.target.style.height = `${e.target.scrollHeight}px`
                      }}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setEditingId(null) }
                        if (e.key === "Escape") setEditingId(null)
                      }}
                      className={empathyStyles.itemTextarea}
                    />
                  ) : (
                    <p
                      onClick={() => { if (!isPendingDelete) setEditingId(q.id) }}
                      className={cn(empathyStyles.itemText, isPendingDelete && "line-through text-slate-400 select-none")}
                    >
                      {q.text}
                    </p>
                  )}

                  {isPendingDelete ? (
                    <button
                      onClick={() => setPendingDeleteIds((s) => { const n = new Set(s); n.delete(q.id); return n })}
                      className="shrink-0 mt-0.5 text-slate-400 hover:text-green-600 transition-colors"
                      title="Restore"
                    >
                      <Undo2 className="h-3 w-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => { setEditingId(null); setPendingDeleteIds((s) => new Set(s).add(q.id)) }}
                      className={empathyStyles.itemDelete}
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
