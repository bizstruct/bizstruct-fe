"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { Project, Row } from "@/lib/api/projects"
import { stateOf } from "@/lib/mappers/tab-stages"
import { cn } from "@/lib/utils"
import type { StageId } from "@/types/domain/stages"
import { RowActions } from "./row-actions"
import { StateIcon } from "./state-icon"
import { RowStatusChip } from "./status-chip"

interface Props {
  project: Project
  stages: readonly StageId[]
  onProject: (project: Project) => void
  onRefresh: () => void
}

/** A row the user has to look at: it failed, waits for a decision, or the consistency check reported something. */
function needsAttention(row: Row): boolean {
  return Boolean(row.error) || (row.consistency?.violations ?? []).length > 0 || row.status === "awaiting_decision" || row.status === "needs_retry" || row.status === "error"
}

/**
 * What is wrong behind a tab. A stage that went through cleanly shows nothing here: its state is the icon on the
 * tab, and Regenerate is in the tab bar. Errors, consistency violations and the Approve / Retry buttons appear
 * only when there is something to read or decide.
 */
export function StageStatusPanel({ project, stages, onProject, onRefresh }: Props) {
  const ts = useTranslations("Stages")
  const flagged = stages
    .map((id) => ({ id, rows: project.rows.filter((r) => r.stage === id && needsAttention(r)).sort((a, b) => a.instanceIndex - b.instanceIndex) }))
    .filter((s) => s.rows.length > 0)
  if (flagged.length === 0) return null

  return (
    <div className="grid gap-2" data-testid="stage-status">
      {flagged.map(({ id, rows }) => {
        const state = stateOf(project.rows, [id])
        return (
          <div key={id} data-stage={id} data-state={state} className={cn("rounded-2xl border bg-white px-4 py-3", FRAME[state])}>
            <div className="flex items-center gap-2.5">
              <StateIcon state={state} className="size-5" />
              <h3 className="text-sm font-semibold text-slate-900">{ts(id)}</h3>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {rows.map((row) => (
                <RowProblems key={row.id} row={row} project={project} showIndex={rows.length > 1} onProject={onProject} onRefresh={onRefresh} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const FRAME: Record<ReturnType<typeof stateOf>, string> = {
  done: "border-slate-200",
  waiting: "border-slate-200",
  running: "border-sky-300",
  attention: "border-amber-300",
  error: "border-red-300",
}

function RowProblems({ row, project, showIndex, onProject, onRefresh }: { row: Row; project: Project; showIndex: boolean; onProject: Props["onProject"]; onRefresh: () => void }) {
  const t = useTranslations("Progress")
  const te = useTranslations("ErrorCodes")
  const violations = row.consistency?.violations ?? []
  return (
    <div className="min-w-0 space-y-2" data-row={row.id} data-testid={`problems-${row.stage}-${row.instanceIndex}`}>
      <div className="flex flex-wrap items-center gap-2">
        {row.status !== "done" ? <RowStatusChip status={row.status} instanceIndex={row.instanceIndex} showIndex={showIndex} /> : showIndex ? <Badge>{t("instance", { n: row.instanceIndex + 1 })}</Badge> : null}
        <RowActions project={project} row={row} onProject={onProject} onRefresh={onRefresh} exclude={row.status === "done" ? ["regenerate"] : []} />
      </div>

      {row.error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
          <p className="font-semibold">{te(row.error.code)}</p>
          <p className="mt-0.5 break-words">{row.error.message}</p>
        </div>
      ) : null}

      {violations.length > 0 ? (
        <ul className="space-y-1.5" aria-label={t("violations")}>
          {violations.map((v, i) => (
            <li key={i} className={cn("rounded-xl border p-3 text-xs", v.severity === "error" ? "border-red-200 bg-red-50/60" : "border-amber-200 bg-amber-50/60")} data-severity={v.severity}>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone={v.severity === "error" ? "danger" : "warning"}>{t(`severity.${v.severity}`)}</Badge>
                <code className="break-all text-[11px] text-slate-500">{v.rule_id}</code>
              </div>
              <p className="mt-1.5 break-words leading-relaxed text-slate-700">{v.message}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
