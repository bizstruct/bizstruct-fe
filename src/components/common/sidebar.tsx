"use client"

import { useTranslations } from "next-intl"
import { Plus, Folder, PanelLeftClose } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const projectHistory = [
  { id: 1, key: "ecoSync" },
  { id: 2, key: "greenLogistics" },
  { id: 3, key: "carbonTrack" },
  { id: 4, key: "agroEsg" },
] as const

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const t = useTranslations("Sidebar")

  if (!isOpen) return null

  return (
    <aside className="w-64 border-r border-slate-100 bg-white flex flex-col h-screen shrink-0 transition-all">
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
        <Button className="w-full justify-start gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-none text-sm font-medium h-9 rounded-lg">
          <Plus className="h-4 w-4" />
          {t("newProject")}
        </Button>
      </div>

      <div className="border-t border-slate-100 mx-3" />

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 mt-2">
        <p className="px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
          {t("history")}
        </p>
        {projectHistory.map((project) => (
          <button
            key={project.id}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-normal text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors text-left truncate"
          >
            <Folder className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{t(`projects.${project.key}`)}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
