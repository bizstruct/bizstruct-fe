"use server"

export interface SubmitProjectIdeaResult {
  success: boolean
  message: string
}

const NETWORK_DELAY_MS = 500

export async function submitProjectIdea(
  formData: FormData,
): Promise<SubmitProjectIdeaResult> {
  const idea = formData.get("idea")

  if (typeof idea !== "string" || idea.trim().length === 0) {
    return {
      success: false,
      message: "Idea text is required.",
    }
  }

  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS))

  return {
    success: true,
    message: "Project idea was submitted successfully.",
  }
}
