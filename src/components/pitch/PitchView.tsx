"use client"

import React, { useState, useRef, useEffect } from "react"
import { RefreshCw, Check, ChevronRight, FlaskConical, Loader2, ShieldCheck, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import type { PitchData, StoryType, PitchStep } from "@/schemas/pitch.schema"
import { savePitchStep, validatePitch } from "@/services/pitch"
import { pitchStyles, STEP_COLORS, DEFAULT_STEP_COLORS } from "./styles"

type SaveStatus     = "idle" | "dirty" | "saving" | "saved"
type ValidateStatus = "idle" | "validating" | "valid" | "invalid"

interface Props {
  pitchData:        PitchData
  projectId:        string
  locale:           string
  onMapHypotheses?: () => void
}

function parseStep(html: string): { headline: string; body: string } {
  const m = html.match(/^<strong>([\s\S]*?)<\/strong><br\/?>([\s\S]*)$/)
  if (m) return { headline: m[1], body: m[2] }
  return { headline: "", body: html }
}

function buildContent(headline: string, body: string): string {
  return headline ? `<strong>${headline}</strong><br/>${body}` : body
}

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = "auto"
  el.style.height = `${el.scrollHeight}px`
}

function getSlideKey(titleKey: string): string {
  return titleKey.split(".").pop() ?? ""
}

