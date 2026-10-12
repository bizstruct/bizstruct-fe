// The stage graph for the progress screen, drawn from the domain's stages.json (never a copy),
// and the row facts the chips need.

import type { Row } from "@/lib/api/projects"
import { STAGES, type StageDefinition, type StageId } from "@/types/domain/stages"

export interface StageColumn {
  layer: number
  stages: StageNode[]
}

export interface StageNode {
  definition: StageDefinition
  rows: Row[]
}

/**
 * Layers the stages by dependency depth (hard AND optional edges), leaving out optional stages the
 * project did not enable. team_info is user input and never has rows here, so it only appears if enabled.
 */
export function stageColumns(rows: Row[], enabledOptional: readonly string[]): StageColumn[] {
  const visible = STAGES.filter((s) => !s.is_optional || enabledOptional.includes(s.id))
  const ids = new Set<StageId>(visible.map((s) => s.id))
  const depth = new Map<StageId, number>()
  const depthOf = (id: StageId): number => {
    const known = depth.get(id)
    if (known !== undefined) return known
    const definition = STAGES.find((s) => s.id === id)!
    const parents = [...definition.depends_on, ...definition.optional_depends_on].filter((p) => ids.has(p))
    const value = parents.length === 0 ? 0 : 1 + Math.max(...parents.map(depthOf))
    depth.set(id, value)
    return value
  }
  const columns = new Map<number, StageNode[]>()
  for (const definition of visible) {
    const layer = depthOf(definition.id)
    const node: StageNode = {
      definition,
      rows: rows.filter((r) => r.stage === definition.id).sort((a, b) => a.instanceIndex - b.instanceIndex),
    }
    columns.set(layer, [...(columns.get(layer) ?? []), node])
  }
  return [...columns.entries()].sort(([a], [b]) => a - b).map(([layer, stages]) => ({ layer, stages }))
}

/** Seconds a row ran (finishedAt - startedAt), or undefined while either end is missing. */
export function durationSeconds(row: Pick<Row, "startedAt" | "finishedAt">): number | undefined {
  if (!row.startedAt || !row.finishedAt) return undefined
  return (Date.parse(row.finishedAt) - Date.parse(row.startedAt)) / 1000
}

export type RowAction = "approve" | "regenerate" | "retry"

/**
 * The user actions be offers for a row status. This mirrors the domain's `available_actions` table
 * (stage_machine.py), which stages.json / stage_states.json do not export; be remains the authority
 * and answers 409 for anything not allowed. A `retry` is a regenerate of a row in error.
 */
export function actionsFor(status: Row["status"]): RowAction[] {
  if (status === "awaiting_decision") return ["approve", "regenerate"]
  if (status === "done") return ["regenerate"]
  if (status === "error") return ["retry"]
  return []
}

/**
 * Rows that depend on `rowId` through `refs`, transitively. DISPLAY ONLY, for the regenerate
 * confirmation: be's `dependent_rows` decides what is actually reset. Graph order, then instance order.
 */
export function dependentsOf(rows: Row[], rowId: string): Row[] {
  const referrers = new Map<string, Set<string>>()
  for (const row of rows) {
    for (const ids of Object.values(row.refs)) {
      for (const id of ids) referrers.set(id, (referrers.get(id) ?? new Set()).add(row.id))
    }
  }
  const seen = new Set<string>()
  const frontier = [rowId]
  while (frontier.length) {
    for (const dependent of referrers.get(frontier.pop()!) ?? []) {
      if (dependent !== rowId && !seen.has(dependent)) {
        seen.add(dependent)
        frontier.push(dependent)
      }
    }
  }
  const order = new Map(STAGES.map((s, i) => [s.id as string, i]))
  return rows
    .filter((r) => seen.has(r.id))
    .sort((a, b) => (order.get(a.stage)! - order.get(b.stage)!) || a.instanceIndex - b.instanceIndex)
}
