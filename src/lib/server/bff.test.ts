import { describe, expect, it, vi } from "vitest"
import { forward, isAllowed, register, signIn } from "./bff"
import { ACCESS_COOKIE, REFRESH_COOKIE, secondsUntilExpiry, setSession, type CookieJar, type CookieOptions } from "./session"

const jwt = (expSecondsFromNow: number, now = Date.now()) => {
  const payload = Buffer.from(JSON.stringify({ sub: "u", exp: Math.floor(now / 1000) + expSecondsFromNow })).toString("base64url")
  return `h.${payload}.s`
}

class Jar implements CookieJar {
  values = new Map<string, string>()
  options = new Map<string, CookieOptions | undefined>()
  constructor(initial: Record<string, string> = {}) {
    Object.entries(initial).forEach(([k, v]) => this.values.set(k, v))
  }
  get = (name: string) => (this.values.has(name) ? { value: this.values.get(name)! } : undefined)
  set = (name: string, value: string, options?: CookieOptions) => {
    this.values.set(name, value)
    this.options.set(name, options)
  }
  delete = (name: string) => void this.values.delete(name)
}

const ID = "01a1275d-afec-7009-a3e6-132c74208221"
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } })
const BASE = "http://be.test"

function backend(handlers: Record<string, (init: RequestInit) => Response>) {
  const calls: { url: string; init: RequestInit }[] = []
  const fetchImpl = vi.fn(async (url: string, init: RequestInit = {}) => {
    calls.push({ url, init })
    const handler = handlers[`${init.method} ${url.replace(BASE, "").split("?")[0]}`]
    if (!handler) throw new Error(`unexpected call ${init.method} ${url}`)
    return handler(init)
  })
  return { fetchImpl, calls }
}

const auth = (init: RequestInit) => (init.headers as Record<string, string>).Authorization

