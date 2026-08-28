// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/bbee62baff73b4c40eadedc7a285274bf63b15c0/schemas/what_if.json (bizstruct-domain@bbee62baff73b4c40eadedc7a285274bf63b15c0)

/**
 * @minItems 3
 * @maxItems 3
 */
export type Alternatives = [WhatIfAlternative, WhatIfAlternative, WhatIfAlternative]
export type ExpectedImpact = string
export type Id = string
/**
 * @minItems 3
 * @maxItems 6
 */
export type Moves =
  | [ERRCMove, ERRCMove, ERRCMove]
  | [ERRCMove, ERRCMove, ERRCMove, ERRCMove]
  | [ERRCMove, ERRCMove, ERRCMove, ERRCMove, ERRCMove]
  | [ERRCMove, ERRCMove, ERRCMove, ERRCMove, ERRCMove, ERRCMove]
/**
 * Blue Ocean Strategy ERRC grid actions.
 *
 * `raise` is a reserved Python keyword, so the member name is `RAISE_`
 * while the serialized value stays the plain string "raise".
 */
export type ERRCAction = "eliminate" | "reduce" | "raise" | "create"
/**
 * Required for reduce/raise (the card's text after the move); must be omitted for eliminate/create.
 */
export type NewText = string | null
export type Rationale = string
export type Target = string
/**
 * Which canvas section this move acts on. Required for all four actions — this is what makes a move concrete instead of a vague statement of intent.
 */
export type CanvasSection =
  | "key_partners"
  | "key_activities"
  | "key_resources"
  | "value_propositions"
  | "customer_relationships"
  | "channels"
  | "customer_segments"
  | "cost_structure"
  | "revenue_streams"
export type Premise = string
/**
 * Lifecycle status of a what-if (ERRC) alternative.
 */
export type WhatIfStatus = "draft" | "applied"
export type Title = string

/**
 * The persisted/CRUD shape: exactly three ERRC alternatives, at most one
 * `applied` (the user's own choice — see module docstring).
 */
export interface WhatIf {
  alternatives: Alternatives
}
/**
 * One ERRC-grid alternative business model built from the project's canvas.
 */
export interface WhatIfAlternative {
  expected_impact: ExpectedImpact
  id: Id
  moves: Moves
  premise: Premise
  status?: WhatIfStatus
  title: Title
}
/**
 * A single ERRC action against one canvas section.
 *
 * `target` always identifies what the move is about, but what it means
 * depends on `action`:
 * - eliminate: the exact `text` of the existing card in `target_section`
 *   to remove. `new_text` must be absent.
 * - reduce / raise: the exact `text` of the existing card in
 *   `target_section` being scaled back/up. `new_text` is required — the
 *   card's replacement text after the move (there is no way to
 *   "reduce"/"raise" a card without saying what it now reads).
 * - create: the proposed new card's text. `new_text` must be absent.
 *
 * This is deliberately a text match on `target`, not a UUID reference —
 * see bizstruct-be's application endpoint for how an unresolved match is
 * handled (never a silent best-effort guess).
 */
export interface ERRCMove {
  action: ERRCAction
  new_text?: NewText
  rationale: Rationale
  target: Target
  target_section: CanvasSection
}

export const CANVAS_SECTION_VALUES = ["key_partners", "key_activities", "key_resources", "value_propositions", "customer_relationships", "channels", "customer_segments", "cost_structure", "revenue_streams"] as const
export const ERRCACTION_VALUES = ["eliminate", "reduce", "raise", "create"] as const
export const WHAT_IF_STATUS_VALUES = ["draft", "applied"] as const
