import { afterEach, describe, expect, it, vi } from "vitest"
import { detailOf, request, setUnauthorizedHandler } from "./http"

const reply = (status: number, body?: unknown) =>
  vi.fn<(input: string, init?: RequestInit) => Promise<Response>>(async () => new Response(body === undefined ? null : JSON.stringify(body), { status }))

afterEach(() => setUnauthorizedHandler(null))

describe("request", () => {
  it("returns the parsed body on success and sends same-origin credentials without a token", async () => {
    const fetchImpl = reply(200, { id: "p" })
    const result = await request("/api/be/projects/p", {}, fetchImpl as unknown as typeof fetch)
    expect(result).toEqual({ ok: true, data: { id: "p" } })
    const init = fetchImpl.mock.calls[0][1] as RequestInit
    expect(init.credentials).toBe("same-origin")
    expect(JSON.stringify(init)).not.toMatch(/authorization|bearer/i)
  })

  it("maps each status to an explicit kind", async () => {
    const kinds = async (status: number) => {
      const result = await request("/x", {}, reply(status, { detail: "why" }) as unknown as typeof fetch)
      return result.ok ? "ok" : result.kind
    }
    expect(await kinds(404)).toBe("not_found")
    expect(await kinds(409)).toBe("conflict")
    expect(await kinds(422)).toBe("validation")
    expect(await kinds(500)).toBe("server")
    expect(await kinds(502)).toBe("server")
  })

  it("calls the unauthorized handler on 401 and reports it", async () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    const result = await request("/x", {}, reply(401, { detail: "Session expired" }) as unknown as typeof fetch)
    expect(handler).toHaveBeenCalledOnce()
    expect(result).toMatchObject({ ok: false, kind: "unauthorized", detail: "Session expired" })
  })

  it("reports a network failure as its own kind", async () => {
    const result = await request("/x", {}, vi.fn().mockRejectedValue(new TypeError("offline")) as unknown as typeof fetch)
    expect(result).toMatchObject({ ok: false, kind: "network", status: 0, detail: "offline" })
  })

  it("treats 204 as success without a body", async () => {
    expect(await request("/x", { method: "DELETE" }, reply(204) as unknown as typeof fetch)).toEqual({ ok: true, data: undefined })
  })

  it("sends a JSON body with its content type", async () => {
    const fetchImpl = reply(201, {})
    await request("/x", { method: "POST", json: { a: 1 } }, fetchImpl as unknown as typeof fetch)
    const init = fetchImpl.mock.calls[0][1] as RequestInit
    expect(init.body).toBe('{"a":1}')
    expect(init.headers).toEqual({ "Content-Type": "application/json" })
  })
})

describe("detailOf", () => {
  it("reads be's detail string and FastAPI's validation list", () => {
    expect(detailOf({ detail: "nope" }, "fallback")).toBe("nope")
    expect(detailOf({ detail: [{ loc: ["body", "idea"], msg: "too short" }] }, "fallback")).toBe("idea: too short")
    expect(detailOf(null, "fallback")).toBe("fallback")
  })
})
