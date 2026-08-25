import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function GET(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const result = await backendFetch(`/api/scenario/${projectId}`, { cache: "no-store" })
  return toHttpResponse(result)
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const body = await request.json()
  const result = await backendFetch(`/api/scenario/${projectId}`, { method: "PUT", body })
  return toHttpResponse(result)
}
