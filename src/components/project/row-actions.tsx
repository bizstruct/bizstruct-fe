"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { approveRow, regenerateRow, type Project, type Row } from "@/lib/api/projects"
import type { ApiResult } from "@/lib/api/http"
import { actionsFor, dependentsOf, type RowAction } from "@/lib/mappers/progress"

interface Props {
  project: Project
  row: Row
  onProject: (project: Project) => void
  onRefresh: () => void
}

/** Runs a row action and turns be's answer into what the dialog or buttons show. */
function useRowCall({ onProject, onRefresh }: Pick<Props, "onProject" | "onRefresh">) {
  const t = useTranslations("Actions")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  /** Resolves true when the call succeeded (the caller closes its dialog); on a failure the message stays visible. */
  async function run(call: () => Promise<ApiResult<Project>>): Promise<boolean> {
    setBusy(true)
    setMessage(null)
    const result = await call()
    setBusy(false)
    if (result.ok) {
      onProject(result.data)
      return true
    }
    // 409: the row changed under us (the worker finished, a stuck timeout fired). Show the truth.
    setMessage(result.kind === "conflict" ? t("conflict") : `${t("failed")}: ${result.detail}`)
    if (result.kind === "conflict") onRefresh()
    return false
  }

  return { busy, message, run, reset: () => setMessage(null) }
}

/** The confirmation before a regenerate: it names the rows that will be generated again (display only, be decides). */
export function RegenerateDialog({ project, row, open, onOpenChange, onProject, onRefresh }: Props & { open: boolean; onOpenChange: (open: boolean) => void }) {
  const t = useTranslations("Actions")
  const tr = useTranslations("Regenerate")
  const ts = useTranslations("Stages")
  const { busy, message, run, reset } = useRowCall({ onProject, onRefresh })
  const dependents = dependentsOf(project.rows, row.id)

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) reset(); onOpenChange(next) }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tr("title")}</DialogTitle>
          <DialogDescription>{tr("body", { stage: ts(row.stage) })}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          {dependents.length === 0 ? (
            <p className="text-slate-500">{tr("none")}</p>
          ) : (
            <>
              <p className="font-medium text-slate-800">{tr("dependents")}</p>
              <ul className="list-disc space-y-0.5 pl-5 text-slate-700" data-testid="dependents">
                {dependents.map((d) => (
                  <li key={d.id}>
                    {ts(d.stage)} #{d.instanceIndex + 1}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {message ? <p role="alert" className="text-sm text-red-700">{message}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
          <Button disabled={busy} onClick={() => void run(() => regenerateRow(project.id, row.id)).then((done) => done && onOpenChange(false))}>
            {busy ? t("working") : tr("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** The buttons a row offers in the status panel. `exclude` lets a caller keep one elsewhere (Regenerate lives in the tab bar). */
export function RowActions({ project, row, onProject, onRefresh, exclude = [] }: Props & { exclude?: RowAction[] }) {
  const t = useTranslations("Actions")
  const [confirming, setConfirming] = useState(false)
  const { busy, message, run } = useRowCall({ onProject, onRefresh })

  const actions = actionsFor(row.status).filter((a) => !exclude.includes(a))
  if (actions.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid={`actions-${row.id}`}>
      {actions.includes("approve") ? (
        <Button size="sm" disabled={busy} onClick={() => void run(() => approveRow(project.id, row.id))}>
          {busy ? t("working") : t("approve")}
        </Button>
      ) : null}
      {actions.includes("regenerate") || actions.includes("retry") ? (
        <Button size="sm" variant="outline" disabled={busy} onClick={() => setConfirming(true)}>
          {actions.includes("retry") ? t("retry") : t("regenerate")}
        </Button>
      ) : null}
      {message ? <span role="alert" className="text-xs text-red-700">{message}</span> : null}
      <RegenerateDialog project={project} row={row} open={confirming} onOpenChange={setConfirming} onProject={onProject} onRefresh={onRefresh} />
    </div>
  )
}
