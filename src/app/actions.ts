"use server"

import type { GeneratedBusinessModel } from "@/schemas/project.schema"

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8000"

export interface CreateProjectFromIdeaSuccessResult {
  success: true
  data: {
    id: string
    title: string
    idea: string
    models: GeneratedBusinessModel[]
  }
}

export interface CreateProjectFromIdeaFailureResult {
  success: false
  error: string
}

export type CreateProjectFromIdeaResult =
  | CreateProjectFromIdeaSuccessResult
  | CreateProjectFromIdeaFailureResult

export async function createProjectFromIdea(
  text: string,
): Promise<CreateProjectFromIdeaResult> {
  try {
    const response = await fetch(`${API_BASE}/api/generation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: text }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return {
        success: false,
        error: (err as { error?: string }).error ?? `Помилка сервера: ${response.status}`,
      }
    }

    return response.json() as Promise<CreateProjectFromIdeaSuccessResult>
  } catch {
    return { success: false, error: "Не вдалося з'єднатися з сервером" }
  }
}
