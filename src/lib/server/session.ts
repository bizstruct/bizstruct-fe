// Session cookies of the BFF. The access and refresh tokens live ONLY in httpOnly cookies set by
// route handlers; client code never sees a token (there is no endpoint that returns one).

export const ACCESS_COOKIE = "bs_access"
export const REFRESH_COOKIE = "bs_refresh"

/** The part of next/headers' cookie store (or NextResponse.cookies) the session needs. */
export interface CookieJar {
  get(name: string): { value: string } | undefined
  set(name: string, value: string, options?: CookieOptions): unknown
  delete(name: string): unknown
}

export interface CookieOptions {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: "lax" | "strict" | "none"
  path?: string
  maxAge?: number
}

export interface Tokens {
  access_token: string
  refresh_token: string
}

/** Seconds until a JWT expires, read from its payload (no signature check: be verifies it). Falls back to `fallback`. */
export function secondsUntilExpiry(jwt: string, fallback: number, now: () => number = Date.now): number {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString("utf-8")) as { exp?: number }
    if (typeof payload.exp === "number") return Math.max(Math.floor(payload.exp - now() / 1000), 0)
  } catch {
    // not a JWT we can read: use the fallback
  }
  return fallback
}

function baseOptions(secure: boolean): CookieOptions {
  return { httpOnly: true, secure, sameSite: "lax", path: "/" }
}

export function setSession(jar: CookieJar, tokens: Tokens, secure = process.env.NODE_ENV === "production"): void {
  jar.set(ACCESS_COOKIE, tokens.access_token, { ...baseOptions(secure), maxAge: secondsUntilExpiry(tokens.access_token, 30 * 60) })
  jar.set(REFRESH_COOKIE, tokens.refresh_token, { ...baseOptions(secure), maxAge: secondsUntilExpiry(tokens.refresh_token, 7 * 24 * 3600) })
}

export function clearSession(jar: CookieJar): void {
  jar.delete(ACCESS_COOKIE)
  jar.delete(REFRESH_COOKIE)
}

export function readSession(jar: CookieJar): { access?: string; refresh?: string } {
  return { access: jar.get(ACCESS_COOKIE)?.value, refresh: jar.get(REFRESH_COOKIE)?.value }
}
