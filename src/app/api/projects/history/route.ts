import { NextResponse } from "next/server"
import { mockProjectHistory } from "@/mocks/data/projects"

export async function GET() {
  return NextResponse.json(mockProjectHistory)
}
