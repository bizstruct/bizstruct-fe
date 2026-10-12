// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/pitch.json (bizstruct-domain@v0.17.0)

/**
 * Identifier of the business case this pitch is associated with, if applicable.
 */
export type BusinessCaseId = string | null
/**
 * A concise summary of the business model being pitched.
 */
export type BusinessModelSummary = string
/**
 * Identifier of the canvas this pitch is associated with.
 */
export type CanvasId = string
/**
 * A list of competitive advantages that differentiate the business from its competitors.
 *
 * @minItems 1
 */
export type CompetitiveAdvantages = [string, ...string[]]
/**
 * A section providing a financial analysis of the business, if applicable.
 */
export type FinancialAnalysisSection = string | null
/**
 * A brief and compelling hook for the pitch.
 */
export type Hook = string
/**
 * Unique identifier for the pitch.
 */
export type Id = string
/**
 * Identifier of the project this pitch is associated with.
 */
export type ProjectId = string
/**
 * A list of potential risks associated with the business and strategies to mitigate them.
 *
 * @minItems 1
 */
export type RiskAnalysis = [string, ...string[]]
/**
 * Identifier of the storytelling this pitch is associated with.
 */
export type StorytellingId = string
/**
 * Identifier of the SWOT analysis this pitch is associated with.
 */
export type SwotId = string
/**
 * Identifier of the team information this pitch is associated with, if applicable.
 */
export type TeamInfoId = string | null
/**
 * A section highlighting the team behind the business, if applicable.
 */
export type TeamSection = string | null

/**
 * Represents a business pitch with various attributes and sections.
 */
export interface Pitch {
  business_case_id?: BusinessCaseId
  business_model_summary: BusinessModelSummary
  canvas_id: CanvasId
  competitive_advantages: CompetitiveAdvantages
  financial_analysis_section?: FinancialAnalysisSection
  hook: Hook
  id: Id
  project_id: ProjectId
  risk_analysis: RiskAnalysis
  storytelling_id: StorytellingId
  swot_id: SwotId
  team_info_id?: TeamInfoId
  team_section?: TeamSection
  [k: string]: unknown
}
