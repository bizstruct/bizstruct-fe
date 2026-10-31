import { fireEvent, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { buildProjectView, type ProjectView } from "@/lib/mappers/project"
import { FARM, MUSIC, fixture } from "@/test/fixtures"
import { renderIntl } from "@/test/render"
import { BriefView } from "./brief-view"
import { CanvasView } from "./canvas-view"
import { FutureView } from "./future-view"
import { PatternsView } from "./patterns-view"
import { PitchView } from "./pitch-view"
import { SegmentsView } from "./segments-view"
import { StoryView } from "./story-view"
import { SwotView } from "./swot-view"

const farm = buildProjectView(fixture(FARM))
const music = buildProjectView(fixture(MUSIC))
const flow = { flowIndex: 0, onFlow: () => {} }

describe("BriefView", () => {
  it("shows the farm brief", () => {
    renderIntl(<BriefView view={farm} />)
    expect(screen.getByText("Local food delivery and grocery technology")).toBeInTheDocument()
    expect(screen.getByText("Busy city parents seeking convenient access to fresh local produce")).toBeInTheDocument()
    expect(screen.getByText("The specific geographic market is not stated.")).toBeInTheDocument()
  })

  it("shows the music brief with its three segment candidates and monetization hint", () => {
    renderIntl(<BriefView view={music} />)
    expect(screen.getByText("Live music, event discovery, and venue booking marketplace")).toBeInTheDocument()
    expect(screen.getByText("Ticket sales through the platform")).toBeInTheDocument()
    expect(within(screen.getByText("Customer segment candidates").closest("section")!).getAllByRole("listitem")).toHaveLength(3)
  })

  it("keeps all three cards when a list is empty, without a placeholder text", () => {
    const brief = { ...farm.brief!, existing_resources: [], gaps: [] }
    renderIntl(<BriefView view={{ ...farm, brief }} />)
    for (const title of ["Customer segment candidates", "Existing resources", "Gaps"]) expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.queryByText(/^none$/i)).not.toBeInTheDocument()
  })

  it("says so when the brief is not generated yet", () => {
    const empty: ProjectView = { ...farm, brief: undefined }
    renderIntl(<BriefView view={empty} />)
    expect(screen.getByText("This part is not generated yet")).toBeInTheDocument()
  })
})

describe("SegmentsView", () => {
  it("shows the farm persona with their pains, the scenario and the ideation", () => {
    renderIntl(<SegmentsView view={farm} />)
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["Empathy map", "Customer scenario", "Ideation"]) // one segment: only the part selector
    expect(screen.getByRole("heading", { name: "Maya Chen" })).toBeInTheDocument()
    expect(screen.getByText("Limited time for store visits, farmers' markets, meal planning, and food preparation.")).toBeInTheDocument()
    expect(screen.queryByTestId("scenario-panel")).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("tab", { name: "Customer scenario" }))
    expect(within(screen.getByTestId("scenario-panel")).getByText(/On a Tuesday evening after the children are asleep, Maya opens the app/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole("tab", { name: "Ideation" }))
    expect(within(screen.getByTestId("ideation-panel")).getByText("customer driven")).toBeInTheDocument()
  })

  it("lets the user switch between the three music segments", () => {
    renderIntl(<SegmentsView view={music} />)
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["Empathy map", "Customer scenario", "Ideation"])
    expect(screen.getByRole("heading", { name: "Maya Torres" })).toBeInTheDocument()

    fireEvent.pointerDown(screen.getByRole("button", { name: "Segment" }), { button: 0, ctrlKey: false, pointerType: "mouse" })
    fireEvent.click(screen.getByRole("menuitem", { name: "Marcus Reed" }))

    expect(screen.getByRole("heading", { name: "Marcus Reed" })).toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "Maya Torres" })).not.toBeInTheDocument()
    // the scenario and the ideation follow the selected segment
    fireEvent.click(screen.getByRole("tab", { name: "Customer scenario" }))
    const scenario = music.segments[1].scenario!
    expect(within(screen.getByTestId("scenario-panel")).getByText(scenario.situation_narrative)).toBeInTheDocument()
  })
})

describe("PatternsView", () => {
  it("shows the multi-sided tag with its rationale, the group and all three pair scores of the music project", () => {
    renderIntl(<PatternsView view={music} />)
    expect(screen.getByText("One canvas for all segments")).toBeInTheDocument()
    const tags = within(screen.getByTestId("pattern-tags"))
    expect(tags.getByText("multi sided platform")).toBeInTheDocument()
    expect(tags.getByText(/Bands, venues, and fans are explicitly interdependent: bands need venue slots/)).toBeInTheDocument()
    expect(within(screen.getByTestId("pattern-groups")).getByText("Maya Torres, Marcus Reed, Maya Thompson")).toBeInTheDocument()

    const rows = within(screen.getByTestId("pair-scores")).getAllByRole("row").slice(1)
    expect(rows).toHaveLength(3)
    expect(rows[0]).toHaveTextContent(/Maya Torres \/ Marcus Reed|Maya Torres \/ Maya Thompson|Marcus Reed \/ Maya Thompson/)
  })

  it("says a single segment has no pairs and no tags (farm)", () => {
    renderIntl(<PatternsView view={farm} />)
    expect(screen.getByText("A single segment has no pairs")).toBeInTheDocument()
    expect(screen.getByText("No patterns were tagged")).toBeInTheDocument()
  })
})

