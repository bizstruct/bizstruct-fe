import { useTranslations } from "next-intl"
import { IdeaForm } from "@/components/home/idea-form"
import { ProjectList } from "@/components/home/project-list"

export default function HomePage() {
  const t = useTranslations("Home")
  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{t("title")}</h1>
        <p className="text-slate-600">{t("subtitle")}</p>
      </header>
      <IdeaForm />
      <ProjectList />
    </div>
  )
}
