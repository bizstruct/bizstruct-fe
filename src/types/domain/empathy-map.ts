// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/empathy_map.json (bizstruct-domain@v0.17.0)

/**
 * The persona's gains or desires.
 *
 * @minItems 1
 */
export type Gains = [string, ...string[]]
/**
 * What the persona hears from others.
 *
 * @minItems 1
 */
export type Hears = [string, ...string[]]
/**
 * Unique identifier for the empathy map.
 */
export type Id = string
/**
 * The persona's pains or frustrations.
 *
 * @minItems 1
 */
export type Pains = [string, ...string[]]
/**
 * Demographic information of the persona.
 */
export type PersonaDemographics = string
/**
 * Name of the persona for whom the empathy map is created.
 */
export type PersonaName = string
/**
 * Identifier of the project this empathy map belongs to.
 */
export type ProjectId = string
/**
 * What the persona says and does.
 *
 * @minItems 1
 */
export type SaysAndDoes = [string, ...string[]]
/**
 * What the persona sees in their environment.
 *
 * @minItems 1
 */
export type Sees = [string, ...string[]]
/**
 * What the persona thinks and feels.
 *
 * @minItems 1
 */
export type ThinksAndFeels = [string, ...string[]]

export interface EmpathyMap {
  gains: Gains
  hears: Hears
  id: Id
  pains: Pains
  persona_demographics: PersonaDemographics
  persona_name: PersonaName
  project_id: ProjectId
  says_and_does: SaysAndDoes
  sees: Sees
  thinks_and_feels: ThinksAndFeels
  [k: string]: unknown
}
