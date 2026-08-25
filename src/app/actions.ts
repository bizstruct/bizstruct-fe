"use server"

import type { BusinessModelOption } from "@/types/domain/models-options"

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8000"

// The canonical shape here is bizstruct_domain.blocks.models_options.ModelsOptions
// (synced via `npm run sync:domain`, see src/types/domain/models-options.ts).
// `options` is only loosened from ModelsOptions' strict 3-tuple to a plain
// array — client-side state manipulation (edits, regeneration) doesn't need
// the tuple constraint; the backend still enforces exactly 3 on write.
export interface ModelsOptionsPayload {
  options: BusinessModelOption[]
  selected_id: string | null
}

export interface RawProjectResponse {
  id: string
  title: string
  status: string
  modelsOptions: ModelsOptionsPayload | null
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
  rawModelsOptions: ModelsOptionsPayload,
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
  rawModelsOptions: ModelsOptionsPayload,
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
