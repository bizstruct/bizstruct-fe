import { NextResponse } from "next/server"
import type { ApiResult } from "./api-result"

const STATUS_BY_KIND: Record<string, number> = {
  not_found: 404,
  validation: 422,
  server: 502, // the backend responded, just badly — not this app's own 500
  network: 502,
  timeout: 504,
  config: 500, // this app is misconfigured, not the backend
}

// Turns a backendFetch() result into the HTTP response a route handler
// returns to the browser — the browser-side apiRequest() (services/
// api-client.ts) then reconstructs an ApiResult from THAT response's status
// and body. The error body is the backend's own (e.g. FastAPI's
// {"detail": [...]} for a 422) when there is one, not a re-wrapped
// envelope — so a 422's violation list reaches the browser exactly once,
// not nested inside a second details object.
export function toHttpResponse<T>(result: ApiResult<T>): NextResponse {
  if (result.ok) {
    if (result.data === undefined) {
      return new NextResponse(null, { status: 200 })
    }
    return NextResponse.json(result.data)
  }
  const status = result.status ?? STATUS_BY_KIND[result.kind] ?? 502
  const body = result.details ?? { message: result.message }
  return NextResponse.json(body, { status })
}
