import { z } from "zod"

export const HypothesisCategorySchema = z.enum(["Desirability", "Viability", "Feasibility"])
export const HypothesisQuadrantSchema = z.enum(["q1", "q2", "q3", "q4"])

export const HypothesisSchema = z.object({
  id: z.string(),
  text: z.string(),
  category: HypothesisCategorySchema,
  quadrant: HypothesisQuadrantSchema,
})

export type HypothesisCategory = z.infer<typeof HypothesisCategorySchema>
export type HypothesisQuadrant = z.infer<typeof HypothesisQuadrantSchema>
export type Hypothesis = z.infer<typeof HypothesisSchema>
