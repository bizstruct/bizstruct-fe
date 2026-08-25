import { NextResponse } from "next/server"
import { mockActiveProjects } from "@/mocks/data/projects"

const BASE = process.env.API_BASE_URL
// Mocks are opt-in only, via NEXT_PUBLIC_USE_MOCKS=true — never a silent
// fallback for a missing/unreachable backend.
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true"

export async function GET() {
  if (USE_MOCKS) return NextResponse.json(mockActiveProjects)

  const res = await fetch(`${BASE}/api/projects`, { cache: "no-store" })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
