"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, Folder, PanelLeftClose, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { DropdownMenu } from "radix-ui"
import { Button } from "@/components/ui/button"
import { Link, usePathname } from "@/i18n/routing"
import { useProjectStore } from "@/store/use-project-store"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const t = useTranslations("Sidebar")
  const pathname     = usePathname()
  const history      = useProjectStore((s) => s.history)
  const fetchHistory = useProjectStore((s) => s.fetchHistory)
  const deleteProject = useProjectStore((s) => s.deleteProject)
  const renameProject = useProjectStore((s) => s.renameProject)

  const [renamingId, setRenamingId]   = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const renameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void fetchHistory().catch(() => {})
  }, [fetchHistory])

  useEffect(() => {
    if (renamingId) renameInputRef.current?.focus()
  }, [renamingId])

  function startRename(id: string, currentTitle: string) {
    setRenamingId(id)
    setRenameValue(currentTitle ?? "")
  }

  function commitRename(id: string) {
    const trimmed = renameValue.trim()
    if (trimmed) renameProject(id, trimmed)
    setRenamingId(null)
  }

  function handleRenameKey(e: React.KeyboardEvent, id: string) {
    if (e.key === "Enter")  commitRename(id)
    if (e.key === "Escape") setRenamingId(null)
  }

  const isActive = (id: string) => pathname?.endsWith(`/project/${id}`)

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
          variant="ghost" size="icon"
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
          <div
            key={project.id}
            className={`group flex items-center gap-1 rounded-lg transition-colors ${
              isActive(project.id) ? "bg-slate-50" : "hover:bg-slate-50"
            }`}
          >
            {renamingId === project.id ? (
              /* ── inline rename input ── */
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5">
                <Folder className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <input
                  ref={renameInputRef}
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => commitRename(project.id)}
                  onKeyDown={(e) => handleRenameKey(e, project.id)}
                  className="flex-1 min-w-0 text-sm bg-white border border-indigo-300 rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>
            ) : (
              /* ── normal row ── */
              <>
                <Link
                  href={`/project/${project.id}`}
                  className={`flex-1 flex items-center gap-2 px-3 py-2 text-sm font-normal text-left min-w-0 ${
                    isActive(project.id) ? "text-slate-900" : "text-slate-600"
                  }`}
                >
                  <Folder className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{project.title ?? project.id}</span>
                  {/* Generation language — fixed at creation, independent of
                      the viewer's UI locale, so it must stay visible here
                      (otherwise switching the UI locale looks like the
                      system "broke" and started showing the wrong
                      language). See B4 of the follow-up brief. */}
                  <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-slate-400 border border-slate-200 rounded px-1 py-0.5">
                    {project.language}
                  </span>
                </Link>

                {/* ── three-dot menu ── */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className="opacity-0 group-hover:opacity-100 shrink-0 mr-1 h-6 w-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all"
                      aria-label="Project actions"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      side="right"
                      align="start"
                      sideOffset={4}
                      className="z-50 min-w-[140px] rounded-lg border border-slate-200 bg-white py-1 shadow-md text-sm"
                    >
                      <DropdownMenu.Item
                        onSelect={() => startRename(project.id, project.title ?? "")}
                        className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer outline-none"
                      >
                        <Pencil className="h-3.5 w-3.5 text-slate-400" />
                        Rename
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator className="my-1 h-px bg-slate-100 mx-2" />

                      <DropdownMenu.Item
                        onSelect={() => deleteProject(project.id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 cursor-pointer outline-none"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
