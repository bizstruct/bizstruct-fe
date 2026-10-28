"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { Project, Row } from "@/lib/api/projects"
import { durationSeconds } from "@/lib/mappers/progress"
import { stateOf, type StageState } from "@/lib/mappers/tab-stages"
import { STAGES, type StageId } from "@/types/domain/stages"
import { Timer } from "lucide-react"
import { cn } from "@/lib/utils"
import { RowActions } from "./row-actions"
import { StateIcon } from "./state-icon"
import { RowStatusChip } from "./status-chip"

interface Props {
  project: Project
  stages: readonly StageId[]
  onProject: (project: Project) => void
  onRefresh: () => void
}

/** The status of the stages behind a tab, shown on the tab itself: one strip per stage with its rows, errors, consistency violations and actions. */
export function StageStatusPanel({ project, stages, onProject, onRefresh }: Props) {
  const t = useTranslations("Progress")
  const ts = useTranslations("Stages")

  return (
    <div className="grid gap-2.5" data-testid="stage-status">
      {stages.map((id) => {
        const definition = STAGES.find((s) => s.id === id)!
        const rows = project.rows.filter((r) => r.stage === id).sort((a, b) => a.instanceIndex - b.instanceIndex)
        const state = stateOf(project.rows, [id])
        return (
          <div key={id} data-stage={id} data-state={state} className={cn("rounded-2xl border bg-white p-3.5 shadow-sm shadow-slate-200/40", FRAME[state])}>
            <div className="flex items-center gap-2.5">
              <StateIcon state={state} className="size-5" />
              <h3 className="text-sm font-semibold text-slate-900">{ts(id)}</h3>
              {definition.is_optional ? <Badge>{t("optionalBadge")}</Badge> : null}
              {rows.length === 0 ? <span className="text-xs text-slate-400">{t("noRows")}</span> : null}
            </div>
            {rows.length > 0 ? (
              <div className="mt-2.5 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {rows.map((row) => (
                  <RowCard key={row.id} row={row} project={project} showIndex={definition.allows_multiple_instances} onProject={onProject} onRefresh={onRefresh} />
                ))}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

/** The frame of a stage strip says the state before anything is read. */
const FRAME: Record<StageState, string> = {
  done: "border-slate-200/80",
  waiting: "border-slate-200/80 opacity-80",
  running: "border-sky-300 ring-2 ring-sky-100",
  attention: "border-amber-300 ring-2 ring-amber-100",
  error: "border-red-300 ring-2 ring-red-100",
}

function RowCard({ row, project, showIndex, onProject, onRefresh }: { row: Row; project: Project; showIndex: boolean; onProject: Props["onProject"]; onRefresh: () => void }) {
  const t = useTranslations("Progress")
  const te = useTranslations("ErrorCodes")
  const seconds = durationSeconds(row)
  const violations = row.consistency?.violations ?? []

  return (
    <div className="space-y-2 rounded-xl bg-slate-50/80 p-2.5" data-row={row.id} data-testid={`row-${row.stage}-${row.instanceIndex}`}>
      <div className="flex flex-wrap items-center gap-1.5">
        <RowStatusChip status={row.status} instanceIndex={row.instanceIndex} showIndex={showIndex} />
        {row.retryCount > 0 ? <span className="text-xs text-slate-500">{t("retries", { n: row.retryCount })}</span> : null}
        {seconds !== undefined ? (
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Timer className="size-3" aria-hidden /> {t("duration", { s: seconds.toFixed(1) })}
          </span>
        ) : null}
      </div>

      {row.error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-800">
          <p className="font-semibold">{te(row.error.code)}</p>
          <p className="mt-0.5 break-words">{row.error.message}</p>
        </div>
      ) : null}

      {violations.length > 0 ? (
        <ul className="space-y-1.5" aria-label={t("violations")}>
          {violations.map((v, i) => (
            <li key={i} className={cn("rounded-lg border p-2 text-xs", v.severity === "error" ? "border-red-200 bg-red-50/60" : "border-amber-200 bg-amber-50/60")} data-severity={v.severity}>
              <div className="flex flex-wrap items-center gap-1.5">
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
