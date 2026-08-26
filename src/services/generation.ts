// Replaces src/app/actions.ts (deleted — see
// docs/adr/0001-frontend-backend-transport.md). Project creation and the
// models_options flow now go through this app's own /api/* proxy routes
// like every other block, via the same apiRequest() client, instead of a
// Server Action calling bizstruct-be directly with its own ad hoc fetch
// and no error handling.
import { API_ROUTES } from "@/constants/api"
import { apiRequest } from "./api-client"
import type { ApiResult } from "@/lib/api-result"
import type { BusinessModelOption, ModelsOptions } from "@/types/domain/models-options"

// `options` loosened from ModelsOptions' strict 3-tuple to a plain array —
// client-side state manipulation (edits, regeneration) doesn't need the
// tuple constraint; the backend still enforces exactly 3 on write. Derived
// from the generated ModelsOptions type via Omit, not hand-duplicated, so a
// domain field rename breaks this at compile time instead of silently
// drifting.
export type ModelsOptionsPayload = Omit<ModelsOptions, "options"> & { options: BusinessModelOption[] }

export interface RawProjectResponse {
  id: string
  title: string
  status: string
  modelsOptions: ModelsOptionsPayload | null
}

export async function createProjectFromIdea(text: string): Promise<ApiResult<RawProjectResponse>> {
  return apiRequest<RawProjectResponse>(API_ROUTES.generation, {
    method: "POST",
    body: JSON.stringify({ idea: text }),
  })
}

export async function fetchProjectById(projectId: string): Promise<ApiResult<RawProjectResponse>> {
  return apiRequest<RawProjectResponse>(API_ROUTES.project(projectId), { cache: "no-store" })
}

export async function selectProjectModel(
  projectId: string,
  rawModelsOptions: ModelsOptionsPayload,
  modelId: string,
): Promise<ApiResult<RawProjectResponse>> {
  return apiRequest<RawProjectResponse>(API_ROUTES.project(projectId), {
    method: "PATCH",
    body: JSON.stringify({ modelsOptions: { ...rawModelsOptions, selected_id: modelId } }),
  })
}

export async function saveModelsEdits(
  projectId: string,
  rawModelsOptions: ModelsOptionsPayload,
): Promise<ApiResult<RawProjectResponse>> {
  return apiRequest<RawProjectResponse>(API_ROUTES.project(projectId), {
    method: "PATCH",
    body: JSON.stringify({ modelsOptions: rawModelsOptions }),
  })
}

export async function triggerRegenerateModels(projectId: string): Promise<ApiResult<void>> {
  return apiRequest<void>(API_ROUTES.regenerateModels(projectId), { method: "POST" })
}

// The fields bizstruct-be's /validate endpoint accepts — deliberately a
// fixed subset of BusinessModelOption's user-facing fields (see
// bizstruct_domain.validate_model), not the whole model. Picked from the
// generated domain type instead of a hand-typed object, so a rename there
// breaks this at compile time instead of silently going stale.
export type ValidateModelFields = Pick<BusinessModelOption, "title" | "audience" | "value_proposition" | "description">

export async function triggerValidateModel(
  projectId: string,
  modelId: string,
  fields: ValidateModelFields,
): Promise<ApiResult<void>> {
  // bizstruct-be's ValidateRequest is a CamelModel with populate_by_name=True
  // — it accepts snake_case field names directly (verified against the
  // running backend), so this is a plain spread, not a field-by-field
  // rename. A new required field on ValidateModelFields would show up here
  // via ...fields automatically; only its presence in the Pick above needs
  // updating if bizstruct-be's accepted fields ever change.
  return apiRequest<void>(API_ROUTES.validateModel(projectId), {
    method: "POST",
    body: JSON.stringify({ model_id: modelId, ...fields }),
  })
}
