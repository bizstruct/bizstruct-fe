// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/bbee62baff73b4c40eadedc7a285274bf63b15c0/schemas/empathy_map.json (bizstruct-domain@bbee62baff73b4c40eadedc7a285274bf63b15c0)

/**
 * @minItems 3
 * @maxItems 6
 */
export type Does =
  | [EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
/**
 * 1-based position within its section.
 */
export type Id = number
export type Text = string
/**
 * @minItems 3
 * @maxItems 6
 */
export type Feels =
  | [EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
/**
 * @minItems 3
 * @maxItems 6
 */
export type Gains =
  | [EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
/**
 * @minItems 3
 * @maxItems 6
 */
export type Pains =
  | [EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
/**
 * @minItems 3
 * @maxItems 6
 */
export type Says =
  | [EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
/**
 * @minItems 3
 * @maxItems 6
 */
export type Thinks =
  | [EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]
  | [EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem, EmpathyItem]

/**
 * Output of the `empathy_map` stage: the first block generated, with no
 * prior context — see bizstruct_domain.chain.STAGES.
 */
export interface EmpathyMap {
  does: Does
  feels: Feels
  gains: Gains
  pains: Pains
  says: Says
  thinks: Thinks
}
/**
 * One observation within an empathy map section.
 */
export interface EmpathyItem {
  id: Id
  text: Text
}