describe("CanvasView", () => {
  const firstCard = (v: ProjectView, flowN = 0, version = 0) => v.canvases[flowN].versions[version].canvas.sections.value_propositions![0].text

  it("shows the final version only, without any version switcher or ERRC marker", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    expect(screen.queryByRole("tab")).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /Versions|History/ })).not.toBeInTheDocument()
    expect(screen.queryByTestId("errc-marker")).not.toBeInTheDocument()
    expect(screen.queryByTestId("final-badge")).not.toBeInTheDocument()
    const finalVersion = farm.canvases[0].finalVersion
    expect(finalVersion).toBe(2)
    expect(within(screen.getByTestId("canvas-grid")).getByText(firstCard(farm, 0, 1))).toBeInTheDocument()
  })

  it("shows the final version even when it is not the last (music: final is version 1 of 2)", () => {
    expect(music.canvases[0].finalVersion).toBe(1)
    renderIntl(<CanvasView view={music} {...flow} />)
    expect(within(screen.getByTestId("canvas-grid")).getByText(firstCard(music, 0, 0))).toBeInTheDocument()
  })

  it("draws the nine blocks with the real cards", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    const grid = screen.getByTestId("canvas-grid")
    expect(Object.keys(farm.canvases[0].versions[1].canvas.sections)).toHaveLength(9)
    expect(grid.querySelectorAll("[data-section]")).toHaveLength(9)
    expect(grid.querySelectorAll("[data-card]").length).toBeGreaterThan(9)
  })

  it("names the covered segments only when the canvas covers more than one", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    expect(screen.queryByText(/Covers:/)).not.toBeInTheDocument() // one segment: nothing to tell apart
    expect(screen.queryByText(/Changes from version/)).not.toBeInTheDocument()
  })

  it("lists every covered segment for a canvas shared by several", () => {
    renderIntl(<CanvasView view={music} {...flow} />)
    expect(screen.getByText("Covers: Maya Torres, Marcus Reed, Maya Thompson")).toBeInTheDocument()
  })

  it("falls back to the latest version when be did not name a final one", () => {
    const project = fixture(FARM)
    const cycle = project.rows.find((r) => r.stage === "swot_errc_cycle")!
    const without = buildProjectView({ ...project, rows: project.rows.map((r) => (r === cycle ? { ...r, finalVersion: undefined, finalCanvasId: undefined, finalSwotId: undefined } : r)) })
    renderIntl(<CanvasView view={without} {...flow} />)
    expect(within(screen.getByTestId("canvas-grid")).getByText(without.canvases[0].versions[2].canvas.sections.value_propositions![0].text)).toBeInTheDocument() // latest = version 3
  })
})

describe("SwotView", () => {
  it("sorts the final farm version into the four classic quadrants", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    const quadrants = screen.getByTestId("swot-quadrants").querySelectorAll("[data-quadrant]")
    expect([...quadrants].map((q) => q.getAttribute("data-quadrant"))).toEqual(["strengths", "weaknesses", "opportunities", "threats"])
    const swot = farm.canvases[0].versions[1].swot!
    const axes = swot.clusters.flatMap((c) => c.axis_statements)
    const count = (id: string) => within(screen.getByTestId("swot-quadrants").querySelector(`[data-quadrant=${id}]`) as HTMLElement).queryAllByRole("listitem").length
    expect(count("strengths")).toBe(Math.min(5, axes.filter((a) => a.score > 0).length))
    expect(count("weaknesses")).toBe(Math.min(5, axes.filter((a) => a.score < 0).length))
    expect(count("opportunities")).toBe(Math.min(5, swot.clusters.reduce((n, c) => n + c.opportunities.length, 0)))
  })

  it("shows each axis once, on the side its score takes", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    const axes = farm.canvases[0].versions[1].swot!.clusters.flatMap((c) => c.axis_statements)
    const strong = axes.filter((a) => a.score > 0).sort((a, b) => b.importance - a.importance)[0]
    expect(screen.getByText(strong.positive_statement)).toBeInTheDocument()
    expect(screen.queryByText(strong.negative_statement)).not.toBeInTheDocument()
  })

  it("caps every quadrant at five entries and expands the threat list on request (21 in the catalog)", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    const threats = () => within(screen.getByTestId("swot-quadrants").querySelector("[data-quadrant=threats]") as HTMLElement)
    expect(threats().getAllByRole("listitem")).toHaveLength(5)
    fireEvent.click(threats().getByRole("button", { name: "Show all (21)" }))
    expect(threats().getAllByRole("listitem")).toHaveLength(21)
    fireEvent.click(threats().getByRole("button", { name: "Show less" }))
    expect(threats().getAllByRole("listitem")).toHaveLength(5)
    expect(screen.queryByText(/Other threats/)).not.toBeInTheDocument()
  })

  it("shows words instead of figures: no n/max lines, the exact numbers only in a tooltip", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    expect(screen.queryByRole("meter")).not.toBeInTheDocument()
    expect(screen.queryByText(/^\d+\/\d+$/)).not.toBeInTheDocument()
    expect(screen.getAllByText(/^(High|Medium|Low)$/).length).toBeGreaterThan(0)
    expect(document.querySelector("[title^='Importance']")).not.toBeNull()
  })

  it("offers SWOT and ERRC as two parts when the final version came from an ERRC step (farm: version 2)", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["SWOT", "ERRC"])
    expect(screen.getByTestId("swot-quadrants")).toBeInTheDocument()
    expect(screen.queryByTestId("errc-moves")).not.toBeInTheDocument()
    expect(screen.queryByTestId("final-badge")).not.toBeInTheDocument()
  })

  it("the ERRC part lists the moves that produced the final canvas, with what changed and why", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    fireEvent.click(screen.getByRole("tab", { name: "ERRC" }))
    const moves = farm.canvases[0].versions[1].errcIn!.moves
    const list = screen.getByTestId("errc-moves")
    expect(list.querySelectorAll("[data-move]")).toHaveLength(moves.length)
    expect(within(list).getByText(moves[0].rationale, { exact: false })).toBeInTheDocument()
    expect(list.querySelectorAll("[data-focus]")).toHaveLength(moves.length) // one filled block per move, no other fills
    expect(screen.queryByTestId("swot-quadrants")).not.toBeInTheDocument()
  })

  it("has no ERRC part when the final version is the first canvas (music: final is version 1)", () => {
    renderIntl(<SwotView view={music} {...flow} />)
    expect(screen.queryByRole("tab")).not.toBeInTheDocument()
    expect(screen.getByTestId("swot-quadrants")).toBeInTheDocument()
  })
})

