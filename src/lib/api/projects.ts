import type { GenerationRequest, ProjectDetail, ProjectSummary, StageRowResponse } from "@/types/api"
import { request, type ApiResult } from "./http"

/**
 * Fields be returns on every swot_errc_cycle row (be task feat/final-version-in-project). They are
 * not in the committed OpenAPI snapshot yet; remove this augmentation when `pnpm sync:api` brings
 * them in. The viewer only READS them: it never derives the final version.
 */
export interface CycleFinal {
  finalVersion?: number
  finalCanvasId?: string
  finalSwotId?: string
}

export type Row = StageRowResponse & CycleFinal
export type Project = Omit<ProjectDetail, "rows"> & { rows: Row[] }

const BASE = "/api/be/projects"

export const listProjects = (signal?: AbortSignal): Promise<ApiResult<ProjectSummary[]>> =>
  request<ProjectSummary[]>(BASE, { signal })

export const getProject = (id: string, signal?: AbortSignal): Promise<ApiResult<Project>> =>
  request<Project>(`${BASE}/${id}`, { signal })

export const createProject = (body: GenerationRequest): Promise<ApiResult<Project>> =>
  request<Project>("/api/be/generation", { method: "POST", json: body })

export const deleteProject = (id: string): Promise<ApiResult<void>> => request<void>(`${BASE}/${id}`, { method: "DELETE" })

export const approveRow = (projectId: string, rowId: string): Promise<ApiResult<Project>> =>
  request<Project>(`${BASE}/${projectId}/rows/${rowId}/approve`, { method: "POST" })

export const regenerateRow = (projectId: string, rowId: string): Promise<ApiResult<Project>> =>
  request<Project>(`${BASE}/${projectId}/rows/${rowId}/regenerate`, { method: "POST" })
