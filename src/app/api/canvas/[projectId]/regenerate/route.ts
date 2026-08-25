import { type NextRequest } from "next/server"
import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params
  const locale = request.nextUrl.searchParams.get("locale") ?? "en"
  const result = await backendFetch(`/api/canvas/${projectId}/regenerate?locale=${locale}`, { method: "POST" })
  return toHttpResponse(result)
}
