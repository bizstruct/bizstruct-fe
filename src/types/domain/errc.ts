// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/errc.json (bizstruct-domain@v0.17.0)

/**
 * Identifier of the canvas this ERRC analysis is associated with.
 */
export type CanvasId = string
/**
 * The version of the canvas from which this ERRC analysis is derived.
 */
export type FromVersion = number
/**
 * Unique identifier for the ERRC analysis.
 */
export type Id = string
/**
 * The moves of the ERRC analysis: between 1 and 6.
 *
 * @minItems 1
 * @maxItems 6
 */
export type Moves =
  | [ErrcMove]
  | [ErrcMove, ErrcMove]
  | [ErrcMove, ErrcMove, ErrcMove]
  | [ErrcMove, ErrcMove, ErrcMove, ErrcMove]
  | [ErrcMove, ErrcMove, ErrcMove, ErrcMove, ErrcMove]
  | [ErrcMove, ErrcMove, ErrcMove, ErrcMove, ErrcMove, ErrcMove]
/**
 * The action to be taken for error correction.
 */
export type ERRCActionType = "eliminate" | "reduce" | "raise" | "create"
/**
 * The text of the card after the action is applied. Required for reduce, raise and create (for reduce and raise it replaces the target card's text); must be omitted for eliminate.
 */
export type NewText = string | null
/**
 * A description of how the action will impact the opposite side of the canvas.
 */
export type OppositeSideImpact = string
/**
 * The rationale behind the action, explaining why it is necessary.
 */
export type Rationale = string
/**
 * The exact current text of the existing card the action targets. Required for eliminate, reduce and raise; must be omitted for create.
 */
export type TargetCardText = string | null
/**
 * The section of the canvas that the action targets.
 */
export type CanvasSection =
  | "value_propositions"
  | "customer_segments"
  | "channels"
  | "customer_relationships"
  | "revenue_streams"
  | "key_resources"
  | "key_activities"
  | "key_partnerships"
  | "cost_structure"
/**
 * Identifier of the resulting canvas after applying this ERRC analysis.
 */
export type ResultCanvasId = string
/**
 * Identifier of the SWOT analysis whose signals informed these moves. SWOT always precedes ERRC in the swot_errc_cycle, so this is required, not optional.
 */
export type SwotId = string
/**
 * The version of the canvas to which this ERRC analysis is applied.
 */
export type ToVersion = number

/**
 * Represents an error correction (ERRC) analysis for a business model canvas.
 */
export interface Errc {
  canvas_id: CanvasId
  from_version: FromVersion
  id: Id
  moves: Moves
  result_canvas_id: ResultCanvasId
  swot_id: SwotId
  to_version: ToVersion
  [k: string]: unknown
}
/**
 * Represents a move in the error correction system.
 */
export interface ErrcMove {
  action: ERRCActionType
  new_text?: NewText
  opposite_side_impact: OppositeSideImpact
  rationale: Rationale
  target_card_text?: TargetCardText
  target_section: CanvasSection
  [k: string]: unknown
}
