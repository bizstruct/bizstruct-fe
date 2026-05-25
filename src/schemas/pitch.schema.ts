import { z } from "zod"

export const StoryTypeSchema = z.enum(["investor", "customer"])

export const PitchStepSchema = z.object({
  id: z.number(),
  titleKey: z.string(),
  content: z.string(),
})

export const PitchDataSchema = z.object({
  investor: z.array(PitchStepSchema),
  customer: z.array(PitchStepSchema),
})

export type StoryType = z.infer<typeof StoryTypeSchema>
export type PitchStep = z.infer<typeof PitchStepSchema>
export type PitchData = z.infer<typeof PitchDataSchema>
