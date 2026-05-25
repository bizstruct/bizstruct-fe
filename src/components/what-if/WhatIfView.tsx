"use client"

import React, { useState } from "react"
import { Coins, Cpu, HeartHandshake, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { WhatIfVector, WhatIfVectorId } from "@/schemas/what-if.schema"
import { whatIfStyles } from "./styles"

const ICON_MAP: Record<string, React.ReactNode> = {
  coins:        <Coins className="h-5 w-5" />,
  cpu:          <Cpu className="h-5 w-5" />,
  heartHandshake: <HeartHandshake className="h-5 w-5" />,
}

interface Props {
  vectors: WhatIfVector[]
  onApply: () => void
}

export function WhatIfView({ vectors, onApply }: Props) {
  const t = useTranslations("WhatIfView")
  const [selected, setSelected] = useState<WhatIfVectorId | null>(null)

  function handleApply(id: WhatIfVectorId) {
    setSelected(id)
    onApply()
  }

  return (
    <div className={whatIfStyles.root}>
      <div className={whatIfStyles.inner}>
        <header className="max-w-3xl mb-8">
          <p className={whatIfStyles.headerLabel}>{t("creativeBrainstorming")}</p>
          <h2 className={whatIfStyles.headerTitle}>{t("title")}</h2>
          <p className={whatIfStyles.headerSubtitle}>{t("subtitle")}</p>
        </header>

        <div className={whatIfStyles.grid}>
          {vectors.map((vector) => {
            const isSelected = selected === vector.id
            return (
              <Card
                key={vector.id}
                className={cn(
                  whatIfStyles.card,
                  vector.borderClass,
                  isSelected && whatIfStyles.cardSelected,
                )}
              >
                <div className="space-y-4 flex-1">
                  <div className={whatIfStyles.badgeWrap}>
                    {ICON_MAP[vector.iconKey]}
                    <span>{t(vector.badgeKey as Parameters<typeof t>[0])}</span>
                  </div>
                  <div className={whatIfStyles.cardHeader}>
                    <div className={whatIfStyles.iconWrap}>{ICON_MAP[vector.iconKey]}</div>
                    <div>
                      <h3 className={cn(whatIfStyles.cardTitle, vector.accentClass)}>
                        {t(vector.titleKey as Parameters<typeof t>[0])}
                      </h3>
                      <p className={whatIfStyles.cardPrompt}>
                        {t(vector.promptKey as Parameters<typeof t>[0])}
                      </p>
                    </div>
                  </div>
                  <div className={whatIfStyles.blocks}>
                    {vector.blocks.map((block) => (
                      <div key={block.labelKey} className={whatIfStyles.block}>
                        <div className={whatIfStyles.blockLabel}>
                          {t(block.labelKey as Parameters<typeof t>[0])}
                        </div>
                        <p className={whatIfStyles.blockText}>
                          {t(block.text as Parameters<typeof t>[0])}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-5 mt-auto">
                  <Button onClick={() => handleApply(vector.id)} className={whatIfStyles.applyBtn}>
                    {t("applyVector")} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        <div className={whatIfStyles.footer}>
          <button onClick={() => onApply()} className={whatIfStyles.standardPath}>
            {t("standardPath")}
          </button>
        </div>
      </div>
    </div>
  )
}
