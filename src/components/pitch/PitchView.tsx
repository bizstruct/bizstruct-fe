"use client"

import React, { useState } from "react"
import { RefreshCw, Check, ChevronRight, FlaskConical } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import type { PitchData, StoryType, PitchStep } from "@/schemas/pitch.schema"
import { pitchStyles } from "./styles"

interface Props {
  pitchData: PitchData
}

export function PitchView({ pitchData }: Props) {
  const t = useTranslations("PitchView")
  const [storyType, setStoryType] = useState<StoryType>("investor")
  const [stepIdx, setStepIdx]     = useState(0)

  const steps: PitchStep[] = pitchData[storyType]
  const step  = steps[stepIdx]

  const stepTitle = t(step.titleKey as Parameters<typeof t>[0])

  return (
    <div className={pitchStyles.root}>
      <div className={pitchStyles.header}>
        <div className={pitchStyles.headerLeft}>
          <span className={pitchStyles.headerTitle}>{t("title")}</span>
          <div className={pitchStyles.tabGroup}>
            {(["investor", "customer"] as StoryType[]).map((type) => (
              <button
                key={type}
                onClick={() => { setStoryType(type); setStepIdx(0) }}
                className={storyType === type ? pitchStyles.tabActive : pitchStyles.tabInactive}
              >
                {t(`storyTypes.${type}` as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs border-slate-200">
          <RefreshCw className="h-3 w-3" /> {t("regenerate")}
        </Button>
      </div>

      <div className={pitchStyles.body}>
        <div className={pitchStyles.stepList}>
          {steps.map((s, i) => {
            const isActive = i === stepIdx
            const isDone   = i < stepIdx
            return (
              <button
                key={s.id}
                onClick={() => setStepIdx(i)}
                className={`${pitchStyles.stepBtn} ${isActive ? pitchStyles.stepBtnActive : pitchStyles.stepBtnInact}`}
              >
                <div className={isActive ? pitchStyles.stepNumActive : isDone ? pitchStyles.stepNumDone : pitchStyles.stepNumPend}>
                  {isDone ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : s.id}
                </div>
                <span className={`${pitchStyles.stepLabel} ${isActive ? pitchStyles.stepLabelAct : pitchStyles.stepLabelInact}`}>
                  {t(s.titleKey as Parameters<typeof t>[0])}
                </span>
                {isActive && <ChevronRight className="h-3 w-3 ml-auto text-indigo-400" />}
              </button>
            )
          })}
          <div className={pitchStyles.progress}>
            <div className={pitchStyles.progressBar}>
              <div className={pitchStyles.progressFill} style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }} />
            </div>
            <p className={pitchStyles.progressText}>{stepIdx + 1} / {steps.length}</p>
          </div>
        </div>

        <div className={pitchStyles.content}>
          <div className={pitchStyles.contentBody}>
            <h2 className={pitchStyles.contentTitle}>{stepTitle}</h2>
            <div className={pitchStyles.prose} dangerouslySetInnerHTML={{ __html: step.content }} />
          </div>
          <div className={pitchStyles.footer}>
            <Button
              variant="outline" size="sm"
              onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
              disabled={stepIdx === 0}
              className="text-xs"
            >
              {t("previous")}
            </Button>
            <span className={pitchStyles.footerLabel}>{stepTitle}</span>
            {stepIdx < steps.length - 1 ? (
              <Button size="sm" onClick={() => setStepIdx((i) => i + 1)} className="text-xs bg-indigo-600 hover:bg-indigo-700">
                {t("next")}
              </Button>
            ) : (
              <Button size="sm" className="text-xs bg-teal-600 hover:bg-teal-700 gap-1">
                <FlaskConical className="h-3 w-3" /> {t("mapHypotheses")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
