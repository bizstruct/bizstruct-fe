// Types come from bizstruct-domain (via `npm run sync:domain`), not from a
// hand-maintained zod schema — see src/types/domain/scenario.ts. The
// backend validates every Scenario payload before it's ever stored
// (bizstruct-be's /api/internal/hook and /api/scenario/* endpoints), so the
// frontend no longer needs to defensively re-parse/normalize API responses
// the way the old locale-nested schema did.
//
// Note `highlight` (which timeline steps get visually emphasized) and
// `icon_key` (which icon a timeline step gets) are deliberately NOT part of
// the domain model — both are presentation logic. `highlight` is derived
// from `step_type` at the render site (highlight `action` and `result`)
// below; icon selection is likewise a client-side step_type -> icon mapping,
// not stored data.
export type {
  Scenario as ScenarioData,
  Persona,
  TimelineStep,
  ScenarioMetrics,
  MetricValue,
  StepType,
} from "@/types/domain/scenario"

import type { StepType } from "@/types/domain/scenario"

const HIGHLIGHTED_STEPS: readonly StepType[] = ["action", "result"]

export function isHighlightedStep(stepType: StepType): boolean {
  return HIGHLIGHTED_STEPS.includes(stepType)
}
