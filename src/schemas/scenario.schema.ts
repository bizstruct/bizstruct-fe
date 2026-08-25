// Types come from bizstruct-domain (via `npm run sync:domain`), not from a
// hand-maintained zod schema — see src/types/domain/scenario.ts. The
// backend validates every Scenario payload before it's ever stored
// (bizstruct-be's /api/internal/hook and /api/scenario/* endpoints), so the
// frontend no longer needs to defensively re-parse/normalize API responses
// the way the old locale-nested schema did.
//
// Note `highlight` (which timeline steps get visually emphasized) is
// deliberately NOT part of the domain model — it's presentation logic.
// Derive it from `step_type` at the render site (highlight `action` and
// `result`) instead of storing it.
export type {
  Scenario as ScenarioData,
  Persona,
  TimelineStep,
  ScenarioMetrics,
  MetricValue,
  StepType,
  IconKey,
} from "@/types/domain/scenario"

import type { StepType } from "@/types/domain/scenario"

const HIGHLIGHTED_STEPS: readonly StepType[] = ["action", "result"]

export function isHighlightedStep(stepType: StepType): boolean {
  return HIGHLIGHTED_STEPS.includes(stepType)
}
