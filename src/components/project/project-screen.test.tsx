import { fireEvent, screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { FARM, MUSIC, fixture } from "@/test/fixtures"
import { router } from "@/test/routing-mock"
import { renderIntl } from "@/test/render"
import { ProjectScreen } from "./project-screen"

vi.mock("@/i18n/routing", async () => (await import("@/test/routing-mock")).routingMock)
const api = vi.hoisted(() => ({ getProject: vi.fn(), approveRow: vi.fn(), regenerateRow: vi.fn() }))
vi.mock("@/lib/api/projects", () => api)

beforeEach(() => {
  Object.values(api).forEach((fn) => fn.mockReset())
  Object.values(router).forEach((fn) => fn.mockReset())
})

describe("ProjectScreen", () => {
  it("shows the finished farm project: the tabs, no polling", async () => {
    api.getProject.mockResolvedValue({ ok: true, data: fixture(FARM) })
    renderIntl(<ProjectScreen id={fixture(FARM).id} />)

    await screen.findAllByRole("tab")
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["Brief", "Segments", "Patterns", "Canvas", "SWOT / ERRC", "Storytelling", "Future", "Pitch"])
    expect(api.getProject).toHaveBeenCalledTimes(1)
  })

  it("has no Progress tab: each tab carries the status of its stages and the header shows the total", async () => {
    api.getProject.mockResolvedValue({ ok: true, data: fixture(FARM) })
    renderIntl(<ProjectScreen id={fixture(FARM).id} />)
    await screen.findAllByRole("tab")

    expect(screen.queryByRole("tab", { name: /Progress/ })).not.toBeInTheDocument()
    expect(screen.getByRole("progressbar", { name: "10 of 10 stages done" })).toHaveAttribute("aria-valuenow", "10")
    for (const tab of screen.getAllByRole("tab")) expect(within(tab).getByRole("img", { name: "Done" })).toBeInTheDocument()
    // Regenerate sits on the selected tab, not in a panel per stage
    expect(screen.getByRole("button", { name: "Regenerate" })).toBeInTheDocument()
  })

  it("shows a running stage on its tab and a generating notice instead of an empty view", async () => {
    const project = fixture(FARM)
    const running = {
      ...project,
      status: "running" as const,
      rows: project.rows.filter((r) => r.stage !== "pitch").concat({ ...project.rows.find((r) => r.stage === "pitch")!, status: "running", finishedAt: null, artifacts: [] } as never),
    }
    api.getProject.mockResolvedValue({ ok: true, data: { ...running, rows: running.rows.map((r) => (r.stage === "canvas" ? { ...r, status: "running" as const } : r)) } })
    renderIntl(<ProjectScreen id="p" />)
    await screen.findAllByRole("tab")

    expect(within(screen.getByRole("tab", { name: /Pitch/ })).getByRole("img", { name: "Running" })).toBeInTheDocument()
    // one regeneration at a time: nothing is offered while a stage is being generated
    expect(screen.queryByRole("button", { name: "Regenerate" })).not.toBeInTheDocument()
    expect(within(screen.getByRole("tab", { name: /Brief/ })).getByRole("img", { name: "Done" })).toBeInTheDocument()
  })

  it("opens an artifact tab with the real content", async () => {
    api.getProject.mockResolvedValue({ ok: true, data: fixture(MUSIC) })
    renderIntl(<ProjectScreen id={fixture(MUSIC).id} />)
    await screen.findAllByRole("tab")

    fireEvent.mouseDown(screen.getByRole("tab", { name: /Brief/ }))
    fireEvent.click(screen.getByRole("tab", { name: /Brief/ }))

    expect(await screen.findByText("Live music, event discovery, and venue booking marketplace")).toBeInTheDocument()
  })

  it("shows not-found for a missing project", async () => {
    api.getProject.mockResolvedValue({ ok: false, kind: "not_found", status: 404, detail: "x" })
    renderIntl(<ProjectScreen id="missing" />)
    expect(await screen.findByRole("alert")).toHaveTextContent("Project not found")
  })
})
