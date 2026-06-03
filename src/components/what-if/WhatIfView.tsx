"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  Coins, Cpu, HeartHandshake,
  ArrowRight, CheckCircle, Loader2, ClipboardCheck, RefreshCw,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { WhatIfVector } from "@/schemas/what-if.schema"
import { patchWhatIfVector } from "@/services/what-if"
import type { PatchWhatIfPayload } from "@/services/what-if"
import { whatIfStyles } from "./styles"

const ICON_MAP: Record<string, React.ReactNode> = {
  coins:          <Coins className="h-5 w-5" />,
  cpu:            <Cpu className="h-5 w-5" />,
  heartHandshake: <HeartHandshake className="h-5 w-5" />,
}

// Sets content imperatively on mount — React never reconciles the node again,
// so user edits survive parent re-renders. onInput bubbles to parent for dirty tracking.
function EditableText({
  initialText,
  field,
  className,
  onInput,
}: {
  initialText: string
  field:       string
  className?:  string
  onInput?:    () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.textContent = initialText
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={ref}
      data-field={field}
      contentEditable
      suppressContentEditableWarning
      onInput={onInput}
      className={cn(
        "outline-none cursor-text rounded px-0.5 -mx-0.5",
        "focus:bg-slate-100/70 transition-colors",
        className,
      )}
    />
  )
}

function readField(container: HTMLDivElement | null, field: string, fallback: string): string {
  return container?.querySelector<HTMLElement>(`[data-field="${field}"]`)?.textContent?.trim() || fallback
}

interface Props {
  projectId:          string
  vectors:            WhatIfVector[]
  hasSubsequentData?: boolean
  onApplied?:         (scenarioId: string) => void
}

