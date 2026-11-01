"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Info, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { notifyProjectsChanged } from "@/hooks/use-projects"
import { deleteProject, renameProject } from "@/lib/api/projects"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "@/i18n/routing"
import type { ProjectSummary } from "@/types/api"
import { ProjectStatusChip } from "../project/status-chip"

type Dialogs = "rename" | "details" | "delete" | null

/** The "..." of a project in the sidebar: rename (the only field be lets change), details, delete. */
export function ProjectMenu({ project }: { project: ProjectSummary }) {
  const t = useTranslations("ProjectMenu")
  const ta = useTranslations("Actions")
  const td = useTranslations("Delete")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [dialog, setDialog] = useState<Dialogs>(null)
  const [title, setTitle] = useState(project.title)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  const close = () => {
    setDialog(null)
    setFailed(false)
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    const next = title.trim()
    if (!next || next === project.title) return close()
    setBusy(true)
    const result = await renameProject(project.id, next)
    setBusy(false)
    if (!result.ok) return setFailed(true)
    notifyProjectsChanged()
    close()
  }

  async function remove() {
    setBusy(true)
    const result = await deleteProject(project.id)
    setBusy(false)
    if (!result.ok) return setFailed(true)
    notifyProjectsChanged()
    close()
    if (pathname?.endsWith(`/project/${project.id}`)) router.replace("/")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={t("options")}
            className={cn(
              "absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 opacity-0 transition-opacity hover:bg-slate-100 hover:text-slate-900",
              "focus-visible:opacity-100 group-hover/item:opacity-100 data-[state=open]:bg-slate-100 data-[state=open]:opacity-100",
            )}
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onSelect={() => { setTitle(project.title); setDialog("rename") }}>
            <Pencil /> {t("rename")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDialog("details")}>
            <Info /> {t("details")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setDialog("delete")} className="text-red-700 [&_svg]:text-red-600">
            <Trash2 /> {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialog === "rename"} onOpenChange={(open) => (open ? undefined : close())}>
        <DialogContent>
          <form onSubmit={save} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>{t("renameTitle")}</DialogTitle>
            </DialogHeader>
            <label htmlFor={`title-${project.id}`} className="sr-only">{t("renameLabel")}</label>
            <Input id={`title-${project.id}`} value={title} maxLength={255} onChange={(e) => setTitle(e.target.value)} autoFocus />
            {failed ? <p role="alert" className="text-sm text-red-700">{ta("failed")}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>{ta("cancel")}</Button>
              <Button type="submit" disabled={busy || !title.trim()}>{busy ? ta("working") : t("save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "details"} onOpenChange={(open) => (open ? undefined : close())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("detailsTitle")}</DialogTitle>
            <DialogDescription className="sr-only">{project.title}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 text-sm">
            <p className="leading-relaxed text-slate-800">{project.idea}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-slate-600">
              <dt>{t("status")}</dt>
              <dd><ProjectStatusChip status={project.status} /></dd>
              <dt>{t("language")}</dt>
              <dd className="text-slate-800">{project.language.toUpperCase()}</dd>
              <dt>{t("created")}</dt>
              <dd className="text-slate-800">{new Date(project.createdAt).toLocaleString(locale)}</dd>
              <dt>{t("optional")}</dt>
              <dd className="text-slate-800">{project.enabledOptional.length ? project.enabledOptional.join(", ") : t("none")}</dd>
              <dt>{t("autoApprove")}</dt>
              <dd className="text-slate-800">{project.autoApprove ? t("yes") : t("no")}</dd>
            </dl>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>{t("close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "delete"} onOpenChange={(open) => (open ? undefined : close())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{td("title")}</DialogTitle>
            <DialogDescription>{td("body")}</DialogDescription>
          </DialogHeader>
          {failed ? <p role="alert" className="text-sm text-red-700">{ta("failed")}</p> : null}
          <DialogFooter>
            <Button variant="outline" onClick={close}>{ta("cancel")}</Button>
            <Button variant="destructive" disabled={busy} onClick={() => void remove()}>{busy ? ta("working") : td("confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
