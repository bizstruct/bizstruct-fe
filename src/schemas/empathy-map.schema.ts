import { z } from "zod"

export const EMPATHY_CATEGORIES = ["says", "thinks", "does", "feels", "pains", "gains"] as const

export const EmpathyCategorySchema = z.enum(EMPATHY_CATEGORIES)

export const EmpathyItemSchema = z.object({
  id: z.number(),
  text: z.string(),
})

export const EmpathyDataSchema = z.object({
  says: z.array(EmpathyItemSchema),
  thinks: z.array(EmpathyItemSchema),
  does: z.array(EmpathyItemSchema),
  feels: z.array(EmpathyItemSchema),
  pains: z.array(EmpathyItemSchema),
  gains: z.array(EmpathyItemSchema),
})

export type EmpathyCategory = z.infer<typeof EmpathyCategorySchema>
export type EmpathyItem = z.infer<typeof EmpathyItemSchema>
export type EmpathyData = z.infer<typeof EmpathyDataSchema>
