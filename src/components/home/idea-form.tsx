"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/input"
import { notifyProjectsChanged } from "@/hooks/use-projects"
import { createProject } from "@/lib/api/projects"
import { useRouter } from "@/i18n/routing"
import { IDEA_MAX, IDEA_MIN, ideaProblem, OPTIONAL_STAGES, type OptionalStage } from "@/lib/validation/idea"

export function IdeaForm() {
  const t = useTranslations("Home")
  const ts = useTranslations("Stages")
  const locale = useLocale()
  const router = useRouter()
  const [idea, setIdea] = useState("")
  const [language, setLanguage] = useState<"uk" | "en">(locale === "uk" ? "uk" : "en")
  const [optional, setOptional] = useState<OptionalStage[]>([])
  const [advanced, setAdvanced] = useState(false)
  const [autoApprove, setAutoApprove] = useState(false)
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const problem = ideaProblem(idea)
  const showProblem = touched && problem !== null

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (problem) return
    setSubmitting(true)
    setServerError(null)
    const result = await createProject({ idea: idea.trim(), language, enabledOptional: optional, autoApprove })
    setSubmitting(false)
    if (!result.ok) return setServerError(result.kind === "validation" ? result.detail : t("errors.generic"))
    notifyProjectsChanged()
    router.push(`/project/${result.data.id}`)
  }

  const toggle = (stage: OptionalStage) => setOptional((current) => (current.includes(stage) ? current.filter((s) => s !== stage) : [...current, stage]))

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="idea" className="text-sm font-medium text-slate-800">{t("ideaLabel")}</label>
        <Textarea id="idea" name="idea" value={idea} rows={6} placeholder={t("ideaPlaceholder")} aria-invalid={showProblem} aria-describedby="idea-help" onChange={(e) => setIdea(e.target.value)} onBlur={() => setTouched(true)} />
        <p id="idea-help" className="flex flex-wrap justify-between gap-2 text-xs text-slate-500">
          <span>{t("counter", { count: idea.trim().length, max: IDEA_MAX, min: IDEA_MIN })}</span>
          {showProblem ? <span role="alert" className="text-red-700">{t(`errors.${problem}`, { min: IDEA_MIN, max: IDEA_MAX })}</span> : null}
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-800">{t("language")}</legend>
        <div className="flex gap-4 text-sm">
          {(["uk", "en"] as const).map((code) => (
            <label key={code} className="inline-flex items-center gap-2">
              <input type="radio" name="language" value={code} checked={language === code} onChange={() => setLanguage(code)} />
              {code === "uk" ? t("languageUk") : t("languageEn")}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-800">{t("optional")}</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          {OPTIONAL_STAGES.map((stage) => (
            <label key={stage} className="inline-flex items-center gap-2">
              <input type="checkbox" name={stage} checked={optional.includes(stage)} onChange={() => toggle(stage)} />
              {ts(stage)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <button type="button" className="text-sm text-slate-600 underline-offset-4 hover:underline" aria-expanded={advanced} onClick={() => setAdvanced((v) => !v)}>
          {t("advanced")}
        </button>
        {advanced ? (
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="autoApprove" className="mt-1" checked={autoApprove} onChange={(e) => setAutoApprove(e.target.checked)} />
            <span>
              <span className="font-medium text-slate-800">{t("autoApprove")}</span>
              <span className="block text-xs text-slate-500">{t("autoApproveHint")}</span>
            </span>
          </label>
        ) : null}
      </div>

      {serverError ? <p role="alert" className="text-sm text-red-700">{serverError}</p> : null}
      <Button type="submit" size="lg" disabled={submitting}>{submitting ? t("submitting") : t("submit")}</Button>
    </form>
  )
}
