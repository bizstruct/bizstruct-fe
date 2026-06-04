import { type NextRequest, NextResponse } from "next/server"

const BASE = process.env.API_BASE_URL

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const locale = request.nextUrl.searchParams.get("locale") ?? "en"

  if (!BASE) {
    return NextResponse.json({ ok: true })
  }

  const res = await fetch(`${BASE}/api/pitch/${projectId}/validate?locale=${locale}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({}),
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Validation failed" }, { status: res.status })
  }

  return NextResponse.json({ ok: true })
}
