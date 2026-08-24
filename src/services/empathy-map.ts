import { API_ROUTES } from "@/constants/api"
import { EmpathyDataSchema } from "@/schemas/empathy-map.schema"
import type { EmpathyData } from "@/schemas/empathy-map.schema"
import { apiGet, apiPut, parseOrLog } from "./api-client"

export async function saveEmpathyMap(projectId: string, data: EmpathyData): Promise<void> {
  await apiPut(API_ROUTES.empathyMap(projectId), data)
}

export async function getEmpathyMap(projectId: string, locale: string): Promise<EmpathyData | null> {
  const url = `${API_ROUTES.empathyMap(projectId)}?locale=${locale}`
  const raw = await apiGet<{ empathyMap: unknown }>(url)
  if (raw?.empathyMap == null) return null
  // unwrap double-wrapping if data was previously saved with { empathyMap: data } body
  const inner = (raw.empathyMap as Record<string, unknown>)?.empathyMap ?? raw.empathyMap
  return parseOrLog(EmpathyDataSchema, inner, "empathy-map")
}
