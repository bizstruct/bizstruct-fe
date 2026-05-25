import { NextResponse } from "next/server"
import { mockHypotheses } from "@/mocks/data/hypotheses"

export async function GET() {
  return NextResponse.json(mockHypotheses)
}
