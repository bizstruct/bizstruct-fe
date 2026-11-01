import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { router } from "@/test/routing-mock"
import { renderIntl } from "@/test/render"
import type { ProjectSummary } from "@/types/api"
import { ProjectMenu } from "./project-menu"

const path = vi.hoisted(() => ({ current: "/" }))
vi.mock("@/i18n/routing", async () => {
  const mock = (await import("@/test/routing-mock")).routingMock
  return { ...mock, usePathname: () => path.current }
})
const api = vi.hoisted(() => ({ renameProject: vi.fn(), deleteProject: vi.fn() }))
vi.mock("@/lib/api/projects", () => api)
const notify = vi.hoisted(() => vi.fn())
vi.mock("@/hooks/use-projects", () => ({ notifyProjectsChanged: notify }))

const project = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Coffee demand",
  idea: "A service that forecasts the daily demand of small coffee shops.",
  language: "en",
  enabledOptional: ["business_case"],
  autoApprove: false,
  status: "completed",
  createdAt: "2026-10-30T10:00:00Z",
  updatedAt: "2026-10-30T10:05:00Z",
} as ProjectSummary

beforeEach(() => {
  Object.values(api).forEach((fn) => fn.mockReset())
  Object.values(router).forEach((fn) => fn.mockReset())
  notify.mockReset()
  path.current = "/"
})

// Radix opens a menu on pointer-down, not on click.
function openMenu() {
  const trigger = screen.getByRole("button", { name: "Project options" })
  fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false, pointerType: "mouse" })
}

describe("ProjectMenu", () => {
  it("offers rename, details and delete", async () => {
    renderIntl(<ProjectMenu project={project} />)
    openMenu()
    expect((await screen.findAllByRole("menuitem")).map((i) => i.textContent?.trim())).toEqual(["Rename", "Details", "Delete"])
  })

  it("shows the idea and the fixed facts of the project", async () => {
    renderIntl(<ProjectMenu project={project} />)
    openMenu()
    fireEvent.click(await screen.findByRole("menuitem", { name: "Details" }))
    const dialog = await screen.findByRole("dialog")
    expect(within(dialog).getByText(project.idea)).toBeInTheDocument()
    expect(within(dialog).getByText("EN")).toBeInTheDocument()
    expect(within(dialog).getByText("Completed")).toBeInTheDocument()
    expect(within(dialog).getByText("business_case")).toBeInTheDocument()
  })

  it("renames the project and tells the sidebar to reload", async () => {
    api.renameProject.mockResolvedValue({ ok: true, data: { ...project, title: "Coffee shops" } })
    renderIntl(<ProjectMenu project={project} />)
    openMenu()
    fireEvent.click(await screen.findByRole("menuitem", { name: "Rename" }))
    const dialog = await screen.findByRole("dialog")
    fireEvent.change(within(dialog).getByLabelText("Title"), { target: { value: "  Coffee shops  " } })
    fireEvent.click(within(dialog).getByRole("button", { name: "Save" }))

    await waitFor(() => expect(api.renameProject).toHaveBeenCalledWith(project.id, "Coffee shops"))
    await waitFor(() => expect(notify).toHaveBeenCalled())
  })

  it("does not call be when the title did not change", async () => {
    renderIntl(<ProjectMenu project={project} />)
    openMenu()
    fireEvent.click(await screen.findByRole("menuitem", { name: "Rename" }))
    fireEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Save" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    expect(api.renameProject).not.toHaveBeenCalled()
  })

  it("deletes only after a confirmation and goes home when that project is open", async () => {
    path.current = `/project/${project.id}`
    api.deleteProject.mockResolvedValue({ ok: true, data: undefined })
    renderIntl(<ProjectMenu project={project} />)
    openMenu()
    fireEvent.click(await screen.findByRole("menuitem", { name: "Delete" }))
    const dialog = await screen.findByRole("dialog")
    expect(api.deleteProject).not.toHaveBeenCalled()
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }))

    await waitFor(() => expect(api.deleteProject).toHaveBeenCalledWith(project.id))
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/"))
    expect(notify).toHaveBeenCalled()
  })

  it("stays on the page when another project is deleted, and shows a failure", async () => {
    api.deleteProject.mockResolvedValue({ ok: false, kind: "server", status: 500, detail: "x" })
    renderIntl(<ProjectMenu project={project} />)
    openMenu()
    fireEvent.click(await screen.findByRole("menuitem", { name: "Delete" }))
    fireEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Delete" }))
    expect(await screen.findByRole("alert")).toHaveTextContent("The action failed")
    expect(router.replace).not.toHaveBeenCalled()
  })
})
