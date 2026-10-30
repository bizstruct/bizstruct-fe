import { useTranslations } from "next-intl"
import { IdeaForm } from "@/components/home/idea-form"

// Top-aligned on purpose: the prompt box grows downward only, so the title never moves.
export default function HomePage() {
  const t = useTranslations("Home")
  return (
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-10 px-4 pb-16 pt-[14vh] sm:px-6">
      <h1 className="text-center text-4xl font-medium leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
        {t("titleLead")} <span className="text-indigo-600 dark:text-indigo-400">{t("titleAccent")}</span>
      </h1>
      <div className="mx-auto w-full max-w-3xl">
        <IdeaForm />
      </div>
    </div>
  )
}
