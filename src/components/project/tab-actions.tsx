"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Project, Row } from "@/lib/api/projects"
import { actionsFor } from "@/lib/mappers/progress"
import { STAGES, type StageId } from "@/types/domain/stages"
import { RegenerateDialog } from "./row-actions"

interface Props {
  project: Project
  stages: readonly StageId[]
  onProject: (project: Project) => void
  onRefresh: () => void
}

/**
 * Regenerate for the open tab, as one icon at the end of the tab bar: it asks which row when the tab holds
 * several (three empathy maps, three stages under Segments), then confirms before anything is reset.
 */
export function TabActions({ project, stages, onProject, onRefresh }: Props) {
  const t = useTranslations("Actions")
  const ts = useTranslations("Stages")
  const [target, setTarget] = useState<Row | null>(null)

  const eligible = project.rows
    .filter((r) => (stages as readonly string[]).includes(r.stage) && actionsFor(r.status).includes("regenerate"))
    .sort((a, b) => stages.indexOf(a.stage as StageId) - stages.indexOf(b.stage as StageId) || a.instanceIndex - b.instanceIndex)
  if (eligible.length === 0) return null

  const label = (row: Row): string => {
    const many = STAGES.find((s) => s.id === row.stage)?.allows_multiple_instances
    return many ? `${ts(row.stage)} #${row.instanceIndex + 1}` : ts(row.stage)
  }
  const icon = <RefreshCw className="size-4" />
  const trigger = (extra?: object) => (
    <Button variant="ghost" size="icon" aria-label={t("regenerate")} title={t("regenerate")} className="mx-1.5 size-9 shrink-0 rounded-xl text-slate-500 hover:text-slate-900" {...extra}>
      {icon}
    </Button>
  )

  return (
    <>
      {eligible.length === 1 ? (
        trigger({ onClick: () => setTarget(eligible[0]) })
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{trigger()}</DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {eligible.map((row) => (
              <DropdownMenuItem key={row.id} onSelect={() => setTarget(row)}>
                <RefreshCw /> {label(row)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {target ? (
        <RegenerateDialog project={project} row={target} open onOpenChange={(open) => (open ? undefined : setTarget(null))} onProject={onProject} onRefresh={onRefresh} />
      ) : null}
    </>
  )
}
