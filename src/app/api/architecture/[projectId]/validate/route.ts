import { type NextRequest, NextResponse } from "next/server"

const BASE = process.env.API_BASE_URL

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const locale = request.nextUrl.searchParams.get("locale") ?? "en"
  const body = await request.json()
  const res = await fetch(`${BASE}/api/architecture/${projectId}/validate?locale=${locale}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return new NextResponse(null, { status: 200 })
  }
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
