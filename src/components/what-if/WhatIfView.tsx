"use client"

import React, { useCallback, useEffect, useState } from "react"
import {
  AlertTriangle, ArrowRight, Ban, CheckCircle, Loader2, RefreshCw, Undo2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ROUTES } from "@/constants/routes"
import type { ApiErrorKind } from "@/lib/api-result"
import { ERRC_ACTION_ORDER, ERRC_ACTION_STYLE } from "@/schemas/what-if.schema"
import type { WhatIfAlternativeWire, WhatIfDataWire } from "@/schemas/what-if.schema"
import { applyWhatIfAlternative, getWhatIf, revertWhatIfAlternative } from "@/services/what-if"
import type { UnresolvedMovesDetail } from "@/services/what-if"
import { whatIfStyles } from "./styles"

type FieldLocale = "uk" | "en"

function toFieldLocale(locale: string): FieldLocale {
  return locale === "uk" ? "uk" : "en"
}

type ActionError = {
  alternativeId: string
  action: "apply" | "revert"
  kind: ApiErrorKind
  unresolvedMoves?: UnresolvedMovesDetail["unresolvedMoves"]
}

interface Props {
  projectId: string
  locale: string
  hasSubsequentData?: boolean
  isGenerating?: boolean
  onApplied?: (alternativeId: string) => void
}

