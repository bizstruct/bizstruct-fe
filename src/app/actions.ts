"use server"

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8000"

export interface RawProjectResponse {
  id: string
  title: string
  status: string
  modelsOptions: RawModelOption[] | null
}

export interface RawModelOption {
  id: string
  title: string
  audience: string
  value_proposition?: string
  valueProposition?: string
  description: string
}

export async function createProjectFromIdea(text: string): Promise<RawProjectResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/api/generation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: text }),
    })
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export async function fetchProjectById(projectId: string): Promise<RawProjectResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/api/projects/${projectId}`, {
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}
