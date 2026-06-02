import { API_ROUTES } from "@/constants/api"
import { EmpathyDataSchema } from "@/schemas/empathy-map.schema"
import type { EmpathyData } from "@/schemas/empathy-map.schema"
import { apiGet, parseOrLog } from "./api-client"

export async function getEmpathyMap(projectId: string, locale: string): Promise<EmpathyData | null> {
  const url = `${API_ROUTES.empathyMap(projectId)}?locale=${locale}`
  const raw = await apiGet<{ empathyMap: unknown }>(url)
  if (raw.empathyMap == null) return null
  return parseOrLog(EmpathyDataSchema, raw.empathyMap, "empathy-map")
}
