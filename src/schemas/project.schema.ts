import { z } from "zod"

export const ProjectSchema = z.object({
  id: z.string(),
  translationKey: z.enum(["ecoSync", "smartGrid", "carbonTrack", "bioWaste"]),
})

export const HistoryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  translationKey: z.enum(["ecoSync", "greenLogistics", "carbonTrack", "agroEsg"]).optional(),
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
