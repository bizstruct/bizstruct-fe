// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.6.0/schemas/scenario.json (bizstruct-domain@v0.6.0)

export type LabelEn = string
export type LabelUk = string
export type ValueEn = string
export type ValueUk = string
export type NameEn = string
export type NameUk = string
export type PainPointEn = string
export type PainPointUk = string
export type RoleEn = string
export type RoleUk = string
/**
 * @minItems 5
 * @maxItems 5
 */
export type Timeline = [TimelineStep, TimelineStep, TimelineStep, TimelineStep, TimelineStep]
export type StepType = "context" | "goal" | "action" | "result" | "impact"
export type TextEn = string
export type TextUk = string

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
  label_en: LabelEn
  label_uk: LabelUk
  value_en: ValueEn
  value_uk: ValueUk
}
/**
 * The protagonist of the scenario — should be the same persona as the
 * project's `empathy_map`, not a newly invented one.
 */
export interface Persona {
  name_en: NameEn
  name_uk: NameUk
  pain_point_en: PainPointEn
  pain_point_uk: PainPointUk
  role_en: RoleEn
  role_uk: RoleUk
}
/**
 * One step of the persona's journey.
 */
export interface TimelineStep {
  step_type: StepType
  text_en: TextEn
  text_uk: TextUk
}


