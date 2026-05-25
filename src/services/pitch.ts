import { API_ROUTES } from "@/constants/api"
import { PitchDataSchema } from "@/schemas/pitch.schema"
import type { PitchData } from "@/schemas/pitch.schema"
import { apiGet } from "./api-client"

export async function getPitch(projectId: string, locale: string): Promise<PitchData> {
  const url = `${API_ROUTES.pitch(projectId)}?locale=${locale}`
  const data = await apiGet<unknown>(url)
  return PitchDataSchema.parse(data)
}
