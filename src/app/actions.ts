"use server"

export interface CreateProjectFromIdeaSuccessResult {
  success: true
  data: {
    id: string
    title: string
  }
}

export interface CreateProjectFromIdeaFailureResult {
  success: false
  error: string
}

export type CreateProjectFromIdeaResult =
  | CreateProjectFromIdeaSuccessResult
  | CreateProjectFromIdeaFailureResult

const MIN_IDEA_LENGTH = 10
const FORBIDDEN_WORDS = ["test", "forbidden", "blocked"] as const
const NETWORK_DELAY_MS = 500

function hasForbiddenWord(text: string): boolean {
  const normalizedText = text.toLowerCase()

  return FORBIDDEN_WORDS.some((word) => normalizedText.includes(word))
}

export async function createProjectFromIdea(
  text: string,
): Promise<CreateProjectFromIdeaResult> {
  const normalizedText = text.trim()

  if (
    normalizedText.length < MIN_IDEA_LENGTH ||
    hasForbiddenWord(normalizedText)
  ) {
    return {
      success: false,
      error: "Опишіть ідею детальніше (мінімум 10 символів)",
    }
  }

  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS))

  return {
    success: true,
    data: {
      id: `project-id-${Date.now()}`,
      title: `Проєкт: ${normalizedText.substring(0, 15)}...`,
    },
  }
}
