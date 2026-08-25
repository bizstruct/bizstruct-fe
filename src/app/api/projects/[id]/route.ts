import { NextResponse } from "next/server"
import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const result = await backendFetch(`/api/projects/${id}`, { cache: "no-store" })
  return toHttpResponse(result)
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const body = await request.json()
  const result = await backendFetch(`/api/projects/${id}`, { method: "PATCH", body })
  return toHttpResponse(result)
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const result = await backendFetch(`/api/projects/${id}`, { method: "DELETE" })
  if (!result.ok && result.kind !== "not_found") {
    return toHttpResponse(result)
  }
  return NextResponse.json({ ok: true })
}
