import { API_ROUTES } from "@/constants/api"
import { EmpathyDataSchema } from "@/schemas/empathy-map.schema"
import type { EmpathyData } from "@/schemas/empathy-map.schema"
import { apiGet } from "./api-client"

export async function getEmpathyMap(projectId: string, locale: string): Promise<EmpathyData> {
  const url = `${API_ROUTES.empathyMap(projectId)}?locale=${locale}`
  const data = await apiGet<unknown>(url)
  return EmpathyDataSchema.parse(data)
}
