// Types come from bizstruct-domain (via `npm run sync:domain`), not from a
// hand-maintained zod schema — see src/types/domain/hypotheses.ts. The
// backend validates every Hypotheses payload before it's ever stored
// (bizstruct-be's /api/internal/hook and /api/hypotheses/* endpoints).
//
// Category values are lowercase (desirability/viability/feasibility,
// matching bizstruct_domain.enums.HypothesisCategory) — this schema
// previously used capitalized values (Desirability/Viability/Feasibility),
// which is why HypothesisCategory is re-exported here rather than redefined.
export type { Hypothesis, HypothesisCategory, Quadrant as HypothesisQuadrant } from "@/types/domain/hypotheses"
export { HYPOTHESIS_CATEGORY_VALUES, QUADRANT_VALUES } from "@/types/domain/hypotheses"
