import { type NextRequest, NextResponse } from "next/server"

const BASE = process.env.API_BASE_URL

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ projectId: string; section: string; itemId: string }> },
) {
  const { projectId, section, itemId } = await context.params
  const body = await request.json()
  const res = await fetch(`${BASE}/api/canvas/${projectId}/${section}/${itemId}/move`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return new NextResponse(null, { status: 200 })
  }
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
