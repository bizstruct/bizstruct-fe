// What the BFF does with a browser request: forward it to be with the access token from the cookie,
// and on a 401 refresh the tokens ONCE and retry. Pure of Next: it takes a cookie jar and a fetch.

import { backendFetch, type BackendResponse, type FetchLike } from "./backend"
import { clearSession, readSession, setSession, type CookieJar, type Tokens } from "./session"

/** The only be paths the browser may reach through /api/be/*. Everything else is refused (no open proxy). */
const ALLOWED: { method: string; pattern: RegExp }[] = [
  { method: "GET", pattern: /^\/api\/users\/me$/ },
  { method: "POST", pattern: /^\/api\/generation$/ },
  { method: "GET", pattern: /^\/api\/projects$/ },
  { method: "GET", pattern: /^\/api\/projects\/[0-9a-f-]{36}$/i },
  { method: "DELETE", pattern: /^\/api\/projects\/[0-9a-f-]{36}$/i },
  { method: "POST", pattern: /^\/api\/projects\/[0-9a-f-]{36}\/rows\/[0-9a-f-]{36}\/(approve|regenerate)$/i },
]

export function isAllowed(method: string, path: string): boolean {
  return ALLOWED.some((rule) => rule.method === method && rule.pattern.test(path))
}

const unauthorized = (detail: string): BackendResponse => ({
  status: 401,
  body: JSON.stringify({ detail }),
  contentType: "application/json",
})

async function refresh(refreshToken: string, fetchImpl: FetchLike, baseUrl?: string): Promise<Tokens | null> {
  const response = await backendFetch({ method: "POST", path: "/api/auth/refresh", json: { refresh_token: refreshToken } }, fetchImpl, baseUrl)
  if (response.status !== 200) return null
  const tokens = JSON.parse(response.body) as Tokens
  return tokens.access_token && tokens.refresh_token ? tokens : null
}

export interface ForwardOptions {
  method: string
  path: string // /api/... including any query string
  json?: unknown
  jar: CookieJar
  fetchImpl?: FetchLike
  baseUrl?: string
}

export async function forward({ method, path, json, jar, fetchImpl = fetch, baseUrl }: ForwardOptions): Promise<BackendResponse> {
  const pathname = path.split("?")[0]
  if (!isAllowed(method, pathname)) return { status: 404, body: JSON.stringify({ detail: "Not found" }), contentType: "application/json" }

  const session = readSession(jar)
  const refreshToken = session.refresh
  let access = session.access
  if (!access && !refreshToken) return unauthorized("Not signed in")

  const call = (token: string | undefined) => backendFetch({ method, path, token, json }, fetchImpl, baseUrl)

  // A missing access cookie means it expired (the cookie's maxAge follows the JWT): go straight to refresh.
  let response = access ? await call(access) : null
  if (response === null || response.status === 401) {
    if (!refreshToken) {
      clearSession(jar)
      return unauthorized("Session expired")
    }
    const tokens = await refresh(refreshToken, fetchImpl, baseUrl)
    if (!tokens) {
      clearSession(jar)
      return unauthorized("Session expired")
    }
    setSession(jar, tokens)
    access = tokens.access_token
    response = await call(access)
  }
  return response
}

/** Signs in with be's form-encoded login and stores the tokens in the cookies. Returns be's response (tokens are NOT in it). */
export async function signIn(email: string, password: string, jar: CookieJar, fetchImpl: FetchLike = fetch, baseUrl?: string): Promise<BackendResponse> {
  const response = await backendFetch({ method: "POST", path: "/api/auth/login", form: { username: email, password } }, fetchImpl, baseUrl)
  if (response.status !== 200) return response
  setSession(jar, JSON.parse(response.body) as Tokens)
  return { status: 200, body: JSON.stringify({ ok: true }), contentType: "application/json" }
}

export async function register(
  input: { email: string; password: string; fullName?: string },
  jar: CookieJar,
  fetchImpl: FetchLike = fetch,
  baseUrl?: string,
): Promise<BackendResponse> {
  const created = await backendFetch(
    { method: "POST", path: "/api/users/", json: { email: input.email, password: input.password, ...(input.fullName ? { full_name: input.fullName } : {}) } },
    fetchImpl,
    baseUrl,
  )
  if (created.status !== 201) return created
  return signIn(input.email, input.password, jar, fetchImpl, baseUrl)
}
