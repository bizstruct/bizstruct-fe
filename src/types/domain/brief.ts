// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/brief.json (bizstruct-domain@v0.17.0)

/**
 * Potential customer segments for the business: between 1 and 3. Each one gets its own empathy map, customer scenario and ideation.
 *
 * @minItems 1
 * @maxItems 3
 */
export type CustomerSegmentCandidates = [string] | [string, string] | [string, string, string]
/**
 * A list of existing resources that the business can leverage.
 */
export type ExistingResources = string[]
/**
 * A list of gaps or challenges that the business needs to address.
 */
export type Gaps = string[]
/**
 * A brief summary of the business idea.
 */
export type IdeaSummary = string
/**
 * The industry in which the business operates.
 */
export type Industry = string
/**
 * A hint about how the business can generate revenue.
 */
export type MonetizationHint = string | null

/**
 * A brief description of a business structure.
 */
export interface Brief {
  customer_segment_candidates: CustomerSegmentCandidates
  existing_resources: ExistingResources
  gaps: Gaps
  idea_summary: IdeaSummary
  industry: Industry
  monetization_hint?: MonetizationHint
  [k: string]: unknown
}
