import { useTranslations } from "next-intl"
import { IdeaForm } from "@/components/home/idea-form"

export default function HomePage() {
  const t = useTranslations("Home")
  return (
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col justify-center gap-10 px-4 py-16 sm:px-6">
      <h1 className="text-center text-4xl font-medium leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
        {t("titleLead")}
        <span className="block text-indigo-600 dark:text-indigo-400">{t("titleAccent")}</span>
      </h1>
      <div className="mx-auto w-full max-w-3xl">
        <IdeaForm />
      </div>
    </div>
  )
}
