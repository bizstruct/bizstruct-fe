"use client"

import React from "react"
import { Clock, Target, Sparkles, Zap, Calendar, CheckCircle, TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/card"
import type { ScenarioData } from "@/schemas/scenario.schema"
import { scenarioStyles } from "./styles"

const TIMELINE_ICONS: Record<string, React.ElementType> = {
  clock:          Clock,
  calendar:       Calendar,
  target:         Target,
  sparkles:       Sparkles,
  zap:            Zap,
  "check-circle": CheckCircle,
  "trending-up":  TrendingUp,
}

interface Props {
  scenarioData: ScenarioData
}

export function ScenarioView({ scenarioData }: Props) {
  const t = useTranslations("ScenarioView")
  const { persona, timeline, metrics } = scenarioData

  return (
    <div className={scenarioStyles.root}>
      <div className={scenarioStyles.inner}>
        <div className={scenarioStyles.grid}>
          <div className={scenarioStyles.personaCard}>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className={scenarioStyles.avatar}>{persona.initials}</div>
                <div>
                  <div className={scenarioStyles.personaName}>{persona.name}</div>
                  <div className={scenarioStyles.personaRole}>{persona.role}</div>
                </div>
              </div>
              <div className={scenarioStyles.personaDetails}>
                <div>
                  <div className={scenarioStyles.labelTag}>{t("persona.roleLabel")}</div>
                  <span className={scenarioStyles.roleBadge}>{persona.role}</span>
                </div>
                <div>
                  <div className={scenarioStyles.labelTag}>{t("persona.painPointLabel")}</div>
                  <span className={scenarioStyles.painBadge}>{persona.painPoint}</span>
                </div>
              </div>
            </Card>
          </div>

          <div className={scenarioStyles.timelineCard}>
            <Card className="p-6">
              <div className={scenarioStyles.timeline}>
                <div className={scenarioStyles.timelineLine} />
                <div className={scenarioStyles.timelineSteps}>
                  {timeline.map((step) => {
                    const Icon = TIMELINE_ICONS[step.iconKey] ?? Sparkles
                    const labelText = t(`timeline.${step.labelKey.split(".").pop()}` as Parameters<typeof t>[0])
                    return (
                      <div key={step.labelKey} className={scenarioStyles.timelineStep}>
                        <div className={scenarioStyles.timelineIconWrap}>
                          <div className={`${scenarioStyles.timelineIcon} ${step.highlight ? scenarioStyles.timelineIconHigh : scenarioStyles.timelineIconNormal}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className={scenarioStyles.timelineContent}>
                          <div className={scenarioStyles.timelineLabel}>{labelText}</div>
                          {step.highlight ? (
                            <div className={scenarioStyles.timelineTextHigh}>{step.text}</div>
                          ) : (
                            <div className={scenarioStyles.timelineTextNorm}>{step.text}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-6">
          <h2 className={scenarioStyles.metricsTitle}>{t("resultTitle")}</h2>
          <div className={scenarioStyles.metricsGrid}>
            <Card className={scenarioStyles.metricBefore}>
              <div className={scenarioStyles.metricBeforeVal}>{metrics.before.value}</div>
              <div className={scenarioStyles.metricLabel}>{t("metrics.before")}</div>
            </Card>
            <Card className={scenarioStyles.metricAfter}>
              <div className={scenarioStyles.metricAfterVal}>{metrics.after.value}</div>
              <div className={scenarioStyles.metricAfterLabel}>
                <Zap className="h-3.5 w-3.5 text-indigo-500" /> {t("metrics.after")}
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  )
}
