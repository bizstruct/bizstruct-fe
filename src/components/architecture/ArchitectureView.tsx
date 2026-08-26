"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  RotateCcw, Sparkles, ArrowDown, Check, Loader2,
  Database, Gift, Users, DollarSign, Layers,
  Scissors, BarChart2, Network, Zap, Globe,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  EPICENTER_VALUES,
  PATTERN_VALUES,
  PATTERN_SUBTYPES,
} from "@/schemas/architecture.schema"
import type {
  Architecture,
  Epicenter,
  Pattern,
  PatternSubtype,
} from "@/schemas/architecture.schema"
import { patchArchitectureEpicenter, patchArchitecturePattern } from "@/services/architecture"
import { architectureStyles as s } from "./styles"

const EPICENTER_ICONS: Record<Epicenter, React.ReactNode> = {
  resource_driven:    <Database   className="h-5 w-5" />,
  offer_driven:        <Gift       className="h-5 w-5" />,
  customer_driven:    <Users      className="h-5 w-5" />,
  finance_driven:      <DollarSign className="h-5 w-5" />,
  multiple_epicenter: <Layers     className="h-5 w-5" />,
}

const PATTERN_ICONS: Record<Pattern, React.ReactNode> = {
  unbundling:            <Scissors  className="h-5 w-5" />,
  long_tail:              <BarChart2 className="h-5 w-5" />,
  multi_sided_platform: <Network   className="h-5 w-5" />,
  free:                    <Zap       className="h-5 w-5" />,
  open_business_model:  <Globe     className="h-5 w-5" />,
}

// Architecture carries both languages inline (epicenter_rationale_uk/_en,
// pattern_rationale_uk/_en) rather than being sliced per-locale server-side —
// pick the field for next-intl's active locale.
type RationaleLocale = "uk" | "en"

function toRationaleLocale(locale: string): RationaleLocale {
  return locale === "uk" ? "uk" : "en"
}

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
  }, [initialText])
  return (
    <div
      ref={ref}
      data-field={field}
      contentEditable
      suppressContentEditableWarning
      onInput={onInput}
      className={className}
    />
  )
}

function SelectorGroup<T extends string>({
  options, value, onChange, getLabel, size = "md", originalValue,
}: {
  options:        readonly T[]
  value:          T
  onChange:       (v: T) => void
  getLabel:       (v: T) => string
  size?:          "md" | "sm"
  originalValue?: T
}) {
  const hasChanged = originalValue !== undefined && value !== originalValue

  return (
    <div className={cn("flex flex-wrap gap-2", size === "sm" && "gap-1.5")}>
      {options.map((opt) => {
        const isCurrent  = opt === value
        const isOldValue = hasChanged && opt === originalValue

        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "relative rounded-lg border font-medium transition-all",
              size === "md" ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]",
              isCurrent && hasChanged
                ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                : isOldValue
                ? "border-amber-300 bg-amber-50 text-amber-600"
                : isCurrent
                ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700",
            )}
          >
            {getLabel(opt)}
            {isOldValue && (
              <span className="absolute -top-1.5 -right-1.5 h-2.5 w-2.5 rounded-full bg-amber-400 border-2 border-white" />
            )}
          </button>
        )
      })}
    </div>
  )
}

type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error"

interface Props {
  projectId:     string
  locale:        string
  architecture:  Architecture
  hasCanvas:     boolean
  onGoToCanvas:  () => void
}

