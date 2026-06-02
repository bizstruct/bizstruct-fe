import { z } from "zod"

export const PersonaSchema = z.object({
  name: z.string(),
  initials: z.string(),
  role: z.string(),
  painPoint: z.string(),
})

export const TimelineStepSchema = z.object({
  iconKey: z.string(),
  labelKey: z.string(),
  text: z.string(),
  highlight: z.boolean().optional(),
})

export const ScenarioMetricsSchema = z.object({
  before: z.object({ value: z.string(), descriptionKey: z.string() }),
  after: z.object({ value: z.string(), descriptionKey: z.string() }),
})

export const ScenarioDataSchema = z.object({
  persona: PersonaSchema,
  timeline: z.array(TimelineStepSchema),
  metrics: ScenarioMetricsSchema,
})

export type Persona = z.infer<typeof PersonaSchema>
export type TimelineStep = z.infer<typeof TimelineStepSchema>
export type ScenarioMetrics = z.infer<typeof ScenarioMetricsSchema>
export type ScenarioData = z.infer<typeof ScenarioDataSchema>
