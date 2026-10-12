"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { Row } from "@/lib/api/projects"

type Tone = NonNullable<React.ComponentProps<typeof Badge>["tone"]>

const ROW_TONE: Record<Row["status"], Tone> = {
  pending: "neutral",
  running: "info",
  consistency_check: "info",
  awaiting_decision: "warning",
  needs_retry: "warning",
  done: "success",
  error: "danger",
}

const PROJECT_TONE: Record<"running" | "completed" | "failed", Tone> = { running: "info", completed: "success", failed: "danger" }

export function RowStatusChip({ status, instanceIndex, showIndex }: { status: Row["status"]; instanceIndex?: number; showIndex?: boolean }) {
  const t = useTranslations("Status.row")
  const tp = useTranslations("Progress")
  return (
    <Badge tone={ROW_TONE[status]} data-status={status}>
      {showIndex && instanceIndex !== undefined ? <span className="opacity-70">{tp("instance", { n: instanceIndex + 1 })}</span> : null}
      {t(status)}
    </Badge>
  )
}

export function ProjectStatusChip({ status }: { status: "running" | "completed" | "failed" }) {
  const t = useTranslations("Status.project")
  return (
    <Badge tone={PROJECT_TONE[status]} data-status={status}>
      {t(status)}
    </Badge>
  )
}
