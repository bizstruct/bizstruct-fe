import { NextResponse } from "next/server"
import { mockActiveProjects } from "@/mocks/data/projects"
import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

// Mocks are opt-in only, via NEXT_PUBLIC_USE_MOCKS=true — never a silent
// fallback for a missing/unreachable backend.
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true"

export async function GET() {
  if (USE_MOCKS) return NextResponse.json(mockActiveProjects)

  const result = await backendFetch("/api/projects", { cache: "no-store" })
  return toHttpResponse(result)
}
