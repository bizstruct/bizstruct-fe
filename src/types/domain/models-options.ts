// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/bbee62baff73b4c40eadedc7a285274bf63b15c0/schemas/models_options.json (bizstruct-domain@bbee62baff73b4c40eadedc7a285274bf63b15c0)

/**
 * @minItems 3
 * @maxItems 3
 */
export type Options = [BusinessModelOption, BusinessModelOption, BusinessModelOption]
/**
 * Target customer segment for this option.
 */
export type Audience = string
/**
 * What the model is and why it fits the idea's audience.
 */
export type Description = string
export type Id = string
/**
 * The primary success metric for this monetization type, e.g. MRR/NRR for subscription, GMV/take rate for a marketplace, ACV for retainer_plus_saas.
 */
export type KeyMetric = string
/**
 * How a business model option makes money.
 */
export type MonetizationType =
  "subscription" | "transaction_fee" | "retainer_plus_saas" | "advertising" | "licensing" | "marketplace_take_rate"
/**
 * Viability score for this option.
 */
export type Score = number
/**
 * Why this score — what specifically makes the model strong or weak, not just a restatement of the number.
 */
export type ScoreRationale = string
/**
 * How long before the customer sees the first result, e.g. '30 minutes', '2 weeks'.
 */
export type TimeToValue = string
export type Title = string
export type ValueProposition = string
export type SelectedId = string | null

/**
 * Output of the `models_options` stage: exactly 3 candidate business
 * models, with at most one selected.
 */
export interface ModelsOptions {
  options: Options
  selected_id?: SelectedId
}
/**
 * One candidate business model for the idea.
 */
export interface BusinessModelOption {
  audience: Audience
  description: Description
  id: Id
  key_metric: KeyMetric
  monetization: MonetizationType
  score: Score
  score_rationale: ScoreRationale
  time_to_value: TimeToValue
  title: Title
  value_proposition: ValueProposition
}

export const MONETIZATION_TYPE_VALUES = ["subscription", "transaction_fee", "retainer_plus_saas", "advertising", "licensing", "marketplace_take_rate"] as const
