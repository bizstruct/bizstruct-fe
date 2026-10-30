import { useTranslations } from "next-intl"
import { IdeaForm } from "@/components/home/idea-form"

export default function HomePage() {
  const t = useTranslations("Home")
  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center gap-8 px-4 py-16 sm:px-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-medium leading-[1.1] tracking-tight text-slate-900 sm:text-4xl">
          {t("titleLead")}
          <span className="block text-indigo-600 dark:text-indigo-400">{t("titleAccent")}</span>
        </h1>
        <p className="max-w-md text-[15px] leading-relaxed text-slate-500">{t("subtitle")}</p>
      </header>
      <IdeaForm />
    </div>
  )
}
