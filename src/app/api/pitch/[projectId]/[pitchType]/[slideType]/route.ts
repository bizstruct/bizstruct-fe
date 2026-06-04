import { type NextRequest, NextResponse } from "next/server"

const BASE = process.env.API_BASE_URL

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ projectId: string; pitchType: string; slideType: string }> },
) {
  const { projectId, pitchType, slideType } = await context.params
  const locale = request.nextUrl.searchParams.get("locale") ?? "en"
  const body   = await request.json()

  if (!BASE) {
    return NextResponse.json({ ok: true })
  }

  const res = await fetch(
    `${BASE}/api/pitch/${projectId}/${pitchType}/${slideType}?locale=${locale}`,
    {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    },
  )

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to save" }, { status: res.status })
  }

  return NextResponse.json({ ok: true })
}
