// Server-only HTTP client for calls to bizstruct-be. Used by every /api/*
// route handler and by src/services/generation.ts (the project-generation
// flow — see docs/adr/0001-frontend-backend-transport.md for why that flow
// is on route handlers too, not Server Actions).
//
// Not for use from client components: it reads process.env.API_BASE_URL, a
// server-only variable (deliberately not NEXT_PUBLIC_-prefixed — the
// browser has no business knowing where the backend lives). Only import
// this from route handlers and other server-side modules, matching every
// existing /api/* route's process.env.API_BASE_URL usage.
import { type ApiResult, apiErr, apiOk } from "./api-result"

const DEFAULT_TIMEOUT_MS = 10_000

function timeoutMs(): number {
  const raw = process.env.BACKEND_FETCH_TIMEOUT_MS
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS
}

// No fallback to localhost or anywhere else. Checked on every call rather
// than at module import time (a top-level throw would fail the build's
// module-tracing step, not just a genuinely misconfigured deployment) —
// but it still fails on the very first real request, with a message that
// says exactly what's missing, instead of quietly proxying to
// http://localhost:8000 in production.
function requireBackendBase(): string {
  const base = process.env.API_BASE_URL
  if (!base) {
    throw new Error(
      "API_BASE_URL is not set. The backend base URL must be configured explicitly " +
      "— there is no localhost fallback. Set API_BASE_URL in the environment.",
    )
  }
  return base
}

export interface BackendFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown
}

async function parseErrorDetails(res: Response): Promise<unknown> {
  try {
    const contentType = res.headers.get("content-type") ?? ""
    if (contentType.includes("application/json")) return await res.json()
    return await res.text()
  } catch {
    return undefined
  }
}

function kindForStatus(status: number): "not_found" | "validation" | "server" {
  if (status === 404) return "not_found"
  if (status === 422) return "validation"
  return "server"
}

// Returns ApiResult<T> — never throws for a request that reached the
// backend and got a response, however bad. Only truly exceptional cases
// (missing config, network failure, timeout) short-circuit before that.
export async function backendFetch<T>(path: string, options: BackendFetchOptions = {}): Promise<ApiResult<T>> {
  let base: string
  try {
    base = requireBackendBase()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[backend-client] config error:", message)
    return apiErr({ kind: "config", message })
  }

  const { body, headers, ...rest } = options
  const url = `${base}${path}`

  let res: Response
  try {
    res = await fetch(url, {
      ...rest,
      headers: { "Content-Type": "application/json", ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeoutMs()),
    })
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error(`[backend-client] timeout after ${timeoutMs()}ms: ${options.method ?? "GET"} ${url}`)
      return apiErr({ kind: "timeout", message: `Request to ${path} timed out` })
    }
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[backend-client] network error: ${options.method ?? "GET"} ${url} —`, message)
    return apiErr({ kind: "network", message })
  }

  if (!res.ok) {
    const details = await parseErrorDetails(res)
    const kind = kindForStatus(res.status)
    console.error(`[backend-client] ${res.status} ${options.method ?? "GET"} ${url}`, details ?? res.statusText)
    return apiErr({ kind, status: res.status, message: `Backend returned ${res.status} for ${path}`, details })
  }

  // 204 No Content or empty body — treat as success with no payload.
  const contentType = res.headers.get("content-type") ?? ""
  if (res.status === 204 || !contentType.includes("application/json")) {
    return apiOk(undefined as T)
  }

  try {
    return apiOk((await res.json()) as T)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[backend-client] invalid JSON from ${url}:`, message)
    return apiErr({ kind: "server", message: `Backend returned invalid JSON for ${path}` })
  }
}
