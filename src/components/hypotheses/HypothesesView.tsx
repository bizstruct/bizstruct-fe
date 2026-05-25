"use client"

import React, { useState } from "react"
import { Plus, RefreshCw, GripVertical } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import type { Hypothesis, HypothesisQuadrant } from "@/schemas/hypotheses.schema"
import { HYP_CAT_CFG, hypothesesStyles } from "./styles"
import { HypCell } from "./HypCell"

interface Props {
  initialHypotheses: Hypothesis[]
}

export function HypothesesView({ initialHypotheses }: Props) {
  const t = useTranslations("HypothesesView")
  const [hyps, setHyps]           = useState<Hypothesis[]>(initialHypotheses)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  function handleDrop(target: HypothesisQuadrant) {
    if (!draggingId) return
    setHyps((prev) => prev.map((h) => (h.id === draggingId ? { ...h, quadrant: target } : h)))
    setDraggingId(null)
  }

  return (
    <div className={hypothesesStyles.root}>
      <div className={hypothesesStyles.header}>
        <span className={hypothesesStyles.headerTitle}>{t("title")}</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs border-slate-200">
            <Plus className="h-3 w-3" /> {t("add")}
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
              <div className={hypothesesStyles.hDivider} />
              <div className={hypothesesStyles.vDivider} />
              {(["q1", "q2", "q3", "q4"] as HypothesisQuadrant[]).map((qId) => (
                <HypCell
                  key={qId}
                  id={qId}
                  items={hyps.filter((h) => h.quadrant === qId)}
                  draggingId={draggingId}
                  onDragStart={(e, id) => {
                    e.dataTransfer.setData("text/plain", id)
                    e.dataTransfer.effectAllowed = "move"
                    setDraggingId(id)
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  onDrop={handleDrop}
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
