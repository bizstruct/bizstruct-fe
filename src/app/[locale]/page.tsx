import { Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { IdeaForm } from "@/components/home/idea-form"
import { ProjectList } from "@/components/home/project-list"

export default function HomePage() {
  const t = useTranslations("Home")
  return (
    <div className="min-h-full">
      <div className="relative mx-auto w-full max-w-3xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-3">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-indigo-700"><Sparkles className="size-3.5" aria-hidden /> {t("eyebrow")}</p>
        <h1 className="text-4xl font-medium leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
          {t("titleLead")}
          <span className="block text-indigo-600 dark:text-indigo-400">{t("titleAccent")}</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600">{t("subtitle")}</p>
      </header>
      <IdeaForm />
      <ProjectList />
      </div>
    </div>
  )
}
