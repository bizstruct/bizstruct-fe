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
  /** False while any row is being generated: one regeneration at a time. */
  available: boolean
  onProject: (project: Project) => void
  onRefresh: () => void
}

/**
 * Regenerate for the open tab. It takes the place of the tab's state icon when the pointer is on it (the tab
 * bar renders it over the icon, on the selected tab only). It asks which row when the tab holds several (three
 * empathy maps, three stages under Segments), then confirms before anything is reset.
 */
export function TabActions({ project, stages, available, onProject, onRefresh }: Props) {
  const t = useTranslations("Actions")
  const ts = useTranslations("Stages")
  const [target, setTarget] = useState<Row | null>(null)

  const eligible = project.rows
    .filter((r) => (stages as readonly string[]).includes(r.stage) && actionsFor(r.status).includes("regenerate"))
    .sort((a, b) => stages.indexOf(a.stage as StageId) - stages.indexOf(b.stage as StageId) || a.instanceIndex - b.instanceIndex)
  if (!available || eligible.length === 0) return null

  const label = (row: Row): string => {
    const many = STAGES.find((s) => s.id === row.stage)?.allows_multiple_instances
    return many ? `${ts(row.stage)} #${row.instanceIndex + 1}` : ts(row.stage)
  }
  const icon = <RefreshCw className="size-4" />
  const trigger = (extra?: object) => (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("regenerate")}
      title={t("regenerate")}
      // Opaque like the bar, tinted like the selected tab: it hides the state icon beneath while it is shown.
      className="absolute left-3.5 top-1/2 size-7 -translate-y-1/2 overflow-hidden rounded-lg bg-white text-indigo-900 opacity-0 transition-opacity before:absolute before:inset-0 before:bg-indigo-500/10 hover:bg-white hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 dark:before:bg-indigo-400/[0.22]"
      {...extra}
    >
      <span className="relative">{icon}</span>
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
