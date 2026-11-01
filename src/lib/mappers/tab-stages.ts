// Which pipeline stages feed which tab of the project page, and the one status a tab (or the whole
// project) shows for them. The stage graph itself comes from stages.json via `stageColumns`.

import type { Row } from "@/lib/api/projects"
import type { StageId } from "@/types/domain/stages"
import { stageColumns } from "./progress"

export type TabId = "brief" | "segments" | "patterns" | "canvas" | "swot" | "story" | "future" | "pitch"

export const TAB_IDS: readonly TabId[] = ["brief", "segments", "patterns", "canvas", "swot", "story", "future", "pitch"]

const TAB_STAGES: Record<TabId, readonly StageId[]> = {
  brief: ["brief"],
  segments: ["empathy_map", "customer_scenario", "ideation"],
  patterns: ["patterns"],
  canvas: ["canvas"],
  swot: ["swot_errc_cycle"],
  story: ["storytelling"],
  future: ["future_scenario"],
  pitch: ["pitch"],
}

/** Optional stages have no view of their own yet: their status sits with the brief they read. */
const OPTIONAL_ON_BRIEF: readonly StageId[] = ["business_case", "environment_scan"]

/** The stages a tab reports on, optional ones only when the project enabled them. */
export function stagesOfTab(tab: TabId, enabledOptional: readonly string[]): StageId[] {
  const stages = [...TAB_STAGES[tab]]
  if (tab === "brief") stages.push(...OPTIONAL_ON_BRIEF.filter((s) => enabledOptional.includes(s)))
  return stages
}

/** `error` and `attention` (a decision or a retry is waiting for the user) outrank `running`. */
export type StageState = "error" | "attention" | "running" | "done" | "waiting"

const RUNNING: readonly Row["status"][] = ["running", "consistency_check"]
const ATTENTION: readonly Row["status"][] = ["awaiting_decision", "needs_retry"]

/** One state for the rows of the given stages; a stage without rows is still waiting. */
export function stateOf(rows: readonly Row[], stages: readonly StageId[]): StageState {
  const own = rows.filter((r) => (stages as readonly string[]).includes(r.stage))
  if (own.some((r) => r.status === "error")) return "error"
  if (own.some((r) => ATTENTION.includes(r.status))) return "attention"
  if (own.some((r) => RUNNING.includes(r.status))) return "running"
  const everyStageDone = stages.every((s) => {
    const mine = own.filter((r) => r.stage === s)
    return mine.length > 0 && mine.every((r) => r.status === "done")
  })
  return everyStageDone ? "done" : "waiting"
}

/** Stages finished out of the stages the project runs (optional ones only if enabled). */
export function stageProgress(rows: readonly Row[], enabledOptional: readonly string[]): { done: number; total: number } {
  const stages = stageColumns([...rows], enabledOptional).flatMap((c) => c.stages.map((n) => n.definition.id))
  return { done: stages.filter((s) => stateOf(rows, [s]) === "done").length, total: stages.length }
}
