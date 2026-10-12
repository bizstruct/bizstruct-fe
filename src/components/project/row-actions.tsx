"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { approveRow, regenerateRow, type Project, type Row } from "@/lib/api/projects"
import type { ApiResult } from "@/lib/api/http"
import { actionsFor, dependentsOf } from "@/lib/mappers/progress"

interface Props {
  project: Project
  row: Row
  onProject: (project: Project) => void
  onRefresh: () => void
}

export function RowActions({ project, row, onProject, onRefresh }: Props) {
  const t = useTranslations("Actions")
  const tr = useTranslations("Regenerate")
  const ts = useTranslations("Stages")
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const actions = actionsFor(row.status)
  if (actions.length === 0) return null

  async function run(call: () => Promise<ApiResult<Project>>) {
    setBusy(true)
    setMessage(null)
    const result = await call()
    setBusy(false)
    if (result.ok) {
      setConfirming(false)
      onProject(result.data)
      return
    }
    // 409: the row changed under us (the worker finished, a stuck timeout fired). Show the truth.
    setMessage(result.kind === "conflict" ? t("conflict") : `${t("failed")}: ${result.detail}`)
    if (result.kind === "conflict") {
      setConfirming(false)
      onRefresh()
    }
  }

  const dependents = dependentsOf(project.rows, row.id)

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

      <Dialog open={confirming} onOpenChange={setConfirming}>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirming(false)}>{t("cancel")}</Button>
            <Button disabled={busy} onClick={() => void run(() => regenerateRow(project.id, row.id))}>
              {busy ? t("working") : tr("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
