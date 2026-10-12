import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { Project, Row } from "@/lib/api/projects"
import { FARM, MUSIC, fixture } from "@/test/fixtures"
import { MESSAGES, renderIntl } from "@/test/render"
import { ProgressView } from "./progress-view"

vi.mock("@/i18n/routing", async () => (await import("@/test/routing-mock")).routingMock)
const api = vi.hoisted(() => ({ approveRow: vi.fn(), regenerateRow: vi.fn() }))
vi.mock("@/lib/api/projects", () => api)

const row = (project: Project, stage: string, index = 0) => project.rows.find((r) => r.stage === stage && r.instanceIndex === index)!
const patch = (project: Project, target: Row, changes: Partial<Row>): Project => ({ ...project, rows: project.rows.map((r) => (r.id === target.id ? { ...r, ...changes } : r)) })

beforeEach(() => {
  api.approveRow.mockReset()
  api.regenerateRow.mockReset()
})

function show(project: Project) {
  const onProject = vi.fn()
  const onRefresh = vi.fn()
  renderIntl(<ProgressView project={project} onProject={onProject} onRefresh={onRefresh} />)
  return { onProject, onRefresh }
}

describe("ProgressView", () => {
  it("draws the stage graph from stages.json in dependency order, without the disabled optional stages", () => {
    show(fixture(FARM))
    const graph = screen.getByTestId("stage-graph")
    const stages = [...graph.querySelectorAll("[data-stage]")].map((n) => n.getAttribute("data-stage"))
    expect(stages).toEqual(["brief", "empathy_map", "customer_scenario", "ideation", "patterns", "canvas", "swot_errc_cycle", "storytelling", "future_scenario", "pitch"])
    expect(stages).not.toContain("business_case")
    const layers = [...graph.querySelectorAll("[data-layer]")].map((n) => Number(n.getAttribute("data-layer")))
    expect(layers).toEqual([...layers].sort((a, b) => a - b))
  })

  it("titles every stage in the interface language", () => {
    show(fixture(FARM))
    expect(screen.getByRole("heading", { name: MESSAGES.en.Stages.swot_errc_cycle })).toBeInTheDocument()
    // customer scenario and ideation both come after the empathy map
    expect(screen.getAllByText("after Empathy map")).toHaveLength(2)
  })

  it("shows a done chip for every row of the finished farm project", () => {
    show(fixture(FARM))
    const chips = screen.getAllByText("Done")
    expect(chips).toHaveLength(fixture(FARM).rows.length)
  })

  it("numbers the rows of a multi-instance stage (music: three empathy maps)", () => {
    show(fixture(MUSIC))
    const node = screen.getByTestId("stage-graph").querySelector('[data-stage="empathy_map"]') as HTMLElement
    expect(within(node).getByText("#1")).toBeInTheDocument()
    expect(within(node).getByText("#2")).toBeInTheDocument()
    expect(within(node).getByText("#3")).toBeInTheDocument()
  })

  it("shows how long each row ran, from startedAt and finishedAt", () => {
    const project = fixture(FARM)
    show(project)
    const brief = row(project, "brief")
    const seconds = ((Date.parse(brief.finishedAt!) - Date.parse(brief.startedAt!)) / 1000).toFixed(1)
    expect(within(screen.getByTestId("row-brief-0")).getByText(`${seconds} s`)).toBeInTheDocument()
  })

  it("shows the consistency violations of a row: rule id, severity and message", () => {
    const project = fixture(FARM)
    show(project)
    const scenario = within(screen.getByTestId("row-customer_scenario-0"))
    const violation = row(project, "customer_scenario").consistency!.violations![0]
    expect(scenario.getByText(violation.rule_id)).toBeInTheDocument()
    expect(scenario.getByText("warning")).toBeInTheDocument()
    expect(scenario.getByText(violation.message)).toBeInTheDocument()
  })

  it("shows a row's error with its translated code and message", () => {
    const project = fixture(FARM)
    const pitch = row(project, "pitch")
    show(patch(project, pitch, { status: "error", error: { code: "stuck_timeout", message: "No result within 1800 seconds." }, finishedAt: null }))
    const alert = within(screen.getByTestId("row-pitch-0")).getByRole("alert")
    expect(alert).toHaveTextContent("Timed out")
    expect(alert).toHaveTextContent("No result within 1800 seconds.")
  })

  it("shows a running row without actions", () => {
    const project = fixture(FARM)
    show(patch(project, row(project, "pitch"), { status: "running", finishedAt: null }))
    const pitch = within(screen.getByTestId("row-pitch-0"))
    expect(pitch.getByText("Running")).toBeInTheDocument()
    expect(pitch.queryByRole("button")).not.toBeInTheDocument()
  })
})

