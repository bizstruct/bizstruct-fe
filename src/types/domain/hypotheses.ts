// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/bbee62baff73b4c40eadedc7a285274bf63b15c0/schemas/hypotheses.json (bizstruct-domain@bbee62baff73b4c40eadedc7a285274bf63b15c0)

/**
 * @minItems 5
 */
export type Hypotheses1 = [Hypothesis, Hypothesis, Hypothesis, Hypothesis, Hypothesis, ...Hypothesis[]]
/**
 * Testing Business Ideas risk categories: Desirability / Viability / Feasibility.
 */
export type HypothesisCategory = "desirability" | "viability" | "feasibility"
/**
 * Format H<group>.<index>, e.g. H1.1 — group number matches the quadrant number (q1 -> H1.x).
 */
export type Id = string
/**
 * Importance x uncertainty quadrant for prioritization — see bizstruct_domain.enums.Quadrant for the full axis definition. q1: high importance/high uncertainty (test first); q2: high importance/low uncertainty; q3: low importance/high uncertainty; q4: low importance/low uncertainty.
 */
export type Quadrant = "q1" | "q2" | "q3" | "q4"
/**
 * A falsifiable statement, specific enough that a concrete result would prove it wrong — must include a number, metric, or percentage.
 */
export type Text = string

/**
 * Output of the `hypotheses` stage.
 */
export interface Hypotheses {
  hypotheses: Hypotheses1
}
/**
 * One testable assumption behind the business model.
 */
export interface Hypothesis {
  category: HypothesisCategory
  id: Id
  quadrant: Quadrant
  text: Text
}

export const HYPOTHESIS_CATEGORY_VALUES = ["desirability", "viability", "feasibility"] as const
export const QUADRANT_VALUES = ["q1", "q2", "q3", "q4"] as const
