"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { ArrowUp, Check, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { notifyProjectsChanged } from "@/hooks/use-projects"
import { createProject } from "@/lib/api/projects"
import { useRouter } from "@/i18n/routing"
import { detectLanguage, preferredLanguage } from "@/lib/language"
import { IDEA_MAX, IDEA_MIN, ideaProblem, OPTIONAL_STAGES, type OptionalStage } from "@/lib/validation/idea"

/** One text box and one button. Language is detected, not asked; the rarely used options stay folded away. */
export function IdeaForm() {
  const t = useTranslations("Home")
  const ts = useTranslations("Stages")
  const locale = useLocale()
  const router = useRouter()
  const [idea, setIdea] = useState("")
  const [optional, setOptional] = useState<OptionalStage[]>([])
  const [autoApprove, setAutoApprove] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const problem = ideaProblem(idea)
  const showProblem = touched && problem !== null

  // Read from the browser when needed, never during render on the server.
  const language = () => detectLanguage(idea, preferredLanguage(typeof navigator === "undefined" ? [] : navigator.languages ?? [navigator.language], locale))

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (problem) return
    setSubmitting(true)
    setServerError(null)
    const result = await createProject({ idea: idea.trim(), language: language(), enabledOptional: optional, autoApprove })
    setSubmitting(false)
    if (!result.ok) return setServerError(result.kind === "validation" ? result.detail : t("errors.generic"))
    notifyProjectsChanged()
    router.push(`/project/${result.data.id}`)
  }

  const toggle = (stage: OptionalStage) => setOptional((current) => (current.includes(stage) ? current.filter((s) => s !== stage) : [...current, stage]))

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <div className="rounded-2xl border border-slate-200 bg-white transition-colors focus-within:border-indigo-500">
        <label htmlFor="idea" className="sr-only">{t("ideaLabel")}</label>
        <textarea
          id="idea"
          name="idea"
          value={idea}
          rows={3}
          placeholder={t("ideaPlaceholder")}
          aria-invalid={showProblem}
          aria-describedby="idea-help"
          onChange={(e) => setIdea(e.target.value)}
          onBlur={() => setTouched(true)}
          className="field-sizing-content block max-h-72 min-h-28 w-full resize-none rounded-2xl bg-transparent px-5 pt-4 text-[15px] leading-relaxed text-slate-900 outline-none placeholder:text-slate-400"
        />
        <div className="flex items-center justify-between gap-3 px-3 pb-3 pl-5">
          <p id="idea-help" className="min-w-0 truncate text-xs text-slate-500">
            {showProblem ? (
              <span role="alert" className="text-red-700">{t(`errors.${problem}`, { min: IDEA_MIN, max: IDEA_MAX })}</span>
            ) : (
              t("counter", { count: idea.trim().length, max: IDEA_MAX, min: IDEA_MIN })
            )}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button type="button" variant="ghost" size="icon" aria-label={t("options")} aria-expanded={showOptions} onClick={() => setShowOptions((v) => !v)} className="size-9 rounded-xl text-slate-500 hover:text-slate-900">
              <SlidersHorizontal className="size-4" />
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              aria-label={submitting ? t("submitting") : t("submit")}
              className="h-9 rounded-xl bg-indigo-600 px-4 font-medium text-[#fff] hover:bg-indigo-700 dark:bg-indigo-400 dark:text-[#12141c] dark:hover:bg-indigo-300"
            >
              {submitting ? t("submitting") : t("submit")} <ArrowUp className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>

      {showOptions ? (
        <fieldset className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
          <legend className="sr-only">{t("options")}</legend>
          <div className="flex flex-wrap gap-2">
            {OPTIONAL_STAGES.map((stage) => (
              <label key={stage} className="cursor-pointer">
                <input type="checkbox" name={stage} className="peer sr-only" checked={optional.includes(stage)} onChange={() => toggle(stage)} />
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-indigo-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-900 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-300">
                  {optional.includes(stage) ? <Check className="size-3.5" aria-hidden /> : null}
                  {ts(stage)}
                </span>
              </label>
            ))}
          </div>
          <label className="flex items-start gap-2.5 text-sm">
            <input type="checkbox" name="autoApprove" className="mt-0.5 size-4 accent-indigo-600" checked={autoApprove} onChange={(e) => setAutoApprove(e.target.checked)} />
            <span>
              <span className="font-medium text-slate-800">{t("autoApprove")}</span>
              <span className="block text-xs text-slate-500">{t("autoApproveHint")}</span>
            </span>
          </label>
        </fieldset>
      ) : null}

      {serverError ? <p role="alert" className="text-sm text-red-700">{serverError}</p> : null}
    </form>
  )
}
