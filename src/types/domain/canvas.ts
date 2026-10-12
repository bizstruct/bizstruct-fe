// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/canvas.json (bizstruct-domain@v0.17.0)

/**
 * A list of empathy map identifiers associated with this canvas.
 *
 * @minItems 1
 */
export type EmpathyMapIds = [string, ...string[]]
/**
 * Identifier of the canvas group this canvas is associated with.
 */
export type GroupId = string
/**
 * Unique identifier for the canvas.
 */
export type Id = string
/**
 * Informational. True when this version is exactly what the generator produced; False once a person edited it or ERRC moves were applied. No validation depends on it: the 2-4 cards per section bound applies to CanvasGenerated only.
 */
export type IsGenerated = boolean
/**
 * Identifier of the previous version of this canvas, if applicable.
 */
export type PreviousVersionId = string | null
/**
 * An enumeration of the different types of ERRC actions.
 */
export type ERRCActionType = "eliminate" | "reduce" | "raise" | "create"
/**
 * Unique identifier for the canvas card.
 */
export type Id1 = string
/**
 * The text of the canvas card.
 */
export type Text = string
/**
 * A list of canvas cards for the Channels section.
 */
export type Channels = CanvasCard[]
/**
 * A list of canvas cards for the Cost Structure section.
 */
export type CostStructure = CanvasCard[]
/**
 * A list of canvas cards for the Customer Relationships section.
 */
export type CustomerRelationships = CanvasCard[]
/**
 * A list of canvas cards for the Customer Segments section.
 */
export type CustomerSegments = CanvasCard[]
/**
 * A list of canvas cards for the Key Activities section.
 */
export type KeyActivities = CanvasCard[]
/**
 * A list of canvas cards for the Key Partnerships section.
 */
export type KeyPartnerships = CanvasCard[]
/**
 * A list of canvas cards for the Key Resources section.
 */
export type KeyResources = CanvasCard[]
/**
 * A list of canvas cards for the Revenue Streams section.
 */
export type RevenueStreams = CanvasCard[]
/**
 * A list of canvas cards for the Value Propositions section.
 */
export type ValuePropositions = CanvasCard[]
/**
 * The version number of the canvas.
 */
export type Version = number

/**
 * Represents a business canvas, which is a visual representation of key elements of a business model.
 */
export interface Canvas {
  empathy_map_ids: EmpathyMapIds
  group_id: GroupId
  id: Id
  is_generated?: IsGenerated
  previous_version_id?: PreviousVersionId
  sections: CanvasSections
  version: Version
  [k: string]: unknown
}
/**
 * The sections of the canvas, each containing a list of canvas cards.
 */
export interface CanvasSections {
  channels?: Channels
  cost_structure?: CostStructure
  customer_relationships?: CustomerRelationships
  customer_segments?: CustomerSegments
  key_activities?: KeyActivities
  key_partnerships?: KeyPartnerships
  key_resources?: KeyResources
  revenue_streams?: RevenueStreams
  value_propositions?: ValuePropositions
  [k: string]: unknown
}
/**
 * Represents a card in a business canvas, which can be used to capture key information or insights.
 */
export interface CanvasCard {
  /**
   * The ERRC action type associated with this canvas card, if applicable.
   */
  errc_marker?: ERRCActionType | null
  id: Id1
  text: Text
  [k: string]: unknown
}
