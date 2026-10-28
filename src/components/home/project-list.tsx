"use client"

import { useLocale, useTranslations } from "next-intl"
import { useProjects } from "@/hooks/use-projects"
import { Link } from "@/i18n/routing"
import { ProjectStatusChip } from "@/components/project/status-chip"

export function ProjectList() {
  const t = useTranslations("Home")
  const locale = useLocale()
  const { projects, error } = useProjects()

  return (
    <section className="space-y-3" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="text-xl font-bold tracking-tight text-slate-900">{t("projectsTitle")}</h2>
      {error ? <p role="alert" className="text-sm text-red-700">{t("loadError")}</p> : null}
      {projects?.length === 0 ? <p className="text-sm text-slate-500">{t("noProjects")}</p> : null}
      <ul className="grid gap-3 sm:grid-cols-2">
        {projects?.map((p) => (
          <li key={p.id}>
            <Link href={`/project/${p.id}`} className="group block h-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/40 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100">
              <div className="flex items-start justify-between gap-2">
                <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-indigo-900">{p.title}</h3>
                <ProjectStatusChip status={p.status} />
              </div>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">{p.idea}</p>
              <p className="mt-2 text-xs text-slate-400">{p.language.toUpperCase()} · {t("created")} {new Date(p.createdAt).toLocaleDateString(locale)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
