// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/future_scenario.json (bizstruct-domain@v0.17.0)

/**
 * Identifier of the canvas this future scenario is associated with.
 */
export type CanvasId = string
/**
 * Unique identifier for the future scenario.
 */
export type Id = string
/**
 * Uncertainty drivers that may impact the future scenario: between 2 and 4.
 *
 * @minItems 2
 * @maxItems 4
 */
export type UncertaintyDrivers = [string, string] | [string, string, string] | [string, string, string, string]
/**
 * A list of variants for this future scenario.
 *
 * @minItems 2
 * @maxItems 4
 */
export type Variants =
  | [FutureScenarioVariant, FutureScenarioVariant]
  | [FutureScenarioVariant, FutureScenarioVariant, FutureScenarioVariant]
  | [FutureScenarioVariant, FutureScenarioVariant, FutureScenarioVariant, FutureScenarioVariant]
/**
 * A list of adaptation questions related to this future scenario variant.
 *
 * @minItems 1
 */
export type AdaptationQuestions = [AdaptationQuestion, ...AdaptationQuestion[]]
/**
 * The adaptation question related to the specified canvas section.
 */
export type Question = string
/**
 * The section of the canvas to which this adaptation question pertains.
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
 * The name of the future scenario variant.
 */
export type Name = string
/**
 * A narrative describing the future scenario variant.
 */
export type Narrative = string

/**
 * Represents a future scenario in a business context.
 */
export interface FutureScenario {
  canvas_id: CanvasId
  id: Id
  uncertainty_drivers: UncertaintyDrivers
  variants: Variants
  [k: string]: unknown
}
/**
 * Represents a variant of a future scenario in a business context.
 */
export interface FutureScenarioVariant {
  adaptation_questions: AdaptationQuestions
  name: Name
  narrative: Narrative
  [k: string]: unknown
}
/**
 * Represents an adaptation question related to a specific section of the business model canvas.
 */
export interface AdaptationQuestion {
  question: Question
  section: CanvasSection
  [k: string]: unknown
}