export function PitchView({ pitchData, projectId, locale, onMapHypotheses }: Props) {
  const t = useTranslations("PitchView")

  const [storyType,  setStoryType]  = useState<StoryType>("investor")
  const [stepIdx,    setStepIdx]    = useState(0)
  const [localData,  setLocalData]  = useState<PitchData>(() => pitchData)
  const [saveStatus,     setSaveStatus]     = useState<SaveStatus>("idle")
  const [validateStatus, setValidateStatus] = useState<ValidateStatus>("idle")
  const saveTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const validateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const headlineRef   = useRef<HTMLTextAreaElement>(null)
  const bodyRef       = useRef<HTMLTextAreaElement>(null)

  const steps: PitchStep[] = localData[storyType]
  const safeIdx = Math.min(stepIdx, Math.max(0, steps.length - 1))
  const step    = steps[safeIdx]

  if (!step) return (
    <div className={pitchStyles.root}>
      <div className={pitchStyles.header}>
        <div className={pitchStyles.headerLeft}>
          <span className={pitchStyles.headerTitle}>{t("title")}</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
        {t("noContent")}
      </div>
    </div>
  )

  // Auto-resize both textareas whenever the active step content changes
  useEffect(() => {
    if (headlineRef.current) autoResize(headlineRef.current)
    if (bodyRef.current)     autoResize(bodyRef.current)
  }, [safeIdx, storyType, step.content])

  const stepTitle  = t(step.titleKey as Parameters<typeof t>[0])
  const slideKey   = getSlideKey(step.titleKey)
  const accent     = STEP_COLORS[slideKey] ?? DEFAULT_STEP_COLORS
  const { headline, body } = parseStep(step.content)

  function updateStepContent(newHeadline: string, newBody: string) {
    setLocalData(prev => ({
      ...prev,
      [storyType]: prev[storyType].map((s, i) =>
        i === safeIdx ? { ...s, content: buildContent(newHeadline, newBody) } : s
      ),
    }))
    setSaveStatus("dirty")
    setValidateStatus("idle")
  }

  async function saveCurrentStep() {
    if (saveStatus !== "dirty") return
    setSaveStatus("saving")
    try {
      const current            = localData[storyType][safeIdx]
      const { headline, body } = parseStep(current.content)
      await savePitchStep(projectId, locale, storyType, current.titleKey, headline, body)
      setSaveStatus("saved")
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000)
    } catch {
      setSaveStatus("dirty")
    }
  }

  async function handleValidate() {
    if (validateStatus === "validating") return
    setValidateStatus("validating")
    try {
      await validatePitch(projectId, locale)
      setValidateStatus("valid")
      if (validateTimerRef.current) clearTimeout(validateTimerRef.current)
      validateTimerRef.current = setTimeout(() => setValidateStatus("idle"), 3000)
    } catch {
      setValidateStatus("invalid")
      if (validateTimerRef.current) clearTimeout(validateTimerRef.current)
      validateTimerRef.current = setTimeout(() => setValidateStatus("idle"), 3000)
    }
  }

  const saveBtnClass = {
    idle:   pitchStyles.saveBtnIdle,
    dirty:  pitchStyles.saveBtnDirty,
    saving: pitchStyles.saveBtnSaving,
    saved:  pitchStyles.saveBtnSaved,
  }[saveStatus]

  return (
    <div className={pitchStyles.root}>

      {/* ── header ─────────────────────────────────────────────────────────── */}
      <div className={pitchStyles.header}>
        {/* left — spacer to balance right side */}
        <div className={pitchStyles.headerLeft} />

        {/* center — tabs */}
        <div className={pitchStyles.headerCenter}>
          <div className={pitchStyles.tabGroup}>
            {(["investor", "customer"] as StoryType[]).map((type) => (
              <button
                key={type}
                onClick={() => { setStoryType(type); setStepIdx(0) }}
                className={
                  storyType !== type
                    ? pitchStyles.tabInactive
                    : type === "investor"
                      ? pitchStyles.tabActiveInvestor
                      : pitchStyles.tabActiveCustomer
                }
              >
                {t(`storyTypes.${type}` as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </div>

        {/* right — actions */}
        <div className={pitchStyles.headerRight}>
          <Button
            size="sm"
            disabled={saveStatus === "idle" || saveStatus === "saving"}
            onClick={saveCurrentStep}
            className={saveBtnClass}
          >
            {saveStatus === "saving" && <Loader2 className="h-3 w-3 animate-spin" />}
            {saveStatus === "saved"  && <Check   className="h-3 w-3" />}
            {t(`saveStatus.${saveStatus}` as Parameters<typeof t>[0])}
          </Button>
          <Button
            variant="outline" size="sm"
            disabled={validateStatus === "validating"}
            onClick={() => void handleValidate()}
            className={
              validateStatus === "valid"   ? "h-7 gap-1.5 text-xs font-medium border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-50" :
              validateStatus === "invalid" ? "h-7 gap-1.5 text-xs font-medium border-red-300 bg-red-50 text-red-600 hover:bg-red-50" :
              validateStatus === "validating" ? "h-7 gap-1.5 text-xs font-medium border-amber-200 text-amber-400 cursor-wait" :
              "h-7 gap-1.5 text-xs font-medium border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700"
            }
          >
            {validateStatus === "validating" ? <Loader2   className="h-3 w-3 animate-spin" /> :
             validateStatus === "valid"      ? <Check     className="h-3 w-3" /> :
             validateStatus === "invalid"    ? <XCircle   className="h-3 w-3" /> :
                                              <ShieldCheck className="h-3.5 w-3.5" />}
            {t(`validateStatus.${validateStatus}` as Parameters<typeof t>[0])}
          </Button>
          <Button size="sm" className={pitchStyles.regenBtn}>
            <RefreshCw className="h-3 w-3" /> {t("regenerate")}
          </Button>
          <Button size="sm" onClick={onMapHypotheses} className="h-7 gap-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white">
            <FlaskConical className="h-3 w-3" /> {t("mapHypotheses")}
          </Button>
        </div>
      </div>

      {/* ── body ───────────────────────────────────────────────────────────── */}
      <div className={pitchStyles.body}>

        {/* step sidebar */}
        <div className={pitchStyles.stepList}>
          {steps.map((s, i) => {
            const isActive = i === safeIdx
            const isDone   = i < safeIdx
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
              <div className={pitchStyles.progressFill} style={{ width: `${((safeIdx + 1) / steps.length) * 100}%` }} />
            </div>
            <p className={pitchStyles.progressText}>{safeIdx + 1} / {steps.length}</p>
          </div>
        </div>

        {/* content panel */}
        <div className={pitchStyles.content}>
          <div className={pitchStyles.contentBody}>

            {/* slide card */}
            <div className={pitchStyles.slideCard}>

              {/* colored top bar */}
              <div className={`${pitchStyles.slideAccentBar} ${accent.bar}`} />

              <div className={pitchStyles.slideInner}>

                {/* meta row — badge + step counter */}
                <div className={pitchStyles.slideMeta}>
                  <span className={`${pitchStyles.slideBadge} ${accent.badge} ${accent.badgeBg}`}>
                    {stepTitle}
                  </span>
                  <span className={pitchStyles.slideCounter}>
                    {safeIdx + 1} / {steps.length}
                  </span>
                </div>

                {/* headline */}
                {headline !== "" && (
                  <div className={pitchStyles.headlineWrap}>
                    <textarea
                      ref={headlineRef}
                      rows={1}
                      value={headline}
                      placeholder={t("headlinePlaceholder")}
                      className={pitchStyles.headlineInput}
                      onChange={(e) => {
                        autoResize(e.currentTarget)
                        updateStepContent(e.target.value, body)
                      }}
                      onBlur={saveCurrentStep}
                    />
                  </div>
                )}

                {/* divider */}
                <div className={`${pitchStyles.slideDivider} ${accent.divider}`} />

                {/* body */}
                <textarea
                  ref={bodyRef}
                  rows={1}
                  value={body}
                  placeholder={t("bodyPlaceholder")}
                  className={pitchStyles.bodyTextarea}
                  onChange={(e) => {
                    autoResize(e.currentTarget)
                    updateStepContent(headline, e.target.value)
                  }}
                  onBlur={saveCurrentStep}
                />

              </div>
            </div>

          </div>

          {/* footer */}
          <div className={pitchStyles.footer}>
            <Button
              variant="outline" size="sm"
              onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
              disabled={safeIdx === 0}
              className="text-xs"
            >
              {t("previous")}
            </Button>
            <span className={pitchStyles.footerLabel}>{stepTitle}</span>
            <Button
              size="sm"
              onClick={() => setStepIdx((i) => i + 1)}
              disabled={safeIdx === steps.length - 1}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40"
            >
              {t("next")}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