describe("forward", () => {
  it("sends the access token from the cookie as a bearer token", async () => {
    const { fetchImpl, calls } = backend({ [`GET /api/projects/${ID}`]: () => json(200, { id: ID }) })
    const jar = new Jar({ [ACCESS_COOKIE]: "access-1", [REFRESH_COOKIE]: "refresh-1" })

    const response = await forward({ method: "GET", path: `/api/projects/${ID}`, jar, fetchImpl, baseUrl: BASE })

    expect(response.status).toBe(200)
    expect(auth(calls[0].init)).toBe("Bearer access-1")
  })

  it("on a 401 refreshes once, stores the new tokens in httpOnly cookies and retries with the new access token", async () => {
    const newAccess = jwt(1800)
    const newRefresh = jwt(7 * 24 * 3600)
    let projectCalls = 0
    const { fetchImpl, calls } = backend({
      [`GET /api/projects/${ID}`]: (init) => (projectCalls++ === 0 ? json(401, { detail: "expired" }) : auth(init) === `Bearer ${newAccess}` ? json(200, { id: ID }) : json(500, {})),
      "POST /api/auth/refresh": (init) => (JSON.parse(init.body as string).refresh_token === "refresh-1" ? json(200, { access_token: newAccess, refresh_token: newRefresh }) : json(401, {})),
    })
    const jar = new Jar({ [ACCESS_COOKIE]: "stale", [REFRESH_COOKIE]: "refresh-1" })

    const response = await forward({ method: "GET", path: `/api/projects/${ID}`, jar, fetchImpl, baseUrl: BASE })

    expect(response.status).toBe(200)
    expect(calls.map((c) => c.url.replace(BASE, ""))).toEqual([`/api/projects/${ID}`, "/api/auth/refresh", `/api/projects/${ID}`])
    expect(jar.get(ACCESS_COOKIE)?.value).toBe(newAccess)
    expect(jar.get(REFRESH_COOKIE)?.value).toBe(newRefresh)
    for (const name of [ACCESS_COOKIE, REFRESH_COOKIE]) {
      expect(jar.options.get(name)).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/" })
    }
  })

  it("refreshes straight away when the access cookie has already expired", async () => {
    const newAccess = jwt(1800)
    const { fetchImpl, calls } = backend({
      "POST /api/auth/refresh": () => json(200, { access_token: newAccess, refresh_token: jwt(3600) }),
      "GET /api/projects": (init) => (auth(init) === `Bearer ${newAccess}` ? json(200, []) : json(401, {})),
    })

    const response = await forward({ method: "GET", path: "/api/projects?limit=50", jar: new Jar({ [REFRESH_COOKIE]: "refresh-1" }), fetchImpl, baseUrl: BASE })

    expect(response.status).toBe(200)
    expect(calls[0].url).toBe(`${BASE}/api/auth/refresh`)
  })

  it("clears the cookies and answers 401 when the refresh is refused, and does not retry", async () => {
    const { fetchImpl, calls } = backend({
      [`GET /api/projects/${ID}`]: () => json(401, {}),
      "POST /api/auth/refresh": () => json(401, { detail: "bad token" }),
    })
    const jar = new Jar({ [ACCESS_COOKIE]: "stale", [REFRESH_COOKIE]: "revoked" })

    const response = await forward({ method: "GET", path: `/api/projects/${ID}`, jar, fetchImpl, baseUrl: BASE })

    expect(response.status).toBe(401)
    expect(jar.values.size).toBe(0)
    expect(calls).toHaveLength(2)
  })

  it("answers 401 without calling be when there is no session", async () => {
    const { fetchImpl } = backend({})
    const response = await forward({ method: "GET", path: "/api/projects", jar: new Jar(), fetchImpl, baseUrl: BASE })
    expect(response.status).toBe(401)
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it("passes be's own status and body through, including 404 and 409", async () => {
    const { fetchImpl } = backend({
      [`POST /api/projects/${ID}/rows/${ID}/approve`]: () => json(409, { detail: "Cannot approve" }),
    })
    const jar = new Jar({ [ACCESS_COOKIE]: "a", [REFRESH_COOKIE]: "r" })
    const response = await forward({ method: "POST", path: `/api/projects/${ID}/rows/${ID}/approve`, jar, fetchImpl, baseUrl: BASE })
    expect(response.status).toBe(409)
    expect(JSON.parse(response.body)).toEqual({ detail: "Cannot approve" })
  })

  it("forwards a JSON body", async () => {
    const { fetchImpl, calls } = backend({ "POST /api/generation": () => json(201, { id: ID }) })
    await forward({ method: "POST", path: "/api/generation", json: { idea: "x", language: "en" }, jar: new Jar({ [ACCESS_COOKIE]: "a", [REFRESH_COOKIE]: "r" }), fetchImpl, baseUrl: BASE })
    expect(calls[0].init.body).toBe(JSON.stringify({ idea: "x", language: "en" }))
  })

  it("refuses paths the viewer does not use, without calling be", async () => {
    const { fetchImpl } = backend({})
    const jar = new Jar({ [ACCESS_COOKIE]: "a", [REFRESH_COOKIE]: "r" })
    for (const [method, path] of [["GET", "/api/internal/projects/x"], ["POST", "/api/internal/hook"], ["GET", "/api/users/"], ["POST", "/api/users/me/change-password"], ["PATCH", `/api/projects/${ID}`], ["GET", "/api/projects/not-a-uuid"]]) {
      expect((await forward({ method, path, jar, fetchImpl, baseUrl: BASE })).status).toBe(404)
    }
    expect(fetchImpl).not.toHaveBeenCalled()
  })
})

describe("isAllowed", () => {
  it("allows exactly the documented read, create, delete and row-action calls", () => {
    expect(isAllowed("GET", "/api/users/me")).toBe(true)
    expect(isAllowed("POST", "/api/generation")).toBe(true)
    expect(isAllowed("GET", "/api/projects")).toBe(true)
    expect(isAllowed("GET", `/api/projects/${ID}`)).toBe(true)
    expect(isAllowed("DELETE", `/api/projects/${ID}`)).toBe(true)
    expect(isAllowed("POST", `/api/projects/${ID}/rows/${ID}/regenerate`)).toBe(true)
    expect(isAllowed("DELETE", "/api/projects")).toBe(false)
  })
})

describe("signIn and register", () => {
  it("logs in with be's form-encoded endpoint, sets the cookies and never returns a token", async () => {
    const access = jwt(1800)
    const { fetchImpl, calls } = backend({
      "POST /api/auth/login": () => json(200, { access_token: access, refresh_token: jwt(3600), token_type: "bearer" }),
    })
    const jar = new Jar()

    const response = await signIn("a@b.co", "pw-12345678", jar, fetchImpl, BASE)

    expect(response.status).toBe(200)
    expect(response.body).toBe(JSON.stringify({ ok: true }))
    expect(response.body).not.toContain(access)
    expect((calls[0].init.headers as Record<string, string>)["Content-Type"]).toBe("application/x-www-form-urlencoded")
    expect(calls[0].init.body).toBe("username=a%40b.co&password=pw-12345678")
    expect(jar.get(ACCESS_COOKIE)?.value).toBe(access)
  })

  it("a wrong password sets no cookie and passes the 401 through", async () => {
    const { fetchImpl } = backend({ "POST /api/auth/login": () => json(401, { detail: "Invalid" }) })
    const jar = new Jar()
    const response = await signIn("a@b.co", "nope", jar, fetchImpl, BASE)
    expect(response.status).toBe(401)
    expect(jar.values.size).toBe(0)
  })

  it("register creates the user and then signs in", async () => {
    const { fetchImpl, calls } = backend({
      "POST /api/users/": () => json(201, { id: "u" }),
      "POST /api/auth/login": () => json(200, { access_token: jwt(60), refresh_token: jwt(600) }),
    })
    const jar = new Jar()

    const response = await register({ email: "a@b.co", password: "pw-12345678", fullName: "Ann" }, jar, fetchImpl, BASE)

    expect(response.status).toBe(200)
    expect(JSON.parse(calls[0].init.body as string)).toEqual({ email: "a@b.co", password: "pw-12345678", full_name: "Ann" })
    expect(jar.get(REFRESH_COOKIE)).toBeDefined()
  })

  it("register reports an existing email as 409 and does not log in", async () => {
    const { fetchImpl, calls } = backend({ "POST /api/users/": () => json(409, { detail: "exists" }) })
    const response = await register({ email: "a@b.co", password: "pw-12345678" }, new Jar(), fetchImpl, BASE)
    expect(response.status).toBe(409)
    expect(calls).toHaveLength(1)
  })
})

describe("session cookies", () => {
  it("take their lifetime from the token's own expiry", () => {
    const now = Date.UTC(2026, 9, 12)
    expect(secondsUntilExpiry(jwt(1800, now), 5, () => now)).toBe(1800)
    expect(secondsUntilExpiry(jwt(-10, now), 5, () => now)).toBe(0)
    expect(secondsUntilExpiry("not-a-jwt", 77)).toBe(77)
  })

  it("are httpOnly, lax and Secure only in production", () => {
    const jar = new Jar()
    setSession(jar, { access_token: jwt(60), refresh_token: jwt(600) }, true)
    expect(jar.options.get(ACCESS_COOKIE)).toMatchObject({ httpOnly: true, secure: true, sameSite: "lax" })
    setSession(jar, { access_token: jwt(60), refresh_token: jwt(600) }, false)
    expect(jar.options.get(ACCESS_COOKIE)).toMatchObject({ httpOnly: true, secure: false })
  })
})
