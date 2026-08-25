import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const result = await backendFetch(`/api/generation/${projectId}/regenerate`, { method: "POST" })
  return toHttpResponse(result)
}
