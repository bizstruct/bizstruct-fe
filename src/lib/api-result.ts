// Shared result type for every backend call, both the browser-side client
// (services/api-client.ts, calling this app's own /api/* proxy routes) and
// the server-side client (lib/backend-client.ts, calling bizstruct-be
// directly from route handlers). One type so a component/store handling a
// mutation's result doesn't care which transport produced it.
//
// `kind` is what lets a caller show a different message for "this project
// doesn't exist" vs "the backend is down" vs "the backend rejected this
// payload" — collapsing all of these into `null`/a generic Error (the old
// behavior) is exactly what made every failure look identical, including
// indistinguishable from success in call sites that didn't check at all.
export type ApiErrorKind = "not_found" | "validation" | "server" | "network" | "timeout" | "config"

export interface ApiError {
  kind: ApiErrorKind
  status?: number
  message: string
  // For kind: "validation" (422), the backend's own violation list —
  // FastAPI's `detail` array (field path + message per violation). Passed
  // through as-is so a caller can render specifics instead of "invalid
  // input".
  details?: unknown
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | ({ ok: false } & ApiError)

export function apiOk<T>(data: T): ApiResult<T> {
  return { ok: true, data }
}

export function apiErr<T = never>(error: ApiError): ApiResult<T> {
  return { ok: false, ...error }
}
