import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string; section: string }> },
) {
  const { projectId, section } = await context.params
  const body = await request.json()
  const result = await backendFetch(`/api/canvas/${projectId}/${section}`, { method: "POST", body })
  return toHttpResponse(result)
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ projectId: string; section: string }> },
) {
  const { projectId, section } = await context.params
  const body = await request.json()
  const result = await backendFetch(`/api/canvas/${projectId}/${section}`, { method: "PUT", body })
  return toHttpResponse(result)
}
