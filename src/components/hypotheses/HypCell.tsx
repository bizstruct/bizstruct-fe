"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { Hypothesis, HypothesisQuadrant } from "@/schemas/hypotheses.schema"
import { HYP_Q_CFG, hypothesesStyles } from "./styles"
import { HypCard } from "./HypCard"

interface Props {
  id: HypothesisQuadrant
  items: Hypothesis[]
  draggingId: string | null
  onDragStart: (e: React.DragEvent, cardId: string) => void
  onDragEnd: () => void
  onDrop: (q: HypothesisQuadrant) => void
}

export function HypCell({ id, items, draggingId, onDragStart, onDragEnd, onDrop }: Props) {
  const t   = useTranslations("HypothesesView")
  const cfg = HYP_Q_CFG[id]
  const [over, setOver] = useState(false)

  return (
    <div
      className={cn(hypothesesStyles.cell(cfg.bg), over && hypothesesStyles.cellOver)}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false) }}
      onDrop={(e) => { e.preventDefault(); setOver(false); onDrop(id) }}
    >
      <div aria-hidden className={hypothesesStyles.cellWatermark}>
        <span className={hypothesesStyles.cellWatermarkText}>{t(`quadrants.${id}` as Parameters<typeof t>[0])}</span>
      </div>
      <div className={hypothesesStyles.cellInner}>
        {items.map((h) => (
          <HypCard
            key={h.id}
            hypothesis={h}
            isDragging={draggingId === h.id}
            onDragStart={(e) => onDragStart(e, h.id)}
            onDragEnd={onDragEnd}
          />
        ))}
        {over && draggingId && (
          <div className={hypothesesStyles.dropZone}>
            <span className={hypothesesStyles.dropZoneText}>{t("dropHere")}</span>
          </div>
        )}
      </div>
    </div>
  )
}
