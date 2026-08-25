import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function GET(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const result = await backendFetch(`/api/hypotheses/${projectId}`, { cache: "no-store" })
  return toHttpResponse(result)
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const body = await request.json()
  const result = await backendFetch(`/api/hypotheses/${projectId}`, { method: "PATCH", body })
  return toHttpResponse(result)
}
