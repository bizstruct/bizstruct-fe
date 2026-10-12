// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/business_case.json (bizstruct-domain@v0.17.0)

/**
 * The formula used to calculate the breakeven point for the business case.
 */
export type BreakevenFormula = string
/**
 * A brief description of the capital and operating costs associated with the business case.
 */
export type CapitalAndOperatingCosts = string
/**
 * A brief description of the funding requirements for the business case.
 */
export type FundingRequirements = string
/**
 * Unique identifier for the business case.
 */
export type Id = string
/**
 * A brief description of the market benchmarks relevant to the business case.
 */
export type MarketBenchmarks = string
/**
 * Notes on the profit potential of the business case.
 */
export type ProfitPotentialNotes = string
/**
 * Identifier of the project this business case is associated with.
 */
export type ProjectId = string
/**
 * A list of sales scenarios relevant to the business case.
 *
 * @minItems 1
 */
export type SalesScenarios = [SalesScenario, ...SalesScenario[]]
/**
 * A brief description of the sales scenario.
 */
export type Description = string
/**
 * The name of the sales scenario.
 */
export type Name = string
/**
 * External sources backing the market benchmarks. A generation with no sources is treated as a failed generation, not as a valid empty result.
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
 * Represents a business case in a business context.
 */
export interface BusinessCase {
  breakeven_formula: BreakevenFormula
  capital_and_operating_costs: CapitalAndOperatingCosts
  funding_requirements: FundingRequirements
  id: Id
  market_benchmarks: MarketBenchmarks
  profit_potential_notes: ProfitPotentialNotes
  project_id: ProjectId
  sales_scenarios: SalesScenarios
  sources: Sources
  [k: string]: unknown
}
/**
 * Represents a sales scenario in a business context.
 */
export interface SalesScenario {
  description: Description
  name: Name
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
