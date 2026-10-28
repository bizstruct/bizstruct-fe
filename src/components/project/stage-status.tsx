"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { Project, Row } from "@/lib/api/projects"
import { durationSeconds } from "@/lib/mappers/progress"
import { stateOf } from "@/lib/mappers/tab-stages"
import { STAGES, type StageId } from "@/types/domain/stages"
import { Panel } from "./primitives"
import { RowActions } from "./row-actions"
import { StateIcon } from "./state-icon"
import { RowStatusChip } from "./status-chip"

interface Props {
  project: Project
  stages: readonly StageId[]
  onProject: (project: Project) => void
  onRefresh: () => void
}

/** The status of the stages behind a tab, shown on the tab itself: one block per stage with its rows, errors, consistency violations and actions. */
export function StageStatusPanel({ project, stages, onProject, onRefresh }: Props) {
  const t = useTranslations("Progress")
  const ts = useTranslations("Stages")

  return (
    <div className="grid gap-3" data-testid="stage-status">
      {stages.map((id) => {
        const definition = STAGES.find((s) => s.id === id)!
        const rows = project.rows.filter((r) => r.stage === id).sort((a, b) => a.instanceIndex - b.instanceIndex)
        const state = stateOf(project.rows, [id])
        return (
          <Panel key={id} data-stage={id} data-state={state} className="space-y-2 p-3">
            <div className="flex items-center gap-2">
              <StateIcon state={state} />
              <h3 className="text-sm font-semibold text-slate-900">{ts(id)}</h3>
              {definition.is_optional ? <Badge>{t("optionalBadge")}</Badge> : null}
            </div>
            {rows.length === 0 ? <p className="text-xs text-slate-400">{t("noRows")}</p> : null}
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {rows.map((row) => (
                <RowCard key={row.id} row={row} project={project} showIndex={definition.allows_multiple_instances} onProject={onProject} onRefresh={onRefresh} />
              ))}
            </div>
          </Panel>
        )
      })}
    </div>
  )
}

function RowCard({ row, project, showIndex, onProject, onRefresh }: { row: Row; project: Project; showIndex: boolean; onProject: Props["onProject"]; onRefresh: () => void }) {
  const t = useTranslations("Progress")
  const te = useTranslations("ErrorCodes")
  const seconds = durationSeconds(row)
  const violations = row.consistency?.violations ?? []

  return (
    <div className="space-y-1.5 rounded-lg border border-slate-100 bg-slate-50/60 p-2" data-row={row.id} data-testid={`row-${row.stage}-${row.instanceIndex}`}>
      <div className="flex flex-wrap items-center gap-1.5">
        <RowStatusChip status={row.status} instanceIndex={row.instanceIndex} showIndex={showIndex} />
        {row.retryCount > 0 ? <span className="text-xs text-slate-500">{t("retries", { n: row.retryCount })}</span> : null}
        {seconds !== undefined ? <span className="text-xs text-slate-500">{t("duration", { s: seconds.toFixed(1) })}</span> : null}
      </div>

      {row.error ? (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-800">
          <p className="font-medium">{te(row.error.code)}</p>
          <p className="mt-0.5 break-words">{row.error.message}</p>
        </div>
      ) : null}

      {violations.length > 0 ? (
        <ul className="space-y-1" aria-label={t("violations")}>
          {violations.map((v, i) => (
            <li key={i} className="rounded-md border border-slate-200 bg-white p-1.5 text-xs" data-severity={v.severity}>
              <div className="flex items-center gap-1.5">
                <Badge tone={v.severity === "error" ? "danger" : "warning"}>{t(`severity.${v.severity}`)}</Badge>
                <code className="break-all text-[11px] text-slate-500">{v.rule_id}</code>
              </div>
              <p className="mt-1 text-slate-700">{v.message}</p>
            </li>
          ))}
        </ul>
      ) : null}

      <RowActions project={project} row={row} onProject={onProject} onRefresh={onRefresh} />
    </div>
  )
}
