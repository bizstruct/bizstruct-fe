import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const body = await request.json()
  const result = await backendFetch(`/api/canvas/${projectId}/validate`, { method: "POST", body })
  return toHttpResponse(result)
}
