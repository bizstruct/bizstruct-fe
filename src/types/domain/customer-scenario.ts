// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/customer_scenario.json (bizstruct-domain@v0.17.0)

/**
 * The channel through which the customer interacts with the product or service.
 */
export type ChannelType = string | null
/**
 * Identifier of the empathy map this customer scenario is associated with.
 */
export type EmpathyMapId = string
/**
 * Unique identifier for the customer scenario.
 */
export type Id = string
/**
 * Indicates whether there is a signal of interdependence in this customer scenario.
 */
export type InterdependenceSignal = boolean
/**
 * A list of open-ended questions that arise from this customer scenario.
 */
export type OpenQuestions = string[]
/**
 * An enumeration of the different pricing tiers.
 */
export type PricingTier = "premium" | "mid_market" | "low_cost"
/**
 * The type of relationship the customer has with the business in this scenario.
 */
export type RelationshipType = string | null
/**
 * A narrative describing the situation or context of the customer scenario.
 */
export type SituationNarrative = string

/**
 * A customer scenario describes a specific situation or
 * context in which a customer interacts with a product or service.
 */
export interface CustomerScenario {
  channel_type?: ChannelType
  empathy_map_id: EmpathyMapId
  id: Id
  interdependence_signal?: InterdependenceSignal
  open_questions: OpenQuestions
  /**
   * The pricing tier relevant to this customer scenario, if applicable.
   */
  pricing_tier?: PricingTier | null
  relationship_type?: RelationshipType
  situation_narrative: SituationNarrative
  [k: string]: unknown
}
