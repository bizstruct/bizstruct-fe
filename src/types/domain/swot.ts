// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/swot.json (bizstruct-domain@v0.17.0)

/**
 * Identifier of the canvas this SWOT analysis is associated with.
 */
export type CanvasId = string
/**
 * Version of the canvas this SWOT analysis is associated with.
 */
export type CanvasVersion = number
/**
 * A list of SWOT cluster results, one for each cluster.
 *
 * @minItems 4
 * @maxItems 4
 */
export type Clusters = [SwotClusterResult, SwotClusterResult, SwotClusterResult, SwotClusterResult]
/**
 * Statements for the SWOT axis within the specified cluster: between 2 and 5.
 *
 * @minItems 2
 * @maxItems 5
 */
export type AxisStatements =
  | [SwotAxisStatement, SwotAxisStatement]
  | [SwotAxisStatement, SwotAxisStatement, SwotAxisStatement]
  | [SwotAxisStatement, SwotAxisStatement, SwotAxisStatement, SwotAxisStatement]
  | [SwotAxisStatement, SwotAxisStatement, SwotAxisStatement, SwotAxisStatement, SwotAxisStatement]
/**
 * A score representing the certainty of the statement, ranging from 1 (least certain) to 10 (most certain).
 */
export type Certainty = number
/**
 * A score representing the importance of the statement, ranging from 1 (least important) to 10 (most important).
 */
export type Importance = number
/**
 * A statement describing a negative aspect (Weakness or Threat).
 */
export type NegativeStatement = string
/**
 * A statement describing a positive aspect (Strength or Opportunity).
 */
export type PositiveStatement = string
/**
 * A score representing the impact of the statement, from -5 (very negative) to 5 (very positive). A forced choice: there is no neutral 0 (the book's bipolar scale), so every statement takes a side.
 */
export type Score = -5 | -4 | -3 | -2 | -1 | 1 | 2 | 3 | 4 | 5
/**
 * The cluster of the SWOT analysis(e.g., Value Proposition, Cost & Revenue, Infrastructure, Customer Interface).
 */
export type SwotCluster = "value_proposition" | "cost_revenue" | "infrastructure" | "customer_interface"
/**
 * Identified opportunities for the specified cluster, each scored 1-5: between 1 and 7.
 *
 * @minItems 1
 * @maxItems 7
 */
export type Opportunities =
  | [SwotOpportunity]
  | [SwotOpportunity, SwotOpportunity]
  | [SwotOpportunity, SwotOpportunity, SwotOpportunity]
  | [SwotOpportunity, SwotOpportunity, SwotOpportunity, SwotOpportunity]
  | [SwotOpportunity, SwotOpportunity, SwotOpportunity, SwotOpportunity, SwotOpportunity]
  | [SwotOpportunity, SwotOpportunity, SwotOpportunity, SwotOpportunity, SwotOpportunity, SwotOpportunity]
  | [
      SwotOpportunity,
      SwotOpportunity,
      SwotOpportunity,
      SwotOpportunity,
      SwotOpportunity,
      SwotOpportunity,
      SwotOpportunity
    ]
/**
 * How strongly this applies to this model: 1 (barely) to 5 (very strongly). Interpretation is a project decision; the book's pages give the scale with no caption.
 */
export type Score1 = number
/**
 * The opportunity statement (typically phrased as, or derived from, one of the book's generative questions).
 */
export type Text = string
/**
 * One rating per threat question of this cluster's catalog (2, 5, 7 or 7 questions depending on the cluster), each scored 1-5. Exactly the cluster's catalog, each question once, in any order.
 *
 * @minItems 2
 * @maxItems 7
 */
export type Threats =
  | [SwotThreat, SwotThreat]
  | [SwotThreat, SwotThreat, SwotThreat]
  | [SwotThreat, SwotThreat, SwotThreat, SwotThreat]
  | [SwotThreat, SwotThreat, SwotThreat, SwotThreat, SwotThreat]
  | [SwotThreat, SwotThreat, SwotThreat, SwotThreat, SwotThreat, SwotThreat]
  | [SwotThreat, SwotThreat, SwotThreat, SwotThreat, SwotThreat, SwotThreat, SwotThreat]
/**
 * Which catalog threat this rates. Each cluster must rate exactly the questions of its own catalog, once each.
 */
export type ThreatQuestion =
  | "substitutes_available"
  | "competitor_price_or_value_pressure"
  | "margin_pressure"
  | "revenue_concentration"
  | "revenue_stream_decline"
  | "cost_unpredictability"
  | "cost_outgrowing_revenue"
  | "resource_supply_disruption"
  | "resource_quality_risk"
  | "key_activity_disruption"
  | "activity_quality_risk"
  | "partner_loss"
  | "partner_defection_to_competitors"
  | "partner_over_dependence"
  | "market_saturation"
  | "market_share_pressure"
  | "customer_defection"
  | "competition_intensifying"
  | "channel_threat_from_competitors"
  | "channel_irrelevance"
  | "relationship_deterioration"
/**
 * How strongly this threat applies to this model: 1 (barely) to 5 (very strongly). Interpretation is a project decision; the book's pages give the scale with no caption.
 */
export type Score2 = number
/**
 * How this threat applies to this business model, in one or two sentences.
 */
export type Text1 = string
/**
 * Identifier of the EnvironmentScan used to inform Opportunities/Threats for this cluster set, if any. Strengths/Weaknesses are always derived solely from the canvas.
 */
export type EnvironmentScanId = string | null
/**
 * Unique identifier for the SWOT analysis.
 */
export type Id = string

/**
 * Represents a SWOT analysis for a business model, organized by clusters.
 */
export interface Swot {
  canvas_id: CanvasId
  canvas_version: CanvasVersion
  clusters: Clusters
  environment_scan_id?: EnvironmentScanId
  id: Id
  [k: string]: unknown
}
/**
 * Represents the result of a SWOT analysis for a specific cluster.
 */
export interface SwotClusterResult {
  axis_statements: AxisStatements
  cluster: SwotCluster
  opportunities: Opportunities
  threats: Threats
  [k: string]: unknown
}
/**
 * Represents a statement for a SWOT axis (Strengths, Weaknesses, Opportunities, Threats).
 */
export interface SwotAxisStatement {
  certainty: Certainty
  importance: Importance
  negative_statement: NegativeStatement
  positive_statement: PositiveStatement
  score: Score
  [k: string]: unknown
}
/**
 * Represents a single Opportunity, per the BMG document's Evaluating
 * Business Models format (pp. 220-223): each generative question is
 * paired with a 1-5 scale. The book gives no caption for this scale; the
 * working interpretation used here is "how strongly this applies to this
 * model" (1 = barely, 5 = very strongly).
 */
export interface SwotOpportunity {
  score: Score1
  text: Text
  [k: string]: unknown
}
/**
 * Represents the rating of ONE question of the fixed threat catalog
 * (`ThreatQuestion`). Every SWOT iteration rates the same 21 questions, so
 * the sum of the scores is comparable between iterations. Same 1-5 scale
 * and working interpretation as `SwotOpportunity`.
 */
export interface SwotThreat {
  question: ThreatQuestion
  score: Score2
  text: Text1
  [k: string]: unknown
}
