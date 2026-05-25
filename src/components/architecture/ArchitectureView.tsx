"use client"

import React, { useState } from "react"
import { TrendingUp, LayoutGrid, RotateCcw, Sparkles, ArrowDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { ArchitectureData, ArchitectureVariant } from "@/schemas/architecture.schema"
import { architectureStyles } from "./styles"

interface Props {
  architectureData: ArchitectureData
  onGoToCanvas: () => void
}

export function ArchitectureView({ architectureData, onGoToCanvas }: Props) {
  const t = useTranslations("ArchitectureView")
  const [variant, setVariant] = useState<ArchitectureVariant>("original")
  const [loading, setLoading] = useState(false)

  function regenerate() {
    setLoading(true)
    setTimeout(() => {
      setVariant((v) => (v === "original" ? "regenerated" : "original"))
      setLoading(false)
    }, 1400)
  }

  const epicenter = architectureData[variant].epicenter
  const pattern   = architectureData[variant].pattern

  return (
    <div className={architectureStyles.root}>
      <div className={architectureStyles.inner}>
        <header className={architectureStyles.header}>
          <div>
            <h2 className={architectureStyles.headerTitle}>{t("title")}</h2>
            <p className={architectureStyles.headerSubtitle}>{t("subtitle")}</p>
          </div>
          <Button
            variant="outline" size="sm"
            onClick={regenerate}
            disabled={loading}
            className="shrink-0 h-8 gap-1.5 text-xs"
          >
            <RotateCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            {loading ? t("generating") : t("changeConceptBtn")}
          </Button>
        </header>

        <div className={architectureStyles.cardsWrap}>
          <Card className={architectureStyles.card}>
            <div className={architectureStyles.cardMeta}>
              <div className={architectureStyles.cardIconWrap}>
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className={architectureStyles.cardTypeLabel}>{t("epicenterLabel")}</div>
                <h3 className={architectureStyles.cardTitle}>{t(epicenter.titleKey as Parameters<typeof t>[0])}</h3>
              </div>
              <span className={cn(architectureStyles.cardBadge, architectureStyles.cardBadgeDetermined)}>
                {t("determined")}
              </span>
            </div>
            <p className={architectureStyles.cardDesc}>{epicenter.description}</p>
          </Card>

          <div className={architectureStyles.divider}>
            <div className={architectureStyles.dividerSymbol}>+</div>
          </div>

          <Card className={architectureStyles.card}>
            <div className={architectureStyles.cardMeta}>
              <div className={architectureStyles.cardIconWrap}>
                <LayoutGrid className="h-5 w-5" />
              </div>
              <div>
                <div className={architectureStyles.cardTypeLabel}>{t("patternLabel")}</div>
                <h3 className={architectureStyles.cardTitle}>{t(pattern.titleKey as Parameters<typeof t>[0])}</h3>
              </div>
              <span className={cn(architectureStyles.cardBadge, architectureStyles.cardBadgeSystem)}>
                {t("systemSelection")}
              </span>
            </div>
            <p className={architectureStyles.cardDesc}>{pattern.description}</p>
          </Card>
        </div>

        <div className={architectureStyles.cta}>
          <ArrowDown className="h-5 w-5 text-slate-300" />
          <Button onClick={onGoToCanvas} className={architectureStyles.ctaBtn}>
            <Sparkles className="h-4 w-4" />
            {t("generateCanvas")}
          </Button>
        </div>
      </div>
    </div>
  )
}