describe("row actions", () => {
  it("offers Approve and Regenerate on a row awaiting a decision, and approve calls be and hands back the project", async () => {
    const project = fixture(FARM)
    const patterns = row(project, "patterns")
    const waiting = patch(project, patterns, { status: "awaiting_decision" })
    api.approveRow.mockResolvedValue({ ok: true, data: project })
    const { onProject } = show(waiting)

    const actions = within(screen.getByTestId(`actions-${patterns.id}`))
    expect(actions.getByRole("button", { name: "Regenerate" })).toBeInTheDocument()
    fireEvent.click(actions.getByRole("button", { name: "Approve" }))

    await waitFor(() => expect(onProject).toHaveBeenCalledWith(project))
    expect(api.approveRow).toHaveBeenCalledWith(project.id, patterns.id)
  })

  it("offers only Regenerate on a done row and Retry on a row in error", () => {
    const project = fixture(FARM)
    const failed = patch(project, row(project, "pitch"), { status: "error", error: { code: "generation_failed", message: "x" } })
    show(failed)
    expect(within(screen.getByTestId("row-brief-0")).getByRole("button", { name: "Regenerate" })).toBeInTheDocument()
    expect(within(screen.getByTestId("row-brief-0")).queryByRole("button", { name: "Approve" })).not.toBeInTheDocument()
    expect(within(screen.getByTestId("row-pitch-0")).getByRole("button", { name: "Retry" })).toBeInTheDocument()
  })

  it("asks for confirmation before regenerating and names the rows that will be reset", async () => {
    const project = fixture(FARM)
    api.regenerateRow.mockResolvedValue({ ok: true, data: project })
    const { onProject } = show(project)

    fireEvent.click(within(screen.getByTestId("row-canvas-0")).getByRole("button", { name: "Regenerate" }))

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
    show(project)
    fireEvent.click(within(screen.getByTestId("row-brief-0")).getByRole("button", { name: "Regenerate" }))
    const dialog = await screen.findByRole("dialog")
    expect(within(within(dialog).getByTestId("dependents")).getAllByRole("listitem")).toHaveLength(project.rows.length - 1)
  })

  it("says nothing depends on a row that nothing refs (the pitch)", async () => {
    show(fixture(FARM))
    fireEvent.click(within(screen.getByTestId("row-pitch-0")).getByRole("button", { name: "Regenerate" }))
    const dialog = await screen.findByRole("dialog")
    expect(within(dialog).getByText("No other rows depend on it.")).toBeInTheDocument()
  })

  it("does nothing when the confirmation is cancelled", async () => {
    show(fixture(FARM))
    fireEvent.click(within(screen.getByTestId("row-canvas-0")).getByRole("button", { name: "Regenerate" }))
    fireEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    expect(api.regenerateRow).not.toHaveBeenCalled()
  })

  it("tells the user and reloads when be answers 409 (the row changed meanwhile)", async () => {
    const project = fixture(FARM)
    const waiting = patch(project, row(project, "patterns"), { status: "awaiting_decision" })
    api.approveRow.mockResolvedValue({ ok: false, kind: "conflict", status: 409, detail: "Cannot approve" })
    const { onProject, onRefresh } = show(waiting)

    fireEvent.click(within(screen.getByTestId(`actions-${row(project, "patterns").id}`)).getByRole("button", { name: "Approve" }))

    expect(await screen.findByText(/This is no longer possible for the row/)).toBeInTheDocument()
    expect(onRefresh).toHaveBeenCalled()
    expect(onProject).not.toHaveBeenCalled()
  })
})
