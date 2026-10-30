import { useTranslations } from "next-intl"
import { IdeaForm } from "@/components/home/idea-form"
import { ProjectList } from "@/components/home/project-list"

export default function HomePage() {
  const t = useTranslations("Home")
  return (
    <div className="relative min-h-full">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-100/70 via-violet-50/40 to-transparent" />
      <div className="relative mx-auto w-full max-w-3xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-3">
        <h1 className="bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-700 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">{t("title")}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-600">{t("subtitle")}</p>
      </header>
      <IdeaForm />
      <ProjectList />
      </div>
    </div>
  )
}
