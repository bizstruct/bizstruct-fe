"use client"

import { useTranslations } from "next-intl"
import { LogOut, PanelLeftClose, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/hooks/use-projects"
import { logout } from "@/lib/api/auth"
import { Link, usePathname, useRouter } from "@/i18n/routing"
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

  async function signOut() {
    await logout()
    router.replace("/login")
  }

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col bg-white shadow-sm transition-all duration-300 ease-in-out ${
        isOpen ? "visible w-64 border-r border-slate-100 opacity-100" : "invisible w-0 overflow-hidden border-none opacity-0"
      }`}
    >
      <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4">
        <span className="flex items-center gap-2 text-sm font-bold tracking-tight text-slate-900"><span aria-hidden className="size-2.5 rounded-full bg-indigo-500" />{t("brand")}</span>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label={t("close")} className="h-8 w-8 text-slate-500 hover:text-slate-900">
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-3.5">
        <Link href="/" className="inline-flex h-10 w-full items-center justify-start gap-2 rounded-xl border border-indigo-500 px-4 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50">
          <Plus className="h-4 w-4" />
          {t("newProject")}
        </Link>
      </div>

      <div className="mx-3 border-t border-slate-100" />

      <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto p-2" aria-label={t("history")}>
        <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">{t("history")}</p>
        {projects === null ? <p className="px-3 text-xs text-slate-400">{t("loading")}</p> : null}
        {projects?.length === 0 ? <p className="px-3 text-xs text-slate-400">{t("empty")}</p> : null}
        {projects?.map((p) => (
          <Link
            key={p.id}
            href={`/project/${p.id}`}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 ${pathname?.endsWith(`/project/${p.id}`) ? "bg-indigo-50 font-semibold text-indigo-900" : ""}`}
          >
            <span aria-hidden className={`size-2 shrink-0 rounded-full ${STATUS_DOT[p.status]}`} />
            <span className="truncate">{p.title}</span>
          </Link>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-slate-100 p-3">
        <ThemeToggle />
        <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600" onClick={() => void signOut()}>
          <LogOut /> {t("signOut")}
        </Button>
      </div>
    </aside>
  )
}
