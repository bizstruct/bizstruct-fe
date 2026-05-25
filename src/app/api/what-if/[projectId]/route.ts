import { NextResponse } from "next/server"
import { mockWhatIfVectors } from "@/mocks/data/what-if"

export async function GET() {
  return NextResponse.json(mockWhatIfVectors)
}
