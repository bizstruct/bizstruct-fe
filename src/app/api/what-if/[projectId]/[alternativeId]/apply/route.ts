import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function POST(
  _request: Request,
  context: { params: Promise<{ projectId: string; alternativeId: string }> },
) {
  const { projectId, alternativeId } = await context.params
  const result = await backendFetch(`/api/what-if/${projectId}/${alternativeId}/apply`, { method: "POST" })
  return toHttpResponse(result)
}
