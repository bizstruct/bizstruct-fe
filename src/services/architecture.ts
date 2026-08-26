import { API_ROUTES } from "@/constants/api"
import type { Architecture } from "@/schemas/architecture.schema"
import { apiGet, apiPatch, apiPut } from "./api-client"

// Architecture is flat and bilingual-inline (epicenter_rationale_uk/_en,
// pattern_rationale_uk/_en both present at once) — unlike the other blocks,
// there's no {uk: {...}, en: {...}} wrapper and no `locale` query param.
// The backend validates every write against bizstruct_domain's Architecture
// model, so this layer no longer normalizes/fuzzy-matches values the way it
// used to when the old schema was locale-nested and inconsistently cased.

export async function getArchitecture(projectId: string): Promise<Architecture | null> {
  const raw = await apiGet<{ architecture: Architecture | null }>(API_ROUTES.architecture(projectId))
  return raw?.architecture ?? null
}

export async function putArchitecture(projectId: string, payload: Architecture): Promise<Architecture> {
  const raw = await apiPut<{ architecture: Architecture }>(API_ROUTES.architecture(projectId), payload)
  return raw.architecture
}

export async function patchArchitectureEpicenter(
  projectId: string,
  payload: Partial<Pick<Architecture, "epicenter" | "epicenter_rationale_uk" | "epicenter_rationale_en">>,
): Promise<Architecture> {
  const raw = await apiPatch<{ architecture: Architecture }>(
    `${API_ROUTES.architecture(projectId)}/epicenter`,
    payload,
  )
  return raw.architecture
}

export async function patchArchitecturePattern(
  projectId: string,
  payload: Partial<
    Pick<Architecture, "pattern" | "pattern_subtype" | "pattern_rationale_uk" | "pattern_rationale_en">
  >,
): Promise<Architecture> {
  const raw = await apiPatch<{ architecture: Architecture }>(
    `${API_ROUTES.architecture(projectId)}/pattern`,
    payload,
  )
  return raw.architecture
}
