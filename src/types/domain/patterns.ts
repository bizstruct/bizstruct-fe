// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/patterns.json (bizstruct-domain@v0.17.0)

/**
 * The branch decision for the canvas in this patterns instance.
 */
export type CanvasBranch = "unified_model" | "split_model"
/**
 * A list of canvas groups for the segments in this patterns instance.
 *
 * @minItems 1
 */
export type Groups = [CanvasGroup, ...CanvasGroup[]]
/**
 * A list of empathy map identifiers that belong to this canvas group.
 *
 * @minItems 1
 */
export type EmpathyMapIds = [string, ...string[]]
/**
 * Unique identifier for the canvas group (referenced by Canvas.group_id).
 */
export type Id = string
/**
 * The type of relationship between the segments in this canvas group.
 */
export type SegmentRelationType = "multi_sided" | "segmented" | "diversified"
/**
 * Unique identifier for the patterns instance.
 */
export type Id1 = string
/**
 * A score representing the conflict between the two segments, on a scale from -7 to 0.
 */
export type Conflict = number
/**
 * Identifier of the first empathy map in the segment pair.
 */
export type EmpathyMapIdA = string
/**
 * Identifier of the second empathy map in the segment pair.
 */
export type EmpathyMapIdB = string
/**
 * A score representing the synergy between the two segments, on a scale from 0 to 5.
 */
export type Synergy = number
/**
 * A list of pairwise segment scores for the segments in this patterns instance.
 */
export type PairwiseScores = PairwiseSegmentScore[]
/**
 * A list of pattern tags for the business model patterns in this patterns instance.
 *
 * @maxItems 5
 */
export type PatternTags =
  | []
  | [PatternTag]
  | [PatternTag, PatternTag]
  | [PatternTag, PatternTag, PatternTag]
  | [PatternTag, PatternTag, PatternTag, PatternTag]
  | [PatternTag, PatternTag, PatternTag, PatternTag, PatternTag]
/**
 * The business model pattern to which this tag applies.
 */
export type Pattern = "unbundling" | "long_tail" | "multi_sided_platform" | "free" | "open_business_model"
/**
 * A rationale explaining the reasoning behind the pattern tag.
 */
export type Rationale = string
/**
 * The subtype of the business model pattern, if applicable.
 */
export type Subtype = FreePatternSubtype | OpenBusinessModelPatternSubtype | null
/**
 * An enumeration of the different subtypes of the "free" business model pattern.
 */
export type FreePatternSubtype = "freemium" | "ad_supported" | "bait_and_hook"
/**
 * An enumeration of the different subtypes of the "open business model" pattern.
 */
export type OpenBusinessModelPatternSubtype = "outside_in" | "inside_out"
/**
 * Identifier of the project this patterns instance is associated with.
 */
export type ProjectId = string

/**
 * Represents a collection of patterns in a business context.
 */
export interface Patterns {
  branch_decision: CanvasBranch
  groups: Groups
  id: Id1
  pairwise_scores: PairwiseScores
  pattern_tags: PatternTags
  project_id: ProjectId
  [k: string]: unknown
}
/**
 * Represents a group of segments in a business context.
 */
export interface CanvasGroup {
  empathy_map_ids: EmpathyMapIds
  id: Id
  relation_type: SegmentRelationType
  [k: string]: unknown
}
/**
 * Represents a score between two segments in a business context.
 *
 * Bounds follow the BMG document's NetScore formula: synergy 0..+5,
 * conflict -7..0. Thresholds for branch/pattern decisions (e.g.
 * Multi-Sided at net_score >= +3) are calibrated against this range;
 * widening it invalidates those thresholds.
 */
export interface PairwiseSegmentScore {
  conflict: Conflict
  segment_pair: SegmentPair
  synergy: Synergy
  [k: string]: unknown
}
/**
 * The pair of segments being scored.
 */
export interface SegmentPair {
  empathy_map_id_a: EmpathyMapIdA
  empathy_map_id_b: EmpathyMapIdB
  [k: string]: unknown
}
/**
 * Represents a tag for a business model pattern in a business context.
 */
export interface PatternTag {
  pattern: Pattern
  rationale: Rationale
  subtype?: Subtype
  [k: string]: unknown
}
