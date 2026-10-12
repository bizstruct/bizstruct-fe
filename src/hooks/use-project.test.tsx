import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { ApiResult } from "@/lib/api/http"
import type { Project } from "@/lib/api/projects"
import { FARM, fixture } from "@/test/fixtures"
import { POLL_INTERVAL_MS, useProject } from "./use-project"

const base = fixture(FARM)
const withStatus = (status: Project["status"]): Project => ({ ...base, status })
const ok = (project: Project): ApiResult<Project> => ({ ok: true, data: project })

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

/** Lets pending promises settle, then moves the clock. */
const advance = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms) })

describe("useProject", () => {
  it("loads once, then polls every 4 seconds while the project is running", async () => {
    const fetcher = vi.fn().mockResolvedValue(ok(withStatus("running")))
    const { result } = renderHook(() => useProject("p-1", { fetcher }))

    await advance(0)
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(result.current.project?.status).toBe("running")
    expect(result.current.polling).toBe(true)

    await advance(POLL_INTERVAL_MS - 1)
    expect(fetcher).toHaveBeenCalledTimes(1)
    await advance(1)
    expect(fetcher).toHaveBeenCalledTimes(2)
    await advance(POLL_INTERVAL_MS)
    expect(fetcher).toHaveBeenCalledTimes(3)
  })

  it("uses a 4 second interval by default", () => {
    expect(POLL_INTERVAL_MS).toBe(4000)
  })

  it("stops polling once the project is completed", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(ok(withStatus("running"))).mockResolvedValue(ok(withStatus("completed")))
    const { result } = renderHook(() => useProject("p-1", { fetcher }))

    await advance(0)
    await advance(POLL_INTERVAL_MS)
    expect(result.current.project?.status).toBe("completed")
    expect(result.current.polling).toBe(false)

    const calls = fetcher.mock.calls.length
    await advance(POLL_INTERVAL_MS * 10)
    expect(fetcher).toHaveBeenCalledTimes(calls)
  })

  it("stops polling once the project has failed", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(ok(withStatus("running"))).mockResolvedValue(ok(withStatus("failed")))
    const { result } = renderHook(() => useProject("p-1", { fetcher }))

    await advance(0)
    await advance(POLL_INTERVAL_MS)
    expect(result.current.project?.status).toBe("failed")
    expect(result.current.polling).toBe(false)

    const calls = fetcher.mock.calls.length
    await advance(POLL_INTERVAL_MS * 10)
    expect(fetcher).toHaveBeenCalledTimes(calls)
  })

  it("does not poll a project that is already completed when it loads", async () => {
    const fetcher = vi.fn().mockResolvedValue(ok(withStatus("completed")))
    renderHook(() => useProject("p-1", { fetcher }))
    await advance(POLL_INTERVAL_MS * 5)
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it("keeps the last project and keeps polling through a transient server error", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(ok(withStatus("running")))
      .mockResolvedValueOnce({ ok: false, kind: "server", status: 503, detail: "down" })
      .mockResolvedValue(ok(withStatus("completed")))
    const { result } = renderHook(() => useProject("p-1", { fetcher }))

    await advance(0)
    await advance(POLL_INTERVAL_MS)
    expect(result.current.error?.kind).toBe("server")
    expect(result.current.project?.status).toBe("running")
    await advance(POLL_INTERVAL_MS)
    expect(result.current.error).toBeNull()
    expect(result.current.project?.status).toBe("completed")
  })

  it("stops on a lost session and on a missing project", async () => {
    for (const kind of ["unauthorized", "not_found"] as const) {
      const fetcher = vi.fn().mockResolvedValue({ ok: false, kind, status: kind === "unauthorized" ? 401 : 404, detail: "x" })
      const { result, unmount } = renderHook(() => useProject("p-1", { fetcher }))
      await advance(POLL_INTERVAL_MS * 5)
      expect(fetcher).toHaveBeenCalledTimes(1)
      expect(result.current.polling).toBe(false)
      unmount()
    }
  })

  it("starts polling again when an action puts a finished project back to running", async () => {
    const fetcher = vi.fn().mockResolvedValue(ok(withStatus("completed")))
    const { result } = renderHook(() => useProject("p-1", { fetcher }))
    await advance(0)
    expect(result.current.polling).toBe(false)

    act(() => result.current.replace(withStatus("running")))
    expect(result.current.polling).toBe(true)
    const before = fetcher.mock.calls.length
    await advance(POLL_INTERVAL_MS)
    expect(fetcher.mock.calls.length).toBe(before + 1)
  })

  it("stops its timer when the component unmounts", async () => {
    const fetcher = vi.fn().mockResolvedValue(ok(withStatus("running")))
    const { unmount } = renderHook(() => useProject("p-1", { fetcher }))
    await advance(0)
    unmount()
    await advance(POLL_INTERVAL_MS * 5)
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
})
