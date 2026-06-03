import { type NextRequest, NextResponse } from "next/server"

const BASE = process.env.API_BASE_URL

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const locale = request.nextUrl.searchParams.get("locale") ?? "en"
  const res = await fetch(`${BASE}/api/canvas/${projectId}/regenerate?locale=${locale}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return new NextResponse(null, { status: 200 })
  }
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