export function ArchitectureView({ projectId, locale, architecture, hasCanvas, onGoToCanvas }: Props) {
  const t  = useTranslations("ArchitectureView")
  const tc = useTranslations("Common.actions")

  const rationaleLocale = toRationaleLocale(locale)
  const epicenterRationaleField = `epicenter_rationale_${rationaleLocale}` as const
  const patternRationaleField   = `pattern_rationale_${rationaleLocale}`   as const

  const [epicenter,      setEpicenter]      = useState<Epicenter>(architecture.epicenter)
  const [pattern,        setPattern]        = useState<Pattern>(architecture.pattern)
  const [patternSubtype, setPatternSubtype] = useState<PatternSubtype | null>(architecture.pattern_subtype ?? null)
  const [saveStatus,     setSaveStatus]     = useState<SaveStatus>("idle")

  // Track what was loaded from the backend so we can show "was: X" diffs
  const original = useRef({
    epicenter:      architecture.epicenter,
    pattern:        architecture.pattern,
    patternSubtype: architecture.pattern_subtype ?? null,
  })

  const epicenterDescRef = useRef<HTMLDivElement>(null)
  const patternDescRef   = useRef<HTMLDivElement>(null)

  function markDirty() {
    setSaveStatus((prev) => prev === "idle" || prev === "saved" ? "dirty" : prev)
  }

  function handleEpicenterChange(v: Epicenter) {
    setEpicenter(v)
    markDirty()
  }

  function handlePatternChange(v: Pattern) {
    setPattern(v)
    const subtypes = PATTERN_SUBTYPES[v]
    setPatternSubtype(subtypes ? subtypes[0] : null)
    markDirty()
  }

  function handleSubtypeChange(v: PatternSubtype) {
    setPatternSubtype(v)
    markDirty()
  }

  function getDesc(ref: React.RefObject<HTMLDivElement | null>, fallback: string) {
    return ref.current?.querySelector<HTMLElement>("[data-field='desc']")?.textContent?.trim() || fallback
  }

  async function handleSave() {
    if (saveStatus !== "dirty") return
    setSaveStatus("saving")
    try {
      await Promise.all([
        patchArchitectureEpicenter(projectId, {
          epicenter: epicenter,
          [epicenterRationaleField]: getDesc(epicenterDescRef, architecture[epicenterRationaleField]),
        }),
        patchArchitecturePattern(projectId, {
          pattern: pattern,
          pattern_subtype: patternSubtype,
          [patternRationaleField]: getDesc(patternDescRef, architecture[patternRationaleField]),
        }),
      ])
      original.current = { epicenter, pattern, patternSubtype }
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("dirty"), 3000)
    }
  }

  const epicenters = EPICENTER_VALUES
  const patterns   = PATTERN_VALUES
  const subtypes   = PATTERN_SUBTYPES[pattern] ?? []

  const epicenterChanged = epicenter      !== original.current.epicenter
  const patternChanged   = pattern        !== original.current.pattern
  const subtypeChanged   = patternSubtype !== original.current.patternSubtype

  const saveBtnClass = {
    idle:   s.saveBtnIdle,
    dirty:  s.saveBtnDirty,
    saving: s.saveBtnSaving,
    saved:  s.saveBtnSaved,
    error:  "h-8 gap-1.5 text-xs font-medium bg-red-500 text-white",
  }[saveStatus]

  return (
    <div className={s.root}>
      <div className={s.inner}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <header className={s.header}>
          <div className={s.headerLeft}>
            <p className={s.headerLabel}>{t("title")}</p>
            <p className={s.headerSubtitle}>{t("subtitle")}</p>
          </div>
          <div className={s.headerActions}>
            <Button
              size="sm"
              disabled={saveStatus === "idle" || saveStatus === "saving"}
              onClick={() => void handleSave()}
              className={cn("transition-colors", saveBtnClass)}
            >
              {saveStatus === "saving" ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>
              ) : saveStatus === "saved" ? (
                <><Check className="h-3 w-3" /> {tc("save")}</>
              ) : saveStatus === "error" ? (
                <>Error</>
              ) : (
                <><Check className="h-3 w-3" /> {tc("save")}</>
              )}
            </Button>
            {!hasCanvas && (
              <Button
                variant="outline" size="sm"
                className="h-8 gap-1.5 text-xs opacity-50 cursor-not-allowed"
                disabled
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t("changeConceptBtn")}
              </Button>
            )}
          </div>
        </header>

        {/* ── Cards ──────────────────────────────────────────────── */}
        <div className={s.cardsWrap}>

          {/* Epicenter */}
          <Card className={cn(s.card, epicenterChanged ? s.epicenterCardChanged : s.epicenterCard)}>
            <div className={s.cardTop}>
              <div className={s.cardTopLeft}>
                <div className={s.cardIconIndigo}>{EPICENTER_ICONS[epicenter]}</div>
                <div className={s.cardTypeLabel}>{t("epicenterLabel")}</div>
              </div>
              <span className={s.cardBadgeDetermined}>{t("determined")}</span>
            </div>

            <SelectorGroup
              options={epicenters}
              value={epicenter}
              onChange={handleEpicenterChange}
              getLabel={(v) => t(`epicenters.${v}` as Parameters<typeof t>[0])}
              originalValue={original.current.epicenter}
            />

            <div ref={epicenterDescRef} className={s.descWrap}>
              <div className={s.descLabel}>{t("epicenterDesc")}</div>
              <EditableText
                key={epicenterRationaleField}
                initialText={architecture[epicenterRationaleField]}
                field="desc"
                onInput={markDirty}
                className={s.cardDesc}
              />
            </div>
          </Card>

          {/* Divider */}
          <div className={s.divider}>
            <div className={s.dividerDot} />
            <div className={s.dividerLine} />
            <span className={s.dividerPlus}>+</span>
            <div className={s.dividerLine} />
            <div className={s.dividerDot} />
          </div>

          {/* Pattern */}
          <Card className={cn(s.card, patternChanged || subtypeChanged ? s.patternCardChanged : s.patternCard)}>
            <div className={s.cardTop}>
              <div className={s.cardTopLeft}>
                <div className={s.cardIconViolet}>{PATTERN_ICONS[pattern]}</div>
                <div className={s.cardTypeLabel}>{t("patternLabel")}</div>
              </div>
              <span className={s.cardBadgeSystem}>{t("systemSelection")}</span>
            </div>

            <SelectorGroup
              options={patterns}
              value={pattern}
              onChange={handlePatternChange}
              getLabel={(v) => t(`patterns.${v}` as Parameters<typeof t>[0])}
              originalValue={original.current.pattern}
            />

            {subtypes.length > 0 && (
              <div className={s.subtypeWrap}>
                <div className={s.subtypeLabel}>{t("subtypeLabel")}</div>
                <SelectorGroup
                  options={subtypes}
                  value={patternSubtype ?? subtypes[0]}
                  onChange={handleSubtypeChange}
                  getLabel={(v) => t(`subtypes.${v}` as Parameters<typeof t>[0])}
                  size="sm"
                  originalValue={original.current.patternSubtype ?? undefined}
                />
              </div>
            )}

            <div ref={patternDescRef} className={s.descWrap}>
              <div className={s.descLabel}>{t("patternDesc")}</div>
              <EditableText
                key={patternRationaleField}
                initialText={architecture[patternRationaleField]}
                field="desc"
                onInput={markDirty}
                className={s.cardDesc}
              />
            </div>
          </Card>
        </div>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <div className={s.cta}>
          <ArrowDown className={cn("h-5 w-5", s.ctaArrow)} />
          <Button onClick={onGoToCanvas} className={s.ctaBtn}>
            <Sparkles className="h-4 w-4" />
            {t("generateCanvas")}
          </Button>
        </div>

      </div>
    </div>
  )
}
