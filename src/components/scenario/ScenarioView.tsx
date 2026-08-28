"use client"

import React, { useState, useRef } from "react"
import { Target, Sparkles, Zap, Calendar, CheckCircle, TrendingUp, User, BarChart2, Check, Loader2, RefreshCw, ArrowRight, ClipboardCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { ScenarioData, StepType } from "@/schemas/scenario.schema"
import { saveScenario } from "@/services/scenario"
import { scenarioStyles } from "./styles"

// icon_key used to be stored on TimelineStep, but it was 100% derivable from
// step_type (a fixed mapping) — pure presentation data that added nothing
// domain-specific, so it was removed from the domain model. This is that
// same fixed mapping, now living client-side where it belongs.
const TIMELINE_ICONS: Record<StepType, React.ElementType> = {
  context: Calendar,
  goal:    Target,
  action:  Zap,
  result:  CheckCircle,
  impact:  TrendingUp,
}

const STEP_THEMES: Record<StepType, { icon: string; item: string; label: string }> = {
  context: { icon: "bg-sky-100 text-sky-600",        item: "border-l-2 border-sky-300 bg-sky-50/60",        label: "text-sky-600"    },
  goal:    { icon: "bg-violet-100 text-violet-600",   item: "border-l-2 border-violet-300 bg-violet-50/60",   label: "text-violet-600" },
  action:  { icon: "bg-indigo-100 text-indigo-600",   item: "border-l-2 border-indigo-300 bg-indigo-50/60",   label: "text-indigo-600" },
  result:  { icon: "bg-emerald-100 text-emerald-600", item: "border-l-2 border-emerald-300 bg-emerald-50/60", label: "text-emerald-600"},
  impact:  { icon: "bg-amber-100 text-amber-600",     item: "border-l-2 border-amber-300 bg-amber-50/60",     label: "text-amber-600"  },
}

// Scenario is single-language per project (part E — no more text_uk/text_en,
// name_uk/name_en, etc. pairs); generation language is a project-level
// setting, not the viewer's UI locale, so fields are read/written directly.

function computeInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("")
}

type SaveStatus = "idle" | "dirty" | "saving" | "saved"

interface Props {
  projectId:          string
  scenarioData:       ScenarioData
  onNext?:            () => void
  hasSubsequentData?: boolean
}

