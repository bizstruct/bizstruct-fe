// The one server-side client for bizstruct-be (ADR 0001). No localhost fallback: a missing
// API_BASE_URL fails the request that needs it, with an explicit message.

export class BackendConfigError extends Error {}

export interface BackendResponse {
  status: number
  body: string
  contentType: string
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

export function apiBaseUrl(env: Record<string, string | undefined> = process.env): string {
  const url = env.API_BASE_URL
  if (!url) throw new BackendConfigError("API_BASE_URL is not set")
  return url.replace(/\/+$/, "")
}

export interface BackendRequest {
  method: string
  path: string // starts with /api
  token?: string
  json?: unknown
  form?: Record<string, string>
  timeoutMs?: number
}

export async function backendFetch(
  request: BackendRequest,
  fetchImpl: FetchLike = fetch,
  baseUrl: string = apiBaseUrl(),
): Promise<BackendResponse> {
  const headers: Record<string, string> = {}
  let body: string | undefined
  if (request.token) headers.Authorization = `Bearer ${request.token}`
  if (request.json !== undefined) {
    headers["Content-Type"] = "application/json"
    body = JSON.stringify(request.json)
  } else if (request.form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded"
    body = new URLSearchParams(request.form).toString()
  }
  const response = await fetchImpl(`${baseUrl}${request.path}`, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(request.timeoutMs ?? 15_000),
  })
  return { status: response.status, body: await response.text(), contentType: response.headers.get("content-type") ?? "application/json" }
}
