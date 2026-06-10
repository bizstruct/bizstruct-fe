import { NextResponse } from "next/server"
import { mockHypotheses } from "@/mocks/data/hypotheses"
import type { Hypothesis } from "@/schemas/hypotheses.schema"

let stored: Hypothesis[] = [...mockHypotheses]

export async function GET() {
  return NextResponse.json({ hypotheses: stored })
}

export async function PATCH(request: Request) {
  const body = await request.json() as { hypotheses: Hypothesis[] }
  if (Array.isArray(body.hypotheses)) stored = body.hypotheses
  return NextResponse.json({ hypotheses: stored })
}
