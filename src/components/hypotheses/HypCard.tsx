"use client"

import React from "react"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Hypothesis } from "@/schemas/hypotheses.schema"
import { HYP_CAT_CFG, hypothesesStyles } from "./styles"

interface Props {
  hypothesis: Hypothesis
  isDragging: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
}

export function HypCard({ hypothesis, isDragging, onDragStart, onDragEnd }: Props) {
  const cfg = HYP_CAT_CFG[hypothesis.category]
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(hypothesesStyles.card, cfg.border, isDragging && "opacity-40 scale-[0.97]")}
    >
      <div className="flex items-center justify-between">
        <span className={hypothesesStyles.cardId}>{hypothesis.id}</span>
        <ExternalLink className="h-2.5 w-2.5 text-slate-300" />
      </div>
      <p className={hypothesesStyles.cardText}>{hypothesis.text}</p>
      <div className={hypothesesStyles.cardMeta}>
        <div className={hypothesesStyles.cardDot(cfg.dot)} />
        <span className={hypothesesStyles.cardBadge(cfg.badge)}>{hypothesis.category}</span>
      </div>
    </div>
  )
}