describe("StoryView", () => {
  it("shows the farm story with its goal and format, without the canvas references list", () => {
    renderIntl(<StoryView view={farm} {...flow} />)
    const panel = within(screen.getByTestId("story-panel"))
    expect(panel.getByText("pitching investors")).toBeInTheDocument()
    expect(panel.getByText("text and image")).toBeInTheDocument()
    expect(panel.getByText(/On Tuesday evening, after her children are asleep, Maya Chen/)).toBeInTheDocument()
    expect(panel.queryByRole("listitem")).not.toBeInTheDocument()
    expect(screen.queryByText("Canvas references")).not.toBeInTheDocument()
  })

  it("shows the music story", () => {
    renderIntl(<StoryView view={music} {...flow} />)
    expect(screen.getByText(/On Tuesday evening after her café shift, Maya Torres/)).toBeInTheDocument()
  })
})

describe("FutureView", () => {
  it("shows the four farm scenarios as numbered cards with their questions, nothing folded", () => {
    renderIntl(<FutureView view={farm} {...flow} />)
    const variants = within(screen.getByTestId("future-variants"))
    for (const name of ["Trusted Local Routine", "Abundant Produce, Reluctant Payers", "Costly City, Strong Demand", "Fragile Supply, Convenience Reset"]) {
      expect(variants.getByRole("heading", { name })).toBeInTheDocument()
    }
    expect(screen.getByText("4 possible futures that depend on these drivers")).toBeInTheDocument()
    expect(variants.getByText(/How should recurring family-box payments, delivery fees, and preferred-produce add-ons be balanced/)).toBeInTheDocument()
    expect(variants.getAllByText("Adaptation questions")).toHaveLength(4)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("names no canvas section next to the questions", () => {
    renderIntl(<FutureView view={farm} {...flow} />)
    expect(within(screen.getByTestId("future-variants")).queryByText("Value propositions")).not.toBeInTheDocument()
  })

  it("shows the music scenarios", () => {
    renderIntl(<FutureView view={music} {...flow} />)
    expect(screen.getByRole("heading", { name: "Weeknight Revival" })).toBeInTheDocument()
  })
})

describe("PitchView", () => {
  it("shows the farm pitch", () => {
    renderIntl(<PitchView view={farm} {...flow} />)
    const panel = within(screen.getByTestId("pitch-panel"))
    expect(panel.getByText(/After her children are asleep, Maya needs to plan weekday meals/)).toBeInTheDocument()
    expect(panel.getByText(/The model combines family-level customization with operationally relevant delive/)).toBeInTheDocument()
    expect(panel.queryByText("Team")).not.toBeInTheDocument() // no team_info was supplied
  })

  it("shows the music pitch", () => {
    renderIntl(<PitchView view={music} {...flow} />)
    expect(screen.getByText(/After a café shift, Maya needs a paid date for her indie-pop band/)).toBeInTheDocument()
  })
})

describe("every view in Ukrainian", () => {
  it("renders the labels in the interface language and the content as generated", () => {
    renderIntl(<CanvasView view={farm} {...flow} />, "uk")
    expect(screen.getByText("Ключові партнери")).toBeInTheDocument()
  })
})