export function WhatIfView({ projectId, vectors, hasSubsequentData, onApplied }: Props) {
  const t = useTranslations("WhatIfView")

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const [appliedId,    setAppliedId]    = useState<string | null>(
    vectors.find((v) => v.status === "applied")?.scenarioId ?? null,
  )
  const [applyingId,   setApplyingId]   = useState<string | null>(null)
  const [validatingId, setValidatingId] = useState<string | null>(null)
  // tracks which vector cards have unsaved edits
  const [dirtyCards,    setDirtyCards]    = useState<Set<string>>(new Set())
  const [regenerating,  setRegenerating]  = useState(false)

  function markDirty(vectorId: string) {
    setDirtyCards((prev) => {
      if (prev.has(vectorId)) return prev
      const next = new Set(prev)
      next.add(vectorId)
      return next
    })
  }

  async function handleRegenerate() {
    if (regenerating) return
    setRegenerating(true)
    try {
      // TODO: call regeneration endpoint for this project
      await new Promise<void>((resolve) => setTimeout(resolve, 1500))
    } finally {
      setRegenerating(false)
    }
  }

  async function handleValidate(vector: WhatIfVector) {
    if (validatingId) return
    setValidatingId(vector.scenarioId)
    try {
      // TODO: call LLM validation endpoint with vector.scenarioId
      await new Promise<void>((resolve) => setTimeout(resolve, 1500))
    } finally {
      setValidatingId(null)
    }
  }

  async function handleApply(vector: WhatIfVector) {
    if (applyingId) return
    setApplyingId(vector.scenarioId)

    const container = cardRefs.current[vector.id]
    const payload: PatchWhatIfPayload = { status: "applied" }

    const badge = readField(container, "badge", vector.badge)
    if (badge !== vector.badge) payload.badge = badge

    const title = readField(container, "title", vector.title)
    if (title !== vector.title) payload.title = title

    const description = readField(container, "prompt", vector.description)
    if (description !== vector.description) payload.description = description

    vector.blocks.forEach((block, i) => {
      const text = readField(container, `block-${i}`, block.text)
      if (text !== block.text) {
        (payload as Record<string, string>)[block.field] = text
      }
    })

    try {
      await patchWhatIfVector(projectId, vector.scenarioId, payload)
      setAppliedId(vector.scenarioId)
      setDirtyCards((prev) => { const next = new Set(prev); next.delete(vector.id); return next })
      onApplied?.(vector.scenarioId)
    } catch (err) {
      console.error(err)
    } finally {
      setApplyingId(null)
    }
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
            const isApplied    = appliedId    === vector.scenarioId
            const isApplying   = applyingId   === vector.scenarioId
            const isValidating = validatingId === vector.scenarioId
            const isDirty      = dirtyCards.has(vector.id)
            const mark         = () => markDirty(vector.id)

            return (
              <Card
                key={vector.id}
                className={cn(
                  whatIfStyles.card,
                  vector.borderClass,
                  isApplied && whatIfStyles.cardSelected,
                )}
              >
                <div
                  ref={(el) => { cardRefs.current[vector.id] = el }}
                  className="space-y-4 flex-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className={whatIfStyles.badgeWrap}>
                      {ICON_MAP[vector.iconKey]}
                      <EditableText
                        initialText={vector.badge}
                        field="badge"
                        onInput={mark}
                        className="bg-transparent"
                      />
                    </div>
                    {isApplied && (
                      <span className={whatIfStyles.appliedBadge}>
                        <CheckCircle className="h-3 w-3" />
                        {t("applied")}
                      </span>
                    )}
                  </div>

                  <div className={whatIfStyles.cardHeader}>
                    <div className={whatIfStyles.iconWrap}>{ICON_MAP[vector.iconKey]}</div>
                    <div className="flex-1 min-w-0">
                      <EditableText
                        initialText={vector.title}
                        field="title"
                        onInput={mark}
                        className={cn(whatIfStyles.cardTitle, vector.accentClass)}
                      />
                      <EditableText
                        initialText={vector.description}
                        field="prompt"
                        onInput={mark}
                        className={whatIfStyles.cardPrompt + " mt-2"}
                      />
                    </div>
                  </div>

                  <div className={whatIfStyles.blocks}>
                    {vector.blocks.map((block, i) => (
                      <div key={block.field} className={whatIfStyles.block}>
                        <div className={whatIfStyles.blockLabel}>
                          {t(block.labelKey as Parameters<typeof t>[0])}
                        </div>
                        <EditableText
                          initialText={block.text}
                          field={`block-${i}`}
                          onInput={mark}
                          className={whatIfStyles.blockText + " mt-1.5"}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-auto space-y-2">
                  <Button
                    variant="outline"
                    disabled={!isDirty || !!validatingId}
                    onClick={() => void handleValidate(vector)}
                    className={whatIfStyles.validateBtn}
                  >
                    {isValidating
                      ? <><Loader2 className="h-3 w-3 animate-spin" />{t("validating")}</>
                      : <><ClipboardCheck className="h-3 w-3" />{t("validate")}</>
                    }
                  </Button>

                  <Button
                    onClick={() => void handleApply(vector)}
                    disabled={!!applyingId}
                    className={cn(
                      whatIfStyles.applyBtn,
                      isApplied && whatIfStyles.applyBtnApplied,
                    )}
                  >
                    {isApplying ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" />{t("applying")}</>
                    ) : isApplied ? (
                      <><CheckCircle className="h-3.5 w-3.5" />{t("applied")}</>
                    ) : (
                      <>{t("applyVector")}<ArrowRight className="h-3.5 w-3.5" /></>
                    )}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {!hasSubsequentData && (
          <div className={whatIfStyles.footer}>
            <Button
              variant="outline"
              disabled={regenerating}
              onClick={() => void handleRegenerate()}
              className={whatIfStyles.regenerateBtn}
            >
              {regenerating
                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />{t("regenerating")}</>
                : <><RefreshCw className="h-3.5 w-3.5" />{t("regenerate")}</>
              }
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