export function WhatIfView({ projectId, locale, hasSubsequentData, isGenerating = false, onApplied }: Props) {
  const t = useTranslations("WhatIfView")
  const fieldLocale = toFieldLocale(locale)

  const [data, setData] = useState<WhatIfDataWire | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadErrorKind, setLoadErrorKind] = useState<ApiErrorKind | null>(null)

  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<"apply" | "revert" | null>(null)
  const [actionError, setActionError] = useState<ActionError | null>(null)
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null)

  const fetchWhatIf = useCallback((id: string) => {
    getWhatIf(id)
      .then((result) => {
        if (result.ok) {
          setData(result.data.whatIf)
        } else {
          setLoadErrorKind(result.kind)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!projectId) return
    fetchWhatIf(projectId)
  }, [projectId, fetchWhatIf])

  function retryLoad() {
    if (!projectId) return
    setLoading(true)
    setLoadErrorKind(null)
    fetchWhatIf(projectId)
  }

  async function handleApply(alternativeId: string) {
    if (pendingId) return
    setConfirmingId(null)
    setPendingId(alternativeId)
    setPendingAction("apply")
    setActionError(null)
    setJustAppliedId(null)

    const result = await applyWhatIfAlternative(projectId, alternativeId)
    if (result.ok) {
      setData(result.data.whatIf)
      setJustAppliedId(alternativeId)
      onApplied?.(alternativeId)
    } else if (result.kind === "validation" && result.details && typeof result.details === "object") {
      const details = result.details as Partial<UnresolvedMovesDetail>
      setActionError({
        alternativeId,
        action: "apply",
        kind: result.kind,
        unresolvedMoves: details.unresolvedMoves,
      })
    } else {
      setActionError({ alternativeId, action: "apply", kind: result.kind })
    }
    setPendingId(null)
    setPendingAction(null)
  }

  async function handleRevert(alternativeId: string) {
    if (pendingId) return
    setPendingId(alternativeId)
    setPendingAction("revert")
    setActionError(null)

    const result = await revertWhatIfAlternative(projectId, alternativeId)
    if (result.ok) {
      setData(result.data.whatIf)
    } else {
      setActionError({ alternativeId, action: "revert", kind: result.kind })
    }
    setPendingId(null)
    setPendingAction(null)
  }

  if (loadErrorKind) {
    return (
      <div className={whatIfStyles.root}>
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <p className="text-sm text-slate-600">{t(`errors.kind.${loadErrorKind}` as Parameters<typeof t>[0])}</p>
          <Button size="sm" variant="outline" onClick={retryLoad}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> {t("retry")}
          </Button>
        </div>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className={whatIfStyles.root}>
        <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className={whatIfStyles.root}>
      <div className={whatIfStyles.inner}>
        <header className="max-w-3xl mb-8">
          <p className={whatIfStyles.headerLabel}>{t("creativeBrainstorming")}</p>
          <h2 className={whatIfStyles.headerTitle}>{t("title")}</h2>
          <p className={whatIfStyles.headerSubtitle}>{t("subtitle")}</p>
        </header>

        {isGenerating && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {t("generatingLock")}
          </div>
        )}

        <div className={whatIfStyles.grid}>
          {data.alternatives.map((alt) => {
            const isApplied = alt.status === "applied"
            const isPending = pendingId === alt.id
            const isConfirming = confirmingId === alt.id
            const canRevert = isApplied && alt.canvas_snapshot_before != null
            const error = actionError?.alternativeId === alt.id ? actionError : null
            const justApplied = justAppliedId === alt.id

            return (
              <Card
                key={alt.id}
                className={cn(whatIfStyles.card, isApplied && whatIfStyles.cardSelected)}
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={whatIfStyles.cardTitle}>
                      {fieldLocale === "uk" ? alt.title_uk : alt.title_en}
                    </h3>
                    {isApplied && (
                      <span className={whatIfStyles.appliedBadge}>
                        <CheckCircle className="h-3 w-3" />
                        {t("applied")}
                      </span>
                    )}
                  </div>

                  <p className={whatIfStyles.cardPrompt}>
                    {fieldLocale === "uk" ? alt.premise_uk : alt.premise_en}
                  </p>

                  <MovesList alternative={alt} fieldLocale={fieldLocale} t={t} />

                  <div className={whatIfStyles.block}>
                    <div className={whatIfStyles.blockLabel}>{t("expectedImpact")}</div>
                    <p className={whatIfStyles.blockText + " mt-1.5"}>
                      {fieldLocale === "uk" ? alt.expected_impact_uk : alt.expected_impact_en}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    <p>{t(`errors.kind.${error.kind}` as Parameters<typeof t>[0])}</p>
                    {error.unresolvedMoves && error.unresolvedMoves.length > 0 && (
                      <ul className="mt-1.5 list-disc space-y-0.5 pl-4">
                        {error.unresolvedMoves.map((mv, i) => (
                          <li key={i}>
                            {t(`errors.unresolvedMove` as Parameters<typeof t>[0], {
                              action: mv.action,
                              section: mv.target_section,
                              target: mv.target,
                            })}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {justApplied && !error && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{t("appliedToCanvas")}</span>
                    <a href={`/${locale}${ROUTES.canvas(projectId)}`} className="ml-auto font-semibold underline underline-offset-2">
                      {t("viewCanvas")}
                    </a>
                  </div>
                )}

                <div className="pt-4 mt-auto space-y-2">
                  {isConfirming ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={isGenerating || isPending}
                        onClick={() => void handleApply(alt.id)}
                        className={whatIfStyles.applyBtn}
                      >
                        {isPending && pendingAction === "apply" ? (
                          <><Loader2 className="h-3.5 w-3.5 animate-spin" />{t("applying")}</>
                        ) : (
                          t("confirmApply")
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => setConfirmingId(null)}
                      >
                        <Ban className="h-3.5 w-3.5" />
                        {t("cancel")}
                      </Button>
                    </div>
                  ) : isApplied ? (
                    <Button
                      variant="outline"
                      disabled={isGenerating || !canRevert || isPending}
                      onClick={() => void handleRevert(alt.id)}
                      className="h-9 w-full gap-1.5 text-xs"
                    >
                      {isPending && pendingAction === "revert" ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" />{t("reverting")}</>
                      ) : (
                        <><Undo2 className="h-3.5 w-3.5" />{canRevert ? t("revert") : t("revertUnavailable")}</>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setConfirmingId(alt.id)}
                      disabled={isGenerating || !!pendingId}
                      className={whatIfStyles.applyBtn}
                    >
                      {t("applyAlternative")}<ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {!hasSubsequentData && (
          <p className={whatIfStyles.footer + " text-center text-xs text-slate-400"}>
            {t("regenerateNote")}
          </p>
        )}
      </div>
    </div>
  )
}

function MovesList({
  alternative,
  fieldLocale,
  t,
}: {
  alternative: WhatIfAlternativeWire
  fieldLocale: FieldLocale
  t: ReturnType<typeof useTranslations>
}) {
  const grouped = ERRC_ACTION_ORDER.map((action) => ({
    action,
    moves: alternative.moves.filter((m) => m.action === action),
  })).filter((g) => g.moves.length > 0)

  return (
    <div className={whatIfStyles.blocks}>
      {grouped.map(({ action, moves }) => (
        <div key={action} className={whatIfStyles.block}>
          <span className={cn(whatIfStyles.moveBadge, ERRC_ACTION_STYLE[action].badgeClass)}>
            {t(ERRC_ACTION_STYLE[action].labelKey as Parameters<typeof t>[0])}
          </span>
          <ul className="mt-1.5 space-y-1.5">
            {moves.map((move, i) => (
              <li key={i} className={whatIfStyles.blockText}>
                <span className="font-medium text-slate-700">{move.target_section.replaceAll("_", " ")}:</span>{" "}
                {action === "reduce" || action === "raise" ? move.new_text : move.target}
                <span className="block text-slate-400">
                  {fieldLocale === "uk" ? move.rationale_uk : move.rationale_en}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
