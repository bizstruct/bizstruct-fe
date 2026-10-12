// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/ideation.json (bizstruct-domain@v0.17.0)

/**
 * Identifier of the empathy map this ideation instance is associated with.
 */
export type EmpathyMapId = string
/**
 * A rationale explaining the reasoning behind the epicenter classification.
 */
export type Rationale = string
/**
 * The epicenter tags: one or more distinct concrete epicenters. When there are two or more, MULTIPLE_EPICENTER must also be listed; with a single concrete tag it must not be.
 *
 * @minItems 1
 */
export type Tags = [Epicenter, ...Epicenter[]]
/**
 * An enumeration of the different types of epicenters.
 */
export type Epicenter = "resource_driven" | "offer_driven" | "customer_driven" | "finance_driven" | "multiple_epicenter"
/**
 * Unique identifier for the ideation instance.
 */
export type Id = string
/**
 * 'What if' questions that explore potential scenarios or ideas: between 1 and 10.
 *
 * @minItems 1
 * @maxItems 10
 */
export type WhatIfQuestions =
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]
  | [string, string, string, string, string]
  | [string, string, string, string, string, string]
  | [string, string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string, string]
  | [string, string, string, string, string, string, string, string, string, string]

/**
 * Represents an ideation instance in a business context.
 */
export interface Ideation {
  empathy_map_id: EmpathyMapId
  epicenter: EpicenterClassification
  id: Id
  what_if_questions: WhatIfQuestions
  [k: string]: unknown
}
/**
 * The classification of the epicenter for this ideation instance.
 */
export interface EpicenterClassification {
  rationale: Rationale
  tags: Tags
  [k: string]: unknown
}
