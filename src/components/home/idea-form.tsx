"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { motion } from "motion/react"
import { Check, Languages, Settings2, Sparkles } from "lucide-react"
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
    <form onSubmit={submit} className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-indigo-100/50 sm:p-8" noValidate>
      <div className="space-y-2">
        <label htmlFor="idea" className="text-sm font-semibold text-slate-800">{t("ideaLabel")}</label>
        <Textarea id="idea" name="idea" value={idea} rows={6} placeholder={t("ideaPlaceholder")} aria-invalid={showProblem} aria-describedby="idea-help" onChange={(e) => setIdea(e.target.value)} onBlur={() => setTouched(true)} />
        <p id="idea-help" className="flex flex-wrap justify-between gap-2 text-xs text-slate-500">
          <span>{t("counter", { count: idea.trim().length, max: IDEA_MAX, min: IDEA_MIN })}</span>
          {showProblem ? <span role="alert" className="text-red-700">{t(`errors.${problem}`, { min: IDEA_MIN, max: IDEA_MAX })}</span> : null}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <fieldset className="space-y-2.5">
          <legend className="flex items-center gap-1.5 text-sm font-semibold text-slate-800"><Languages className="size-4 text-indigo-500" aria-hidden /> {t("language")}</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["uk", "en"] as const).map((code) => (
              <label key={code} className="cursor-pointer">
                <input type="radio" name="language" value={code} className="peer sr-only" checked={language === code} onChange={() => setLanguage(code)} />
                <span className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-indigo-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-900 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-300">
                  {code === "uk" ? t("languageUk") : t("languageEn")}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2.5">
          <legend className="flex items-center gap-1.5 text-sm font-semibold text-slate-800"><Sparkles className="size-4 text-indigo-500" aria-hidden /> {t("optional")}</legend>
          <div className="flex flex-wrap gap-2">
            {OPTIONAL_STAGES.map((stage) => (
              <label key={stage} className="cursor-pointer">
                <input type="checkbox" name={stage} className="peer sr-only" checked={optional.includes(stage)} onChange={() => toggle(stage)} />
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-indigo-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-900 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-300">
                  {optional.includes(stage) ? <Check className="size-4" aria-hidden /> : null}
                  {ts(stage)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="space-y-2">
        <button type="button" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900" aria-expanded={advanced} onClick={() => setAdvanced((v) => !v)}>
          <Settings2 className="size-4" aria-hidden /> {t("advanced")}
        </button>
        {advanced ? (
          <motion.label initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-sm">
            <input type="checkbox" name="autoApprove" className="mt-1 size-4 accent-indigo-600" checked={autoApprove} onChange={(e) => setAutoApprove(e.target.checked)} />
            <span>
              <span className="font-medium text-slate-800">{t("autoApprove")}</span>
              <span className="block text-xs text-slate-500">{t("autoApproveHint")}</span>
            </span>
          </motion.label>
        ) : null}
      </div>

      {serverError ? <p role="alert" className="text-sm text-red-700">{serverError}</p> : null}
      <Button type="submit" size="lg" disabled={submitting} className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-base font-semibold shadow-lg shadow-indigo-200 transition-transform hover:scale-[1.01] hover:from-indigo-700 hover:to-violet-700 sm:w-auto sm:px-8">{submitting ? t("submitting") : t("submit")}</Button>
    </form>
  )
}
