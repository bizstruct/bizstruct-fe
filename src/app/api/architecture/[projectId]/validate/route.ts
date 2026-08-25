import { type NextRequest } from "next/server"
import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const locale = request.nextUrl.searchParams.get("locale") ?? "en"
  const body = await request.json()
  const result = await backendFetch(`/api/architecture/${projectId}/validate?locale=${locale}`, { method: "POST", body })
  return toHttpResponse(result)
}
