import { type ApiResult, apiErr, apiOk } from "@/lib/api-result"

const DEFAULT_TIMEOUT_MS = 10_000

function timeoutMs(): number {
  const raw = process.env.NEXT_PUBLIC_API_TIMEOUT_MS
  const parsed = raw ? Number(raw) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS
}

function kindForStatus(status: number): "not_found" | "validation" | "server" {
  if (status === 404) return "not_found"
  if (status === 422) return "validation"
  return "server"
}

async function parseErrorDetails(response: Response): Promise<unknown> {
  try {
    const contentType = response.headers.get("content-type") ?? ""
    if (contentType.includes("application/json")) return await response.json()
    return await response.text()
  } catch {
    return undefined
  }
}

// The one browser-side HTTP client: every call this app makes to its own
// /api/* proxy routes goes through this. Returns a typed result instead of
// throwing or collapsing every failure into null — a caller can tell "this
// project doesn't exist" (not_found) apart from "the backend is down"
// (server/network) apart from "the backend rejected this payload"
// (validation, with the violation details attached).
export async function apiRequest<T>(url: string, options?: RequestInit): Promise<ApiResult<T>> {
  let response: Response
  try {
    response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
      signal: AbortSignal.timeout(timeoutMs()),
    })
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      console.error(`[api-client] timeout after ${timeoutMs()}ms: ${options?.method ?? "GET"} ${url}`)
      return apiErr({ kind: "timeout", message: `Request to ${url} timed out` })
    }
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[api-client] network error: ${options?.method ?? "GET"} ${url} —`, message)
    return apiErr({ kind: "network", message })
  }

  if (!response.ok) {
    const details = await parseErrorDetails(response)
    const kind = kindForStatus(response.status)
    console.error(`[api-client] ${response.status} ${options?.method ?? "GET"} ${url}`, details ?? response.statusText)
    return apiErr({ kind, status: response.status, message: `Request to ${url} failed with ${response.status}`, details })
  }

  const contentType = response.headers.get("content-type") ?? ""
  if (response.status === 204 || !contentType.includes("application/json")) {
    return apiOk(undefined as T)
  }

  try {
    return apiOk((await response.json()) as T)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[api-client] invalid JSON from ${url}:`, message)
    return apiErr({ kind: "server", message: `Invalid JSON from ${url}` })
  }
}

export function parseOrLog<T>(schema: { parse: (v: unknown) => T }, data: unknown, label: string): T {
  try {
    return schema.parse(data)
  } catch (err) {
    console.error(`[${label}] Zod parse failed. Raw data:`, JSON.stringify(data, null, 2))
    console.error(`[${label}] Error:`, err)
    throw err
  }
}

// --- Legacy contract, kept for the services that predate ApiResult (every
// block except models_options/project-generation — architecture, empathy
// map, scenario, pitch, hypotheses, canvas, what-if, projects list). They
// still get apiRequest's timeout and consistent error classification
// underneath; only the shape exposed to their many existing callers is
// unchanged (404 -> null, everything else non-ok -> throw). New code should
// call apiRequest directly and handle ApiResult — see services/generation.ts.
async function legacyUnwrap<T>(result: Promise<ApiResult<T>>): Promise<T> {
  const r = await result
  if (r.ok) return r.data
  if (r.kind === "not_found") return null as T
  throw new Error(r.message)
}

async function legacyFetch<T>(url: string, options?: RequestInit): Promise<T> {
  return legacyUnwrap<T>(apiRequest<T>(url, options))
}

export const apiGet    = <T>(url: string)              => legacyFetch<T>(url)
export const apiPost   = <T>(url: string, body: unknown) => legacyFetch<T>(url, { method: "POST",   body: JSON.stringify(body) })
export const apiPut    = <T>(url: string, body: unknown) => legacyFetch<T>(url, { method: "PUT",    body: JSON.stringify(body) })
export const apiPatch  = <T>(url: string, body: unknown) => legacyFetch<T>(url, { method: "PATCH",  body: JSON.stringify(body) })
export async function apiDelete(url: string): Promise<void> {
  const result = await apiRequest<void>(url, { method: "DELETE" })
  if (!result.ok && result.kind !== "not_found") {
    throw new Error(result.message)
  }
}
