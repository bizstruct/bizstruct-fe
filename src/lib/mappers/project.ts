// Turns the flat rows of GET /api/projects/{id} into what the screens draw: segments, canvases with
// their versions, and the per-canvas storytelling / future scenarios / pitch. Rows are joined through
// `refs` (ADR-0011), never through position or instanceIndex alone. The final version is READ from the
// cycle row (be returns finalVersion / finalCanvasId / finalSwotId); it is never derived here.

import type { Project, Row } from "@/lib/api/projects"
import type { ArtifactModels } from "@/types/artifacts"
import { artifactsOf, firstArtifact } from "./artifacts"

type Canvas = ArtifactModels["canvas"]
type Swot = ArtifactModels["swot"]
type Errc = ArtifactModels["errc"]

export interface SegmentView {
  index: number
  /** The persona name when the empathy map exists, else the brief's candidate text. */
  label: string
  empathyRow: Row
  scenarioRow?: Row
  ideationRow?: Row
  empathyMap?: ArtifactModels["empathy_map"]
  scenario?: ArtifactModels["customer_scenario"]
  ideation?: ArtifactModels["ideation"]
}

export interface CanvasVersionView {
  version: number
  canvas: Canvas
  swot?: Swot
  /** The ERRC that PRODUCED this version (to_version === version). */
  errcIn?: Errc
  /** The ERRC applied to this version to get the next one (from_version === version). */
  errcOut?: Errc
  isFinal: boolean
}

export interface Produced<K extends keyof ArtifactModels> {
  row: Row
  artifact?: ArtifactModels[K]
}

export interface CanvasFlow {
  index: number
  canvasRow: Row
  cycleRow?: Row
  segments: SegmentView[]
  versions: CanvasVersionView[]
  finalVersion?: number
  finalCanvasId?: string
  finalSwotId?: string
  storytelling?: Produced<"storytelling">
  futureScenario?: Produced<"future_scenario">
  pitch?: Produced<"pitch">
}

export interface ProjectView {
  project: Project
  briefRow?: Row
  brief?: ArtifactModels["brief"]
  segments: SegmentView[]
  patternsRow?: Row
  patterns?: ArtifactModels["patterns"]
  canvases: CanvasFlow[]
  businessCase?: Produced<"business_case">
  environmentScan?: Produced<"environment_scan">
}

const byStage = (rows: Row[], stage: Row["stage"]): Row[] =>
  rows.filter((r) => r.stage === stage).sort((a, b) => a.instanceIndex - b.instanceIndex)

const refersTo = (row: Row, stage: string, id: string): boolean => (row.refs[stage] ?? []).includes(id)

function produced<K extends keyof ArtifactModels>(row: Row | undefined, kind: K): Produced<K> | undefined {
  return row ? { row, artifact: firstArtifact(row, kind) } : undefined
}

export function buildSegments(rows: Row[]): SegmentView[] {
  const brief = firstArtifact(byStage(rows, "brief")[0], "brief")
  return byStage(rows, "empathy_map").map((empathyRow) => {
    const scenarioRow = rows.find((r) => r.stage === "customer_scenario" && refersTo(r, "empathy_map", empathyRow.id))
    const ideationRow = rows.find((r) => r.stage === "ideation" && refersTo(r, "empathy_map", empathyRow.id))
    const empathyMap = firstArtifact(empathyRow, "empathy_map")
    return {
      index: empathyRow.instanceIndex,
      label: empathyMap?.persona_name ?? brief?.customer_segment_candidates[empathyRow.instanceIndex] ?? `#${empathyRow.instanceIndex + 1}`,
      empathyRow,
      scenarioRow,
      ideationRow,
      empathyMap,
      scenario: firstArtifact(scenarioRow, "customer_scenario"),
      ideation: firstArtifact(ideationRow, "ideation"),
    }
  })
}

export function buildCanvasFlow(canvasRow: Row, rows: Row[], allSegments: SegmentView[]): CanvasFlow {
  const cycleRow = rows.find((r) => r.stage === "swot_errc_cycle" && refersTo(r, "canvas", canvasRow.id))
  const canvases = [...artifactsOf(canvasRow, "canvas"), ...artifactsOf(cycleRow, "canvas")].sort((a, b) => a.version - b.version)
  const swots = artifactsOf(cycleRow, "swot")
  const errcs = artifactsOf(cycleRow, "errc")
  const finalVersion = cycleRow?.finalVersion

  const downstream = (stage: Row["stage"]) => (cycleRow ? rows.find((r) => r.stage === stage && refersTo(r, "swot_errc_cycle", cycleRow.id)) : undefined)

  return {
    index: canvasRow.instanceIndex,
    canvasRow,
    cycleRow,
    segments: allSegments.filter((s) => refersTo(canvasRow, "empathy_map", s.empathyRow.id)),
    versions: canvases.map((canvas) => ({
      version: canvas.version,
      canvas,
      swot: swots.find((s) => s.canvas_version === canvas.version),
      errcIn: errcs.find((e) => e.to_version === canvas.version),
      errcOut: errcs.find((e) => e.from_version === canvas.version),
      isFinal: finalVersion !== undefined && canvas.version === finalVersion,
    })),
    finalVersion,
    finalCanvasId: cycleRow?.finalCanvasId,
    finalSwotId: cycleRow?.finalSwotId,
    storytelling: produced(downstream("storytelling"), "storytelling"),
    futureScenario: produced(downstream("future_scenario"), "future_scenario"),
    pitch: produced(downstream("pitch"), "pitch"),
  }
}

export function buildProjectView(project: Project): ProjectView {
  const { rows } = project
  const briefRow = byStage(rows, "brief")[0]
  const patternsRow = byStage(rows, "patterns")[0]
  const segments = buildSegments(rows)
  return {
    project,
    briefRow,
    brief: firstArtifact(briefRow, "brief"),
    segments,
    patternsRow,
    patterns: firstArtifact(patternsRow, "patterns"),
    canvases: byStage(rows, "canvas").map((canvasRow) => buildCanvasFlow(canvasRow, rows, segments)),
    businessCase: produced(byStage(rows, "business_case")[0], "business_case"),
    environmentScan: produced(byStage(rows, "environment_scan")[0], "environment_scan"),
  }
}
