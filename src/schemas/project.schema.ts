import { z } from "zod"

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  idea: z.string().optional(),
  status: z.string().optional(),
  translationKey: z.string().nullish(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const HistoryItemSchema = ProjectSchema.extend({
  empathy: z
    .object({
      pains: z.array(z.string()),
      gains: z.array(z.string()),
    })
    .optional(),
})

export const GeneratedBusinessModelSchema = z.object({
  id: z.string(),
  title: z.string(),
  audience: z.string(),
  valueProposition: z.string(),
  description: z.string(),
  monetization: z.string(),
  keyMetric: z.string(),
  timeToValue: z.string(),
  score: z.number(),
  scoreRationale: z.string(),
})

export const GeneratedProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  idea: z.string(),
  models: z.array(GeneratedBusinessModelSchema),
})

export type Project = z.infer<typeof ProjectSchema>
export type HistoryItem = z.infer<typeof HistoryItemSchema>
export type GeneratedBusinessModel = z.infer<typeof GeneratedBusinessModelSchema>
export type GeneratedProject = z.infer<typeof GeneratedProjectSchema>
