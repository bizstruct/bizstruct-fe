// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.9.0/schemas/scenario.json (bizstruct-domain@v0.9.0)

export type Label = string
export type Value = string
export type Name = string
export type PainPoint = string
export type Role = string
/**
 * @minItems 5
 * @maxItems 5
 */
export type Timeline = [TimelineStep, TimelineStep, TimelineStep, TimelineStep, TimelineStep]
export type StepType = "context" | "goal" | "action" | "result" | "impact"
export type Text = string

/**
 * Output of the `scenario` stage: a before/after user journey.
 */
export interface Scenario {
  metrics: ScenarioMetrics
  persona: Persona
  timeline: Timeline
}
export interface ScenarioMetrics {
  after: MetricValue
  before: MetricValue
}
export interface MetricValue {
  label: Label
  value: Value
}
/**
 * The protagonist of the scenario — should be the same persona as the
 * project's `empathy_map`, not a newly invented one.
 */
export interface Persona {
  name: Name
  pain_point: PainPoint
  role: Role
}
/**
 * One step of the persona's journey.
 */
export interface TimelineStep {
  step_type: StepType
  text: Text
}


