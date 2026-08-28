import { type NextRequest, NextResponse } from "next/server"
import { mockWhatIfData } from "@/mocks/data/what-if"
import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

// Mocks are opt-in only, via NEXT_PUBLIC_USE_MOCKS=true — never a silent
// fallback for a missing/unreachable backend (see canvas's own route for
// the same convention and why).
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  if (USE_MOCKS) return NextResponse.json(mockWhatIfData)

  const { projectId } = await context.params
  const result = await backendFetch(`/api/what-if/${projectId}`, { cache: "no-store" })
  return toHttpResponse(result)
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const body = await request.json()
  const result = await backendFetch(`/api/what-if/${projectId}`, { method: "PUT", body })
  return toHttpResponse(result)
}
