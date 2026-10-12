import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { FARM, MUSIC, fixture } from "@/test/fixtures"
import { router } from "@/test/routing-mock"
import { renderIntl } from "@/test/render"
import { ProjectScreen } from "./project-screen"

vi.mock("@/i18n/routing", async () => (await import("@/test/routing-mock")).routingMock)
const api = vi.hoisted(() => ({ getProject: vi.fn(), deleteProject: vi.fn(), approveRow: vi.fn(), regenerateRow: vi.fn() }))
vi.mock("@/lib/api/projects", () => api)
const notify = vi.hoisted(() => vi.fn())
vi.mock("@/hooks/use-projects", () => ({ notifyProjectsChanged: notify, useProjects: () => ({ projects: [], error: null, reload: vi.fn() }) }))

beforeEach(() => {
  Object.values(api).forEach((fn) => fn.mockReset())
  notify.mockReset()
  Object.values(router).forEach((fn) => fn.mockReset())
})

describe("ProjectScreen", () => {
  it("shows the finished farm project: title, completed chip, no polling, and the tabs", async () => {
    api.getProject.mockResolvedValue({ ok: true, data: fixture(FARM) })
    renderIntl(<ProjectScreen id={fixture(FARM).id} />)

    expect(await screen.findByRole("heading", { level: 1, name: "New project" })).toBeInTheDocument()
    expect(screen.getByText("Completed")).toHaveAttribute("data-status", "completed")
    expect(screen.getByText("Generation finished")).toBeInTheDocument()
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["Progress", "Brief", "Segments", "Patterns", "Canvas", "SWOT / ERRC", "Storytelling", "Future", "Pitch"])
    expect(api.getProject).toHaveBeenCalledTimes(1)
  })

  it("opens an artifact tab with the real content", async () => {
    api.getProject.mockResolvedValue({ ok: true, data: fixture(MUSIC) })
    renderIntl(<ProjectScreen id={fixture(MUSIC).id} />)
    await screen.findByRole("heading", { level: 1 })

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Brief" }))
    fireEvent.click(screen.getByRole("tab", { name: "Brief" }))

    expect(await screen.findByText("Live music, event discovery, and venue booking marketplace")).toBeInTheDocument()
  })

  it("says the project is updating while it runs", async () => {
    api.getProject.mockResolvedValue({ ok: true, data: { ...fixture(FARM), status: "running" } })
    renderIntl(<ProjectScreen id="p" />)
    expect(await screen.findByText("Updating every 4 seconds")).toBeInTheDocument()
    expect(screen.getByText("In progress")).toBeInTheDocument()
  })

  it("shows not-found for a missing project", async () => {
    api.getProject.mockResolvedValue({ ok: false, kind: "not_found", status: 404, detail: "x" })
    renderIntl(<ProjectScreen id="missing" />)
    expect(await screen.findByRole("alert")).toHaveTextContent("Project not found")
  })

  it("deletes the project after a confirmation and goes home", async () => {
    api.getProject.mockResolvedValue({ ok: true, data: fixture(FARM) })
    api.deleteProject.mockResolvedValue({ ok: true, data: undefined })
    renderIntl(<ProjectScreen id={fixture(FARM).id} />)
    await screen.findByRole("heading", { level: 1 })

    fireEvent.click(screen.getByRole("button", { name: "Delete project" }))
    const dialog = await screen.findByRole("dialog")
    expect(api.deleteProject).not.toHaveBeenCalled()
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }))

    await waitFor(() => expect(api.deleteProject).toHaveBeenCalledWith(fixture(FARM).id))
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/"))
    expect(notify).toHaveBeenCalled()
  })
})
