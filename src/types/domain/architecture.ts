// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.5.0/schemas/architecture.json (bizstruct-domain@v0.5.0)

/**
 * Epicentres of business model innovation.
 *
 * Osterwalder & Pigneur, "Business Model Generation" — Epicentres of
 * Business Model Innovation. Exactly 5 canonical values; do not add
 * invented values (e.g. a "competitor-driven" epicenter is not part
 * of the methodology).
 */
export type Epicenter = "resource_driven" | "offer_driven" | "customer_driven" | "finance_driven" | "multiple_epicenter"
/**
 * Rationale for the chosen epicenter, in English.
 */
export type EpicenterRationaleEn = string
/**
 * Обґрунтування вибору епіцентру українською мовою.
 */
export type EpicenterRationaleUk = string
/**
 * Business model patterns.
 *
 * Osterwalder & Pigneur, "Business Model Generation" — Part 2,
 * Patterns. Exactly 5 canonical values; do not add invented values
 * (e.g. "PAID" is not part of the methodology).
 */
export type Pattern = "unbundling" | "long_tail" | "multi_sided_platform" | "free" | "open_business_model"
/**
 * Rationale for the chosen pattern, in English.
 */
export type PatternRationaleEn = string
/**
 * Обґрунтування вибору патерну українською мовою.
 */
export type PatternRationaleUk = string
/**
 * Subtypes that refine specific patterns.
 *
 * Only meaningful in combination with `Pattern.FREE`
 * (`freemium`, `ad_supported`, `bait_and_hook`) or
 * `Pattern.OPEN_BUSINESS_MODEL` (`outside_in`, `inside_out`).
 * See `PATTERN_SUBTYPES` below for the full mapping.
 */
export type PatternSubtype = "freemium" | "ad_supported" | "bait_and_hook" | "outside_in" | "inside_out"

/**
 * Output of the `architecture` stage: epicenter and pattern classification.
 *
 * Depends on `canvas` in the generation chain — the epicenter names which
 * part of the Business Model Canvas is the driver of change, so it cannot
 * be determined before the canvas exists.
 */
export interface Architecture {
  epicenter: Epicenter
  epicenter_rationale_en: EpicenterRationaleEn
  epicenter_rationale_uk: EpicenterRationaleUk
  pattern: Pattern
  pattern_rationale_en: PatternRationaleEn
  pattern_rationale_uk: PatternRationaleUk
  /**
   * Subtype refining the pattern. Required for patterns that define subtypes (free, open_business_model) — freemium, ad-supported, and bait-and-hook are distinct economics and must be told apart; must be null for all other patterns.
   */
  pattern_subtype?: PatternSubtype | null
}

export const EPICENTER_VALUES = ["resource_driven", "offer_driven", "customer_driven", "finance_driven", "multiple_epicenter"] as const
export const PATTERN_VALUES = ["unbundling", "long_tail", "multi_sided_platform", "free", "open_business_model"] as const
export const PATTERN_SUBTYPE_VALUES = ["freemium", "ad_supported", "bait_and_hook", "outside_in", "inside_out"] as const
