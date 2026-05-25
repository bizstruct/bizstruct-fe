import { API_ROUTES } from "@/constants/api"
import { ArchitectureDataSchema } from "@/schemas/architecture.schema"
import type { ArchitectureData } from "@/schemas/architecture.schema"
import { apiGet } from "./api-client"

export async function getArchitecture(projectId: string, locale: string): Promise<ArchitectureData> {
  const url = `${API_ROUTES.architecture(projectId)}?locale=${locale}`
  const data = await apiGet<unknown>(url)
  return ArchitectureDataSchema.parse(data)
}
