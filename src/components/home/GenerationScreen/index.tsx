"use client"

import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { GENERATING_STEPS } from "@/store/use-project-store"
import type { GenerationStep } from "@/store/use-project-store"
import { s, stageItemVariants, stageTitleVariants } from "./styles"
import type { StageItemVariantProps } from "./styles"

const STAGE_I18N_KEYS: Record<string, string> = {
  analyzing:         "analyzing",
  structuring:       "structuring",
  generating_models: "generatingModels",
}

interface StageItemProps {
  state:       StageItemVariantProps["state"]
  title:       string
  description: string
}

function StageItem({ state, title, description }: StageItemProps) {
  const isComplete = state === "complete"
  const isActive   = state === "active"

  return (
    <div className={stageItemVariants({ state })}>
      <div className={s.stageIconBox}>
        {isComplete ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        : isActive  ? <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
        :             <Circle className="h-4 w-4 text-slate-300" />}
      </div>
      <div className={s.stageContent}>
        <p className={stageTitleVariants({ active: isActive })}>{title}</p>
        <p className={s.stageDesc}>{description}</p>
      </div>
    </div>
  )
}

interface Props {
  generationStep: GenerationStep
}

export function GenerationScreen({ generationStep }: Props) {
  const tGen = useTranslations("Generation")

  const activeStageIndex = GENERATING_STEPS.indexOf(generationStep)

  return (
    <div className={s.root}>
      <div className={s.card}>
        <div className={s.header}>
          <div className={s.iconWrapper}>
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <div>
            <h2 className={s.title}>{tGen("title")}</h2>
            <p className={s.subtitle}>{tGen("subtitle")}</p>
          </div>
        </div>

        <div className={s.stageList}>
          {GENERATING_STEPS.map((stageId, index) => {
            const state   = index < activeStageIndex ? "complete" : index === activeStageIndex ? "active" : "pending"
            const i18nKey = STAGE_I18N_KEYS[stageId] ?? stageId

            return (
              <StageItem
                key={stageId}
                state={state}
                title={tGen(`stages.${i18nKey}.title` as Parameters<typeof tGen>[0])}
                description={tGen(`stages.${i18nKey}.description` as Parameters<typeof tGen>[0])}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
