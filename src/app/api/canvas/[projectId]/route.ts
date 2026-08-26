import { type NextRequest, NextResponse } from "next/server"
import { mockDefaultCanvas } from "@/mocks/data/canvas"
import { SECTION_KEY_TO_API } from "@/services/canvas"
import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

// Mocks are opt-in only, via NEXT_PUBLIC_USE_MOCKS=true — never a silent
// fallback for a missing/unreachable backend. A backend error must surface
// as an error to the caller (see services/canvas.ts / CanvasView.tsx),
// not get silently swapped out for plausible-looking fake data.
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true"

// mockDefaultCanvas is in the UI's camelCase shape (see schemas/canvas.
// schema.ts); the real backend returns snake_case sections and
// is_ai_generated. Convert here so the mock response matches the actual
// wire shape services/canvas.ts's normalizeCanvas() expects, instead of
// depending on normalizeCard() tolerating both casings (which is exactly
// the field-drift-by-tolerance pattern this task series has been removing
// elsewhere — see the models_options task).
function mockCanvasWire(): Record<string, unknown> {
  const wire: Record<string, unknown> = {}
  for (const [uiKey, cards] of Object.entries(mockDefaultCanvas)) {
    const wireKey = SECTION_KEY_TO_API[uiKey as keyof typeof SECTION_KEY_TO_API]
    wire[wireKey] = cards.map((c) => ({ id: c.id, text: c.text, is_ai_generated: c.isAiGenerated }))
  }
  return wire
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  if (USE_MOCKS) return NextResponse.json({ canvas: mockCanvasWire() })

  const { projectId } = await context.params
  const locale = request.nextUrl.searchParams.get("locale") ?? "en"
  const result = await backendFetch(`/api/canvas/${projectId}?locale=${locale}`, { cache: "no-store" })
  return toHttpResponse(result)
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const locale = request.nextUrl.searchParams.get("locale") ?? "en"
  const body = await request.json()
  const result = await backendFetch(`/api/canvas/${projectId}?locale=${locale}`, { method: "PUT", body })
  return toHttpResponse(result)
}
