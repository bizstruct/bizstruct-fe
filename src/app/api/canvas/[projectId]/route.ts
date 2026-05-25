import { NextResponse } from "next/server"
import { mockDefaultCanvas } from "@/mocks/data/canvas"

export async function GET() {
  return NextResponse.json(mockDefaultCanvas)
}