export function ScenarioView({ projectId, scenarioData, onNext, hasSubsequentData }: Props) {
  const t = useTranslations("ScenarioView")

  const [data,           setData]           = useState<ScenarioData>(scenarioData)
  const [editingField,   setEditingField]   = useState<string | null>(null)
  const [saveStatus,     setSaveStatus]     = useState<SaveStatus>("idle")
  const [validateStatus, setValidateStatus] = useState<"idle" | "validating">("idle")
  const editOriginalRef                     = useRef<string>("")

  function markDirty() { setSaveStatus("dirty") }

  function startEdit(fieldId: string, currentValue: string) {
    editOriginalRef.current = currentValue
    setEditingField(fieldId)
  }

  // ── setters ──────────────────────────────────────────────────────────────

  // prev.timeline.map() returns a plain array, not ScenarioData["timeline"]'s
  // generated 5-tuple type (json-schema-to-typescript encodes minItems:5/
  // maxItems:5 that way) — the backend is what actually enforces that
  // constraint on save, so a cast here is fine.
  function setStepText(stepType: StepType, text: string) {
    setData(prev => ({
      ...prev,
      timeline: prev.timeline.map(s => s.step_type === stepType ? { ...s, text } : s) as ScenarioData["timeline"],
    }))
    markDirty()
  }

  function setPersonaField(field: "role" | "pain_point" | "name", value: string) {
    setData(prev => ({ ...prev, persona: { ...prev.persona, [field]: value } }))
    markDirty()
  }

  function setMetricValue(side: "before" | "after", value: string) {
    setData(prev => ({ ...prev, metrics: { ...prev.metrics, [side]: { ...prev.metrics[side], value } } }))
    markDirty()
  }

  function setMetricLabel(side: "before" | "after", label: string) {
    setData(prev => ({ ...prev, metrics: { ...prev.metrics, [side]: { ...prev.metrics[side], label } } }))
    markDirty()
  }

  // ── blur handlers — revert to original if field left empty ────────────────

  function blurPersonaField(field: "name" | "role" | "pain_point") {
    setData(prev => {
      if (!prev.persona[field].trim()) {
        return { ...prev, persona: { ...prev.persona, [field]: editOriginalRef.current } }
      }
      return prev
    })
    setEditingField(null)
  }

  function blurStepText(stepType: StepType) {
    setData(prev => {
      const step = prev.timeline.find(s => s.step_type === stepType)
      if (step && !step.text.trim()) {
        return {
          ...prev,
          timeline: prev.timeline.map(s => s.step_type === stepType ? { ...s, text: editOriginalRef.current } : s) as ScenarioData["timeline"],
        }
      }
      return prev
    })
    setEditingField(null)
  }

  function blurMetricValue(side: "before" | "after") {
    setData(prev => {
      if (!prev.metrics[side].value.trim()) {
        return { ...prev, metrics: { ...prev.metrics, [side]: { ...prev.metrics[side], value: editOriginalRef.current } } }
      }
      return prev
    })
    setEditingField(null)
  }

  function blurMetricLabel(side: "before" | "after") {
    setData(prev => {
      if (!prev.metrics[side].label.trim()) {
        return { ...prev, metrics: { ...prev.metrics, [side]: { ...prev.metrics[side], label: editOriginalRef.current } } }
      }
      return prev
    })
    setEditingField(null)
  }

  // ── save ─────────────────────────────────────────────────────────────────

  async function validate() {
    if (validateStatus === "validating") return
    setValidateStatus("validating")
    try {
      // TODO: send data to LLM validation endpoint
      await new Promise<void>(resolve => setTimeout(resolve, 1500))
    } finally {
      setValidateStatus("idle")
    }
  }

  async function save() {
    if (saveStatus !== "dirty") return
    setSaveStatus("saving")
    try {
      await saveScenario(projectId, data)
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch {
      setSaveStatus("dirty")
    }
  }

  const saveBtnClass = {
    idle:   "h-7 gap-1.5 text-xs font-semibold cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-100",
    dirty:  "h-7 gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white",
    saving: "h-7 gap-1.5 text-xs font-semibold bg-indigo-400 text-white cursor-wait",
    saved:  "h-7 gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-600 text-white",
  }[saveStatus]

  const { persona, timeline, metrics } = data

  const personaName      = persona.name
  const personaRole      = persona.role
  const personaPainPoint = persona.pain_point
  const initials          = computeInitials(personaName)

  const metricBeforeValue = metrics.before.value
  const metricBeforeLabel = metrics.before.label
  const metricAfterValue  = metrics.after.value
  const metricAfterLabel  = metrics.after.label

  const timelineLabels: Record<StepType, string> = {
    context: t("timeline.context"),
    goal:    t("timeline.goal"),
    action:  t("timeline.action"),
    result:  t("timeline.result"),
    impact:  t("timeline.impact"),
  }

  return (
    <div className={scenarioStyles.root}>
      <div className={scenarioStyles.header}>
        <div>
          <span className={scenarioStyles.headerTitle}>{t("title")}</span>
          <p className={scenarioStyles.headerSubtitle}>{t("subtitle")}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="sm"
              disabled={validateStatus === "validating"}
              onClick={() => void validate()}
              className="h-7 gap-1.5 text-xs border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700"
            >
              {validateStatus === "validating"
                ? <Loader2 className="h-3 w-3 animate-spin" />
                : <ClipboardCheck className="h-3 w-3" />}
              {t("validate")}
            </Button>
            {!hasSubsequentData && (
              <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700">
                <RefreshCw className="h-3 w-3" /> {t("regenerate")}
              </Button>
            )}
            <Button
              size="sm"
              disabled={saveStatus === "idle" || saveStatus === "saving"}
              onClick={() => void save()}
              className={cn("transition-colors", saveBtnClass)}
            >
              {saveStatus === "saving" ? (
                <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>
              ) : saveStatus === "saved" ? (
                <><Check className="h-3 w-3" /> {t("saved")}</>
              ) : (
                <><Check className="h-3 w-3" /> {t("save")}</>
              )}
            </Button>
          </div>
          {onNext && (
            <Button
              size="sm"
              onClick={onNext}
              disabled={saveStatus === "dirty" || saveStatus === "saving"}
              className="h-7 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white w-full justify-between disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t("nextStep")} <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <div className={scenarioStyles.body}>
        {/* Metrics — top full-width */}
        <div className={cn(scenarioStyles.metricsCard, "mb-5")}>
          <div className={scenarioStyles.metricsInner}>
            <div className={scenarioStyles.metricsHeader}>
              <div className={cn(scenarioStyles.cardIcon, "bg-indigo-100 text-indigo-600")}>
                <BarChart2 className="h-3.5 w-3.5" />
              </div>
              <h3 className={cn(scenarioStyles.metricsTitle, "text-indigo-700")}>{t("resultTitle")}</h3>
            </div>
            <div className={scenarioStyles.metricsGrid}>
              <div className={scenarioStyles.metricBefore}>
                {editingField === "metric.before" ? (
                  <input
                    autoFocus
                    value={metricBeforeValue}
                    onChange={(e) => setMetricValue("before", e.target.value)}
                    onBlur={() => blurMetricValue("before")}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") blurMetricValue("before") }}
                    className={cn(scenarioStyles.editMetricInput, "text-5xl text-slate-300 border-slate-300")}
                  />
                ) : (
                  <div
                    onClick={() => startEdit("metric.before", metricBeforeValue)}
                    className={cn(scenarioStyles.metricBeforeVal, "cursor-text")}
                  >
                    {metricBeforeValue}
                  </div>
                )}
                {editingField === "metric.before.label" ? (
                  <input
                    autoFocus
                    value={metricBeforeLabel}
                    onChange={(e) => setMetricLabel("before", e.target.value)}
                    onBlur={() => blurMetricLabel("before")}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") blurMetricLabel("before") }}
                    className="text-xs text-slate-500 text-center bg-transparent border-b border-slate-200 focus:outline-none focus:border-slate-400 w-full"
                  />
                ) : (
                  <div
                    onClick={() => startEdit("metric.before.label", metricBeforeLabel)}
                    className={cn(scenarioStyles.metricLabel, "cursor-text")}
                  >
                    {metricBeforeLabel}
                  </div>
                )}
              </div>

              <div className={scenarioStyles.metricAfter}>
                {editingField === "metric.after" ? (
                  <input
                    autoFocus
                    value={metricAfterValue}
                    onChange={(e) => setMetricValue("after", e.target.value)}
                    onBlur={() => blurMetricValue("after")}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") blurMetricValue("after") }}
                    className={cn(scenarioStyles.editMetricInput, "text-5xl text-indigo-600 border-indigo-400")}
                  />
                ) : (
                  <div
                    onClick={() => startEdit("metric.after", metricAfterValue)}
                    className={cn(scenarioStyles.metricAfterVal, "cursor-text")}
                  >
                    {metricAfterValue}
                  </div>
                )}
                <div className={scenarioStyles.metricAfterTag}>
                  <Zap className="h-3.5 w-3.5" />
                  {editingField === "metric.after.label" ? (
                    <input
                      autoFocus
                      value={metricAfterLabel}
                      onChange={(e) => setMetricLabel("after", e.target.value)}
                      onBlur={() => blurMetricLabel("after")}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") blurMetricLabel("after") }}
                      className="text-xs text-indigo-500 bg-transparent border-b border-indigo-200 focus:outline-none focus:border-indigo-400 min-w-0 flex-1"
                    />
                  ) : (
                    <span
                      onClick={() => startEdit("metric.after.label", metricAfterLabel)}
                      className="cursor-text"
                    >
                      {metricAfterLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={scenarioStyles.grid}>
          {/* Persona card */}
          <div className={scenarioStyles.personaCardWrap}>
            <Card className={cn(scenarioStyles.card, "border-indigo-100 bg-indigo-50/30")}>
              <div className={scenarioStyles.cardInner}>
                <div className={scenarioStyles.cardHeader}>
                  <div className={cn(scenarioStyles.cardIcon, "bg-indigo-100 text-indigo-600")}>
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <h3 className={cn(scenarioStyles.cardTitle, "text-indigo-700")}>{t("persona.sectionTitle")}</h3>
                </div>

                <div className={scenarioStyles.personaTopRow}>
                  <div className={scenarioStyles.avatar}>{initials}</div>
                  <div className="flex-1 min-w-0">
                    {editingField === "persona.name" ? (
                      <input
                        autoFocus
                        value={personaName}
                        onChange={(e) => setPersonaField("name", e.target.value)}
                        onBlur={() => blurPersonaField("name")}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") blurPersonaField("name") }}
                        className="text-sm font-semibold text-slate-900 bg-transparent border-b border-slate-300 focus:outline-none focus:border-indigo-400 w-full leading-tight"
                      />
                    ) : (
                      <div
                        onClick={() => startEdit("persona.name", personaName)}
                        className={cn(scenarioStyles.personaName, "cursor-text border-b border-transparent")}
                      >
                        {personaName}
                      </div>
                    )}
                    <div className={scenarioStyles.personaRole}>{personaRole}</div>
                  </div>
                </div>

                <div className={scenarioStyles.personaFields}>
                  <div>
                    <div className={scenarioStyles.fieldLabel}>{t("persona.roleLabel")}</div>
                    {editingField === "persona.role" ? (
                      <input
                        autoFocus
                        value={personaRole}
                        onChange={(e) => setPersonaField("role", e.target.value)}
                        onBlur={() => blurPersonaField("role")}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") blurPersonaField("role") }}
                        className={cn(scenarioStyles.editBadgeInput, "border-indigo-200 bg-indigo-50 text-indigo-700 focus:ring-indigo-300")}
                      />
                    ) : (
                      <div
                        onClick={() => startEdit("persona.role", personaRole)}
                        className={cn(scenarioStyles.roleBadge, "cursor-text")}
                      >
                        {personaRole}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className={scenarioStyles.fieldLabel}>{t("persona.painPointLabel")}</div>
                    {editingField === "persona.pain_point" ? (
                      <input
                        autoFocus
                        value={personaPainPoint}
                        onChange={(e) => setPersonaField("pain_point", e.target.value)}
                        onBlur={() => blurPersonaField("pain_point")}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") blurPersonaField("pain_point") }}
                        className={cn(scenarioStyles.editBadgeInput, "border-rose-200 bg-rose-50 text-rose-700 focus:ring-rose-300")}
                      />
                    ) : (
                      <div
                        onClick={() => startEdit("persona.pain_point", personaPainPoint)}
                        className={cn(scenarioStyles.painBadge, "cursor-text")}
                      >
                        {personaPainPoint}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Timeline card */}
          <div className={scenarioStyles.timelineCardWrap}>
            <Card className={cn(scenarioStyles.card, "border-slate-100 bg-white")}>
              <div className={scenarioStyles.cardInner}>
                <div className={scenarioStyles.cardHeader}>
                  <div className={cn(scenarioStyles.cardIcon, "bg-slate-100 text-slate-600")}>
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>
                  <h3 className={cn(scenarioStyles.cardTitle, "text-slate-600")}>{t("timeline.sectionTitle")}</h3>
                </div>

                <div className={scenarioStyles.timelineSteps}>
                  {timeline.map((step) => {
                    const Icon    = TIMELINE_ICONS[step.step_type] ?? Sparkles
                    const theme   = STEP_THEMES[step.step_type]
                    const label   = timelineLabels[step.step_type]
                    const fieldId = `step.${step.step_type}`
                    const text    = step.text
                    return (
                      <div key={step.step_type} className={cn(scenarioStyles.timelineStep, theme.item)}>
                        <div className={cn(scenarioStyles.timelineStepIcon, theme.icon)}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className={scenarioStyles.timelineContent}>
                          <div className={cn(scenarioStyles.timelineLabel, theme.label)}>{label}</div>
                          {editingField === fieldId ? (
                            <textarea
                              autoFocus
                              value={text}
                              rows={1}
                              ref={(el) => {
                                if (el) { el.style.height = "auto"; el.style.height = `${el.scrollHeight}px` }
                              }}
                              onChange={(e) => {
                                setStepText(step.step_type, e.target.value)
                                e.target.style.height = "auto"
                                e.target.style.height = `${e.target.scrollHeight}px`
                              }}
                              onBlur={() => blurStepText(step.step_type)}
                              onKeyDown={(e) => { if (e.key === "Escape") blurStepText(step.step_type) }}
                              className={scenarioStyles.editTextarea}
                            />
                          ) : (
                            <div
                              onClick={() => startEdit(fieldId, text)}
                              className={cn(scenarioStyles.timelineText, "cursor-text")}
                            >
                              {text}
                            </div>
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
      </div>
    </div>
  )
}
