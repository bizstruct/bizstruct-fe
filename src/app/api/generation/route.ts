import { backendFetch } from "@/lib/backend-client"
import { toHttpResponse } from "@/lib/route-response"

export async function POST(request: Request) {
  const body = await request.json()
  const result = await backendFetch("/api/generation", { method: "POST", body })
  return toHttpResponse(result)
}
