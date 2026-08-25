import { API_ROUTES } from "@/constants/api"
import type { EmpathyMap } from "@/schemas/empathy-map.schema"
import { apiGet, apiPut } from "./api-client"

// EmpathyMap stores both languages inline per item (text_uk/text_en on each
// EmpathyItem) — like architecture, unlike the other blocks, there's no
// {uk: {...}, en: {...}} wrapper and no `locale` query param. The backend
// validates every write against bizstruct_domain's EmpathyMap model, so this
// layer no longer normalizes/defensively re-parses responses the way it used
// to when the old schema was locale-nested.

export async function getEmpathyMap(projectId: string): Promise<EmpathyMap | null> {
  const raw = await apiGet<{ empathyMap: EmpathyMap | null }>(API_ROUTES.empathyMap(projectId))
  return raw?.empathyMap ?? null
}

export async function saveEmpathyMap(projectId: string, data: EmpathyMap): Promise<EmpathyMap> {
  const raw = await apiPut<{ empathyMap: EmpathyMap }>(API_ROUTES.empathyMap(projectId), data)
  return raw.empathyMap
}
