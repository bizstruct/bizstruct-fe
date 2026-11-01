"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { LogOut, PanelLeftClose, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/hooks/use-projects"
import { logout } from "@/lib/api/auth"
import { groupByRecency } from "@/lib/mappers/recency"
import { cn } from "@/lib/utils"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { ProjectMenu } from "./project-menu"
import { ThemeToggle } from "./theme-toggle"

const STATUS_DOT = { running: "animate-pulse bg-sky-500", completed: "bg-emerald-500", failed: "bg-red-500" } as const

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const t = useTranslations("Sidebar")
  const pathname = usePathname()
  const router = useRouter()
  const { projects } = useProjects()
  // Taken once per mount: the grouping only needs the day, and a stable value keeps renders pure.
  const [now] = useState(() => new Date())

  async function signOut() {
    await logout()
    router.replace("/login")
  }

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col bg-white transition-all duration-300 ease-in-out",
        isOpen ? "visible w-64 border-r border-slate-200 opacity-100" : "invisible w-0 overflow-hidden border-none opacity-0",
      )}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <span className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-slate-900">
          <span aria-hidden className="size-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/15" />
          {t("brand")}
        </span>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label={t("close")} className="size-8 rounded-lg text-slate-500 hover:text-slate-900">
          <PanelLeftClose className="size-4" />
        </Button>
      </div>

      <div className="px-3 pb-3 pt-1">
        <Link
          href="/"
          className="flex h-10 w-full items-center gap-2 rounded-xl border border-indigo-500/70 px-3.5 text-sm font-medium text-indigo-700 transition-colors hover:border-indigo-500 hover:bg-indigo-50"
        >
          <Plus className="size-4" />
          {t("newProject")}
        </Link>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2 pb-3" aria-label={t("history")}>
        {projects === null ? <p className="px-3 pt-2 text-xs text-slate-400">{t("loading")}</p> : null}
        {projects?.length === 0 ? (
          <p className="mx-1 rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400">{t("empty")}</p>
        ) : null}
        {projects
          ? groupByRecency(projects, now).map(({ group, items }) => (
              <section key={group} aria-label={t(`group_${group}`)} className="space-y-0.5">
                <h2 className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">{t(`group_${group}`)}</h2>
                {items.map((p) => {
                  const active = pathname?.endsWith(`/project/${p.id}`)
                  return (
                    <div key={p.id} className="group/item relative">
                      <Link
                        href={`/project/${p.id}`}
                        title={p.title}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative flex items-center gap-2.5 rounded-xl py-2 pl-3 pr-9 text-sm transition-colors",
                          active ? "bg-indigo-50 font-medium text-indigo-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        {active ? <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-indigo-500" /> : null}
                        <span aria-hidden className={cn("size-2 shrink-0 rounded-full", STATUS_DOT[p.status])} />
                        <span className="truncate">{p.title}</span>
                      </Link>
                      <ProjectMenu project={p} />
                    </div>
                  )
                })}
              </section>
            ))
          : null}
      </nav>

      <div className="flex items-center justify-between gap-1 border-t border-slate-200 p-2.5">
        <Button variant="ghost" size="sm" className="h-9 justify-start gap-2 rounded-xl px-3 text-slate-600 hover:text-slate-900" onClick={() => void signOut()}>
          <LogOut className="size-4" /> {t("signOut")}
        </Button>
        <ThemeToggle iconOnly />
      </div>
    </aside>
  )
}
