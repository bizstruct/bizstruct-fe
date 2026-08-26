import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ projectId: string; pitchType: string; slideType: string }> },
) {
  const { projectId, pitchType, slideType } = await context.params
  const body = await request.json()
  const result = await backendFetch(`/api/pitch/${projectId}/${pitchType}/${slideType}`, { method: "PATCH", body })
  return toHttpResponse(result)
}
