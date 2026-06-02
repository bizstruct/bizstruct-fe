"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Plus, Folder, PanelLeftClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, usePathname } from "@/i18n/routing"
import { useProjectStore } from "@/store/use-project-store"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const t = useTranslations("Sidebar")
  const pathname = usePathname()
  const history = useProjectStore((state) => state.history)
  const fetchHistory = useProjectStore((state) => state.fetchHistory)

  useEffect(() => {
    void fetchHistory().catch(() => {})
  }, [fetchHistory])

  return (
    <aside
      className={`bg-white flex flex-col h-screen shrink-0 transition-all duration-300 ease-in-out ${
        isOpen
          ? "w-64 opacity-100 visible border-r border-slate-100"
          : "w-0 opacity-0 invisible overflow-hidden border-none"
      }`}
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100">
        <span className="font-semibold text-slate-900 tracking-tight text-sm">{t("brand")}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          aria-label={t("close")}
          className="h-8 w-8 text-slate-500 hover:text-slate-900"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-3.5">
        <Link
          href="/"
          className="w-full inline-flex items-center justify-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-none text-sm font-medium h-9 rounded-lg px-4 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("newProject")}
        </Link>
      </div>

      <div className="border-t border-slate-100 mx-3" />

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 mt-2">
        <p className="px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
          {t("history")}
        </p>
        {history.map((project) => (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-normal rounded-lg transition-colors text-left truncate ${
              pathname?.endsWith(`/project/${project.id}`)
                ? "bg-slate-50 text-slate-900"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Folder className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{project.title ?? project.id}</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
