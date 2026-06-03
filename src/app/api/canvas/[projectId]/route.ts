import { type NextRequest, NextResponse } from "next/server"
import { mockDefaultCanvas } from "@/mocks/data/canvas"

const BASE = process.env.API_BASE_URL

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const locale = request.nextUrl.searchParams.get("locale") ?? "en"

  if (!BASE) return NextResponse.json(mockDefaultCanvas)

  try {
    const res = await fetch(`${BASE}/api/canvas/${projectId}?locale=${locale}`, {
      cache: "no-store",
    })
    if (!res.ok) return NextResponse.json(mockDefaultCanvas, { status: res.status })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(mockDefaultCanvas)
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const locale = request.nextUrl.searchParams.get("locale") ?? "en"
  const body = await request.json()

  if (!BASE) return new NextResponse(null, { status: 200 })

  const res = await fetch(`${BASE}/api/canvas/${projectId}?locale=${locale}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return new NextResponse(null, { status: 200 })
  }
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
