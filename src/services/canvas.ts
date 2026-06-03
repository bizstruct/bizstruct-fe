import { API_ROUTES } from "@/constants/api"
import { CanvasSectionsSchema } from "@/schemas/canvas.schema"
import type { CanvasSections } from "@/schemas/canvas.schema"
import { apiGet } from "./api-client"

export async function getCanvas(projectId: string): Promise<CanvasSections | null> {
  try {
    const data = await apiGet<unknown>(API_ROUTES.canvas(projectId))
    return CanvasSectionsSchema.parse(data)
  } catch {
    return null
  }
}
