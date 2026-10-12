// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/environment_scan.json (bizstruct-domain@v0.17.0)

/**
 * Unique identifier for the environment scan.
 */
export type Id = string
/**
 * A list of industry forces relevant to the environment scan.
 *
 * @minItems 1
 */
export type IndustryForces = [string, ...string[]]
/**
 * A list of key trends relevant to the environment scan.
 *
 * @minItems 1
 */
export type KeyTrends = [string, ...string[]]
/**
 * A list of macroeconomic forces relevant to the environment scan.
 *
 * @minItems 1
 */
export type MacroeconomicForces = [string, ...string[]]
/**
 * A list of market forces relevant to the environment scan.
 *
 * @minItems 1
 */
export type MarketForces = [string, ...string[]]
/**
 * Identifier of the project this environment scan is associated with.
 */
export type ProjectId = string
/**
 * External sources backing the market/industry analysis below. A generation with no sources is treated as a failed generation, not as a valid empty result.
 *
 * @minItems 1
 */
export type Sources = [Source, ...Source[]]
/**
 * What this source specifically supports (which figure or claim).
 */
export type Note = string
/**
 * The date the figure or claim was retrieved from the source (ISO date). Required next to every external quantitative claim (ADR-0005): market figures go stale and the source alone does not say how old they are.
 */
export type RetrievedAt = string
/**
 * Short label for the source (publication, report, or site name).
 */
export type Title = string
/**
 * Link to the source, if available.
 */
export type Url = string | null

/**
 * Represents an environment scan in a business context.
 */
export interface EnvironmentScan {
  id: Id
  industry_forces: IndustryForces
  key_trends: KeyTrends
  macroeconomic_forces: MacroeconomicForces
  market_forces: MarketForces
  project_id: ProjectId
  sources: Sources
  [k: string]: unknown
}
/**
 * Represents an external source backing a quantitative claim in
 * EnvironmentScan or BusinessCase. Required so that "obtained from
 * external sources" is verifiable rather than merely claimed.
 */
export interface Source {
  note: Note
  retrieved_at: RetrievedAt
  title: Title
  url?: Url
  [k: string]: unknown
}
