import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { Project, Row } from "@/lib/api/projects"
import { FARM, MUSIC, fixture } from "@/test/fixtures"
import { renderIntl } from "@/test/render"
import type { StageId } from "@/types/domain/stages"
import { StageStatusPanel } from "./stage-status"
import { TabActions } from "./tab-actions"

vi.mock("@/i18n/routing", async () => (await import("@/test/routing-mock")).routingMock)
const api = vi.hoisted(() => ({ approveRow: vi.fn(), regenerateRow: vi.fn() }))
vi.mock("@/lib/api/projects", () => api)

const row = (project: Project, stage: string, index = 0) => project.rows.find((r) => r.stage === stage && r.instanceIndex === index)!
const patch = (project: Project, target: Row, changes: Partial<Row>): Project => ({ ...project, rows: project.rows.map((r) => (r.id === target.id ? { ...r, ...changes } : r)) })

beforeEach(() => {
  api.approveRow.mockReset()
  api.regenerateRow.mockReset()
})

function panel(project: Project, stages: StageId[]) {
  const onProject = vi.fn()
  const onRefresh = vi.fn()
  renderIntl(<StageStatusPanel project={project} stages={stages} onProject={onProject} onRefresh={onRefresh} />)
  return { onProject, onRefresh }
}

function tabActions(project: Project, stages: StageId[]) {
  const onProject = vi.fn()
  const onRefresh = vi.fn()
  renderIntl(<TabActions project={project} stages={stages} onProject={onProject} onRefresh={onRefresh} />)
  return { onProject, onRefresh }
}

describe("StageStatusPanel", () => {
  it("shows nothing for a stage that went through cleanly: its state is the icon on the tab", () => {
    panel(fixture(FARM), ["brief"])
    expect(screen.queryByTestId("stage-status")).not.toBeInTheDocument()
  })

  it("shows the consistency violations of a row: rule id, severity and message", () => {
    const project = fixture(FARM)
    panel(project, ["customer_scenario"])
    const scenario = within(screen.getByTestId("problems-customer_scenario-0"))
    const violation = row(project, "customer_scenario").consistency!.violations![0]
    expect(scenario.getByText(violation.rule_id)).toBeInTheDocument()
    expect(scenario.getByText("warning")).toBeInTheDocument()
    expect(scenario.getByText(violation.message)).toBeInTheDocument()
  })

  it("shows no Regenerate button and no duration for a finished row: both live elsewhere", () => {
    panel(fixture(FARM), ["customer_scenario"])
    expect(screen.queryByRole("button", { name: "Regenerate" })).not.toBeInTheDocument()
    expect(screen.queryByText(/\d+\.\d s/)).not.toBeInTheDocument()
  })

  it("shows a row's error with its translated code and message, and a Retry button", () => {
    const project = fixture(FARM)
    const pitch = row(project, "pitch")
    panel(patch(project, pitch, { status: "error", error: { code: "stuck_timeout", message: "No result within 1800 seconds." }, finishedAt: null }), ["pitch"])
    const problems = within(screen.getByTestId("problems-pitch-0"))
    expect(problems.getByRole("alert")).toHaveTextContent("Timed out")
    expect(problems.getByRole("alert")).toHaveTextContent("No result within 1800 seconds.")
    expect(problems.getByRole("button", { name: "Retry" })).toBeInTheDocument()
  })

  it("shows nothing for a row that is still running", () => {
    const project = fixture(FARM)
    panel(patch(project, row(project, "pitch"), { status: "running", finishedAt: null, consistency: null }), ["pitch"])
    expect(screen.queryByTestId("stage-status")).not.toBeInTheDocument()
  })

  it("offers Approve and Regenerate on a row awaiting a decision, and Approve calls be and hands back the project", async () => {
    const project = fixture(FARM)
    const patterns = row(project, "patterns")
    api.approveRow.mockResolvedValue({ ok: true, data: project })
    const { onProject } = panel(patch(project, patterns, { status: "awaiting_decision" }), ["patterns"])

    const actions = within(screen.getByTestId(`actions-${patterns.id}`))
    expect(actions.getByRole("button", { name: "Regenerate" })).toBeInTheDocument()
    fireEvent.click(actions.getByRole("button", { name: "Approve" }))

    await waitFor(() => expect(onProject).toHaveBeenCalledWith(project))
    expect(api.approveRow).toHaveBeenCalledWith(project.id, patterns.id)
  })

  it("tells the user and reloads when be answers 409 (the row changed meanwhile)", async () => {
    const project = fixture(FARM)
    const patterns = row(project, "patterns")
    api.approveRow.mockResolvedValue({ ok: false, kind: "conflict", status: 409, detail: "Cannot approve" })
    const { onProject, onRefresh } = panel(patch(project, patterns, { status: "awaiting_decision" }), ["patterns"])

    fireEvent.click(within(screen.getByTestId(`actions-${patterns.id}`)).getByRole("button", { name: "Approve" }))

    expect(await screen.findByText(/This is no longer possible for the row/)).toBeInTheDocument()
    expect(onRefresh).toHaveBeenCalled()
    expect(onProject).not.toHaveBeenCalled()
  })
})

