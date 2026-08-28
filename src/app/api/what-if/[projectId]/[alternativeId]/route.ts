import { type NextRequest } from "next/server"
import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ projectId: string; alternativeId: string }> },
) {
  const { projectId, alternativeId } = await context.params
  const body = await request.json()
  const result = await backendFetch(`/api/what-if/${projectId}/${alternativeId}`, { method: "PATCH", body })
  return toHttpResponse(result)
}
