"use client"

import React, { useState, useRef } from "react"
import { MessageSquare, School, Activity, Heart, AlertCircle, CheckCircle2, Plus, GripVertical, Trash2 } from "lucide-react"
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

const CATEGORY_COLOR: Record<EmpathyCategory, string> = {
  says:   "text-sky-600",
  thinks: "text-violet-600",
  does:   "text-emerald-600",
  feels:  "text-rose-600",
  pains:  "text-orange-600",
  gains:  "text-teal-600",
}

interface Props {
  category: EmpathyCategory
  items: EmpathyItem[]
  onUpdate: (id: number, text: string) => void
  onDelete: (id: number) => void
  onAdd: () => void
}

export function EmpathyCardList({ category, items, onUpdate, onDelete, onAdd }: Props) {
  const t = useTranslations("EmpathyView")
  const [editingId, setEditingId] = useState<number | null>(null)
  const dragIdx = useRef<number | null>(null)
  const Icon  = CATEGORY_ICON[category]
  const color = CATEGORY_COLOR[category]

  return (
    <Card className={empathyStyles.card}>
      <div className={empathyStyles.cardInner}>
        <div className={empathyStyles.cardHeader}>
          <Icon className={cn("h-4 w-4", color)} />
          <h3 className={empathyStyles.cardTitle}>{t(`categories.${category}` as Parameters<typeof t>[0])}</h3>
          <button onClick={onAdd} className={empathyStyles.cardAddBtn}>
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className={empathyStyles.emptyState}>
            <span className={empathyStyles.emptyText}>{t("empty")}</span>
          </div>
        ) : (
          <ul className={empathyStyles.list}>
            {items.map((q, idx) => (
              <li
                key={q.id}
                draggable
                onDragStart={() => { dragIdx.current = idx }}
                onDragEnd={() => { dragIdx.current = null }}
                className={empathyStyles.listItem}
              >
                <GripVertical className={empathyStyles.grip} />

                {editingId === q.id ? (
                  <textarea
                    autoFocus
                    value={q.text}
                    onChange={(e) => onUpdate(q.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setEditingId(null) }
                      if (e.key === "Escape") setEditingId(null)
                    }}
                    rows={2}
                    className={empathyStyles.itemTextarea}
                  />
                ) : (
                  <p onClick={() => setEditingId(q.id)} className={empathyStyles.itemText}>
                    {q.text}
                  </p>
                )}

                <button onClick={() => onDelete(q.id)} className={empathyStyles.itemDelete}>
                  <Trash2 className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}
