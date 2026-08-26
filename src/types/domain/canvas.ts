// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.8.1/schemas/canvas.json (bizstruct-domain@v0.8.1)

export type Id = string
/**
 * True if the LLM generated this card. Must be set to False whenever a user adds a card or edits an existing one's text.
 */
export type IsAiGenerated = boolean
export type Text = string
export type Channels = CanvasCard[]
export type CostStructure = CanvasCard[]
export type CustomerRelationships = CanvasCard[]
export type CustomerSegments = CanvasCard[]
export type KeyActivities = CanvasCard[]
export type KeyPartners = CanvasCard[]
export type KeyResources = CanvasCard[]
export type RevenueStreams = CanvasCard[]
export type ValuePropositions = CanvasCard[]

/**
 * The nine Business Model Canvas sections, as persisted and edited via
 * CRUD. No per-section cardinality constraint — see module docstring.
 */
export interface Canvas {
  channels?: Channels
  cost_structure?: CostStructure
  customer_relationships?: CustomerRelationships
  customer_segments?: CustomerSegments
  key_activities?: KeyActivities
  key_partners?: KeyPartners
  key_resources?: KeyResources
  revenue_streams?: RevenueStreams
  value_propositions?: ValuePropositions
}
/**
 * A single card within one Business Model Canvas section.
 */
export interface CanvasCard {
  id: Id
  is_ai_generated?: IsAiGenerated
  text: Text
}


