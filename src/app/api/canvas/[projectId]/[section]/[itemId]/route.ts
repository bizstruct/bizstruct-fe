import { NextResponse } from "next/server"
import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ projectId: string; section: string; itemId: string }> },
) {
  const { projectId, section, itemId } = await context.params
  const body = await request.json()
  const result = await backendFetch(`/api/canvas/${projectId}/${section}/${itemId}`, { method: "PATCH", body })
  return toHttpResponse(result)
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ projectId: string; section: string; itemId: string }> },
) {
  const { projectId, section, itemId } = await context.params
  const result = await backendFetch(`/api/canvas/${projectId}/${section}/${itemId}`, { method: "DELETE" })
  if (!result.ok && result.kind !== "not_found") {
    return toHttpResponse(result)
  }
  return new NextResponse(null, { status: 200 })
}
