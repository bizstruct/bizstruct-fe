// Types come from bizstruct-domain (via `npm run sync:domain`), not from a
// hand-maintained zod schema — see src/types/domain/architecture.ts. The
// backend validates every Architecture payload before it's ever stored
// (bizstruct-be's /api/internal/hook and /api/architecture/* endpoints), so
// the frontend no longer needs to defensively re-parse/normalize API
// responses the way the old locale-nested schema did.
export type {
  Architecture,
  Epicenter,
  Pattern,
  PatternSubtype,
} from "@/types/domain/architecture"

export {
  EPICENTER_VALUES,
  PATTERN_VALUES,
  PATTERN_SUBTYPE_VALUES,
} from "@/types/domain/architecture"

import type { Pattern, PatternSubtype } from "@/types/domain/architecture"

// Mirrors bizstruct_domain.enums.PATTERN_SUBTYPES (Python) — that mapping is
// enforced by Architecture's cross-field validator but isn't itself part of
// the JSON Schema (it's business logic inside a @model_validator, not a
// declarative constraint), so it can't be generated. Keep in sync manually
// if bizstruct-domain's PATTERN_SUBTYPES changes.
export const PATTERN_SUBTYPES: Partial<Record<Pattern, readonly PatternSubtype[]>> = {
  free: ["freemium", "ad_supported", "bait_and_hook"],
  open_business_model: ["outside_in", "inside_out"],
}
