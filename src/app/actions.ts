"use server"

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8000"

export interface RawModelOption {
  id: string
  name?: string
  title?: string
  tagline?: string
  target_segment?: string
  audience?: string
  value_proposition?: string
  valueProposition?: string
  description: string
  score?: number
}

export interface RawProjectResponse {
  id: string
  title: string
  status: string
  modelsOptions: { models: RawModelOption[]; selected_id: string | null } | RawModelOption[] | null
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

export async function selectProjectModel(
  projectId: string,
  rawModelsOptions: { models: RawModelOption[]; selected_id: string | null },
  modelId: string,
): Promise<void> {
  await fetch(`${API_BASE}/api/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelsOptions: { ...rawModelsOptions, selected_id: modelId } }),
  })
}

export async function saveModelsEdits(
  projectId: string,
  rawModelsOptions: { models: RawModelOption[]; selected_id: string | null },
): Promise<void> {
  await fetch(`${API_BASE}/api/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelsOptions: rawModelsOptions }),
  })
}

export async function triggerRegenerateModels(projectId: string): Promise<void> {
  await fetch(`${API_BASE}/api/generation/${projectId}/regenerate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
}

export async function triggerValidateModel(
  projectId: string,
  model: { modelId: string; title: string; audience: string; valueProposition: string; description: string },
): Promise<void> {
  await fetch(`${API_BASE}/api/models/${projectId}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      modelId: model.modelId,
      title: model.title,
      audience: model.audience,
      valueProposition: model.valueProposition,
      description: model.description,
    }),
  })
}
