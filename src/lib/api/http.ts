// Browser-side client of the BFF (/api/*). Every outcome is an explicit ApiResult, never a bare
// null or a thrown Error (ADR 0001). No token is ever handled here: the cookies are httpOnly.

export type ApiError =
  | { kind: "unauthorized"; status: 401; detail: string }
  | { kind: "not_found"; status: 404; detail: string }
  | { kind: "conflict"; status: 409; detail: string }
  | { kind: "validation"; status: 422; detail: string }
  | { kind: "server"; status: number; detail: string }
  | { kind: "network"; status: 0; detail: string }

export type ApiResult<T> = { ok: true; data: T } | ({ ok: false } & ApiError)

type Fetch = typeof fetch

let onUnauthorized: (() => void) | null = null

/** The app shell registers where a lost session goes (the login page). */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler
}

/** be's {detail: string} or FastAPI's validation list, flattened to one readable line. */
export function detailOf(body: unknown, fallback: string): string {
  const detail = (body as { detail?: unknown } | null)?.detail
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) {
    return detail.map((d) => `${(d as { loc?: unknown[] }).loc?.slice(1).join(".") ?? ""}: ${(d as { msg?: string }).msg ?? ""}`).join("; ")
  }
  return fallback
}

export async function request<T>(
  path: string,
  init: { method?: string; json?: unknown; signal?: AbortSignal } = {},
  fetchImpl: Fetch = fetch,
): Promise<ApiResult<T>> {
  let response: Response
  try {
    response = await fetchImpl(path, {
      method: init.method ?? "GET",
      headers: init.json !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: init.json !== undefined ? JSON.stringify(init.json) : undefined,
      credentials: "same-origin",
      cache: "no-store",
      signal: init.signal,
    })
  } catch (error) {
    return { ok: false, kind: "network", status: 0, detail: error instanceof Error ? error.message : "Network error" }
  }

  if (response.status === 204) return { ok: true, data: undefined as T }
  const body: unknown = await response.json().catch(() => null)
  if (response.ok) return { ok: true, data: body as T }

  const detail = detailOf(body, response.statusText || "Request failed")
  if (response.status === 401) {
    onUnauthorized?.()
    return { ok: false, kind: "unauthorized", status: 401, detail }
  }
  if (response.status === 404) return { ok: false, kind: "not_found", status: 404, detail }
  if (response.status === 409) return { ok: false, kind: "conflict", status: 409, detail }
  if (response.status === 422) return { ok: false, kind: "validation", status: 422, detail }
  return { ok: false, kind: "server", status: response.status, detail }
}
