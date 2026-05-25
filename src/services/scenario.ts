import { API_ROUTES } from "@/constants/api"
import { ScenarioDataSchema } from "@/schemas/scenario.schema"
import type { ScenarioData } from "@/schemas/scenario.schema"
import { apiGet } from "./api-client"

export async function getScenario(projectId: string, locale: string): Promise<ScenarioData> {
  const url = `${API_ROUTES.scenario(projectId)}?locale=${locale}`
  const data = await apiGet<unknown>(url)
  return ScenarioDataSchema.parse(data)
}
