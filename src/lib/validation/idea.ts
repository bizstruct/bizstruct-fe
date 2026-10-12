import { z } from "zod"

/** be enforces 50-2000 characters on the trimmed idea; the form says so before the request. */
export const IDEA_MIN = 50
export const IDEA_MAX = 2000

export const OPTIONAL_STAGES = ["business_case", "environment_scan"] as const
export type OptionalStage = (typeof OPTIONAL_STAGES)[number]

export type IdeaProblem = "tooShort" | "tooLong"

export function ideaProblem(idea: string): IdeaProblem | null {
  const length = idea.trim().length
  if (length < IDEA_MIN) return "tooShort"
  if (length > IDEA_MAX) return "tooLong"
  return null
}

export const ideaFormSchema = z.object({
  idea: z.string().trim().min(IDEA_MIN).max(IDEA_MAX),
  language: z.enum(["uk", "en"]),
  enabledOptional: z.array(z.enum(OPTIONAL_STAGES)),
  autoApprove: z.boolean(),
})

export type IdeaForm = z.infer<typeof ideaFormSchema>