describe("TabActions (Regenerate in the tab bar)", () => {
  it("is absent while nothing in the tab can be regenerated", () => {
    const project = fixture(FARM)
    tabActions(patch(project, row(project, "pitch"), { status: "running", finishedAt: null }), ["pitch"])
    expect(screen.queryByRole("button", { name: "Regenerate" })).not.toBeInTheDocument()
  })

  it("asks for confirmation before regenerating and names the rows that will be reset", async () => {
    const project = fixture(FARM)
    api.regenerateRow.mockResolvedValue({ ok: true, data: project })
    const { onProject } = tabActions(project, ["canvas"])

    fireEvent.click(screen.getByRole("button", { name: "Regenerate" }))

    const dialog = await screen.findByRole("dialog")
    expect(within(dialog).getByText(/“Business model canvas” will be generated again/)).toBeInTheDocument()
    const dependents = within(within(dialog).getByTestId("dependents")).getAllByRole("listitem").map((li) => li.textContent)
    expect(dependents).toEqual(["SWOT / ERRC cycle #1", "Storytelling #1", "Future scenarios #1", "Pitch #1"])
    expect(api.regenerateRow).not.toHaveBeenCalled() // nothing happens until confirmed

    fireEvent.click(within(dialog).getByRole("button", { name: "Regenerate" }))
    await waitFor(() => expect(onProject).toHaveBeenCalledWith(project))
    expect(api.regenerateRow).toHaveBeenCalledWith(project.id, row(project, "canvas").id)
  })

  it("lists every other row as a dependent of the brief", async () => {
    const project = fixture(MUSIC)
    tabActions(project, ["brief"])
    fireEvent.click(screen.getByRole("button", { name: "Regenerate" }))
    const dialog = await screen.findByRole("dialog")
    expect(within(within(dialog).getByTestId("dependents")).getAllByRole("listitem")).toHaveLength(project.rows.length - 1)
  })

  it("says nothing depends on a row that nothing refs (the pitch)", async () => {
    tabActions(fixture(FARM), ["pitch"])
    fireEvent.click(screen.getByRole("button", { name: "Regenerate" }))
    expect(within(await screen.findByRole("dialog")).getByText("No other rows depend on it.")).toBeInTheDocument()
  })

  it("does nothing when the confirmation is cancelled", async () => {
    tabActions(fixture(FARM), ["canvas"])
    fireEvent.click(screen.getByRole("button", { name: "Regenerate" }))
    fireEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    expect(api.regenerateRow).not.toHaveBeenCalled()
  })

  it("asks which row when the tab holds several (three empathy maps under Segments)", async () => {
    const project = fixture(MUSIC)
    api.regenerateRow.mockResolvedValue({ ok: true, data: project })
    tabActions(project, ["empathy_map", "customer_scenario", "ideation"])

    fireEvent.pointerDown(screen.getByRole("button", { name: "Regenerate" }), { button: 0, ctrlKey: false, pointerType: "mouse" })
    const items = (await screen.findAllByRole("menuitem")).map((i) => i.textContent?.trim())
    expect(items.slice(0, 3)).toEqual(["Empathy map #1", "Empathy map #2", "Empathy map #3"])
    expect(items).toContain("Ideation #1")

    fireEvent.click(screen.getByRole("menuitem", { name: "Empathy map #2" }))
    const dialog = await screen.findByRole("dialog")
    fireEvent.click(within(dialog).getByRole("button", { name: "Regenerate" }))
    await waitFor(() => expect(api.regenerateRow).toHaveBeenCalledWith(project.id, row(project, "empathy_map", 1).id))
  })

  it("keeps the dialog open with the message and reloads when be answers 409", async () => {
    api.regenerateRow.mockResolvedValue({ ok: false, kind: "conflict", status: 409, detail: "Cannot regenerate" })
    const { onProject, onRefresh } = tabActions(fixture(FARM), ["canvas"])
    fireEvent.click(screen.getByRole("button", { name: "Regenerate" }))
    fireEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Regenerate" }))

    expect(await screen.findByText(/This is no longer possible for the row/)).toBeInTheDocument()
    expect(onRefresh).toHaveBeenCalled()
    expect(onProject).not.toHaveBeenCalled()
  })
})
