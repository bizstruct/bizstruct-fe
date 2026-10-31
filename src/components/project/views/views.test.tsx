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

/** The versions sit behind the history button: open it, then optionally pick one. */
const openHistory = (name = "History") => fireEvent.pointerDown(screen.getByRole("button", { name }), { button: 0, ctrlKey: false, pointerType: "mouse" })
const pickVersion = (n: number, name = "History") => {
  openHistory(name)
  fireEvent.click(screen.getByRole("menuitem", { name: new RegExp(`Version ${n}`) }))
}

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
  it("shows no version switcher, only the quiet history button", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    expect(screen.queryByRole("tab")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "History" })).toBeInTheDocument()
  })

  it("offers all three farm versions in the history and badges only version 2 as FINAL", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    openHistory()
    const items = screen.getAllByRole("menuitem")
    expect(items.map((i) => i.textContent)).toEqual(["V1", "V2FINAL", "V3"])
    expect(screen.getAllByTestId("final-badge")).toHaveLength(1)
    expect(within(items[1]).getByTestId("final-badge")).toHaveTextContent("FINAL")
  })

  it("opens on the final version", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    openHistory()
    expect(screen.getByRole("menuitem", { name: /Version 2/ })).toHaveAttribute("aria-current", "true")
  })

  it("opens on the final version even when it is not the last (music: final is version 1 of 2)", () => {
    renderIntl(<CanvasView view={music} {...flow} />)
    openHistory()
    expect(screen.getByRole("menuitem", { name: /Version 1/ })).toHaveAttribute("aria-current", "true")
    expect(within(screen.getByRole("menuitem", { name: /Version 1/ })).getByTestId("final-badge")).toBeInTheDocument()
    expect(within(screen.getByRole("menuitem", { name: /Version 2/ })).queryByTestId("final-badge")).not.toBeInTheDocument()
  })

  it("draws the nine blocks with the real cards", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    pickVersion(1)
    const grid = within(screen.getByTestId("canvas-grid"))
    expect(Object.keys(farm.canvases[0].versions[0].canvas.sections)).toHaveLength(9)
    expect(grid.getByText("Family-customizable local produce boxes matched to children’s preferences")).toBeInTheDocument()
    expect(screen.getByTestId("canvas-grid").querySelectorAll("[data-section]")).toHaveLength(9)
  })

  it("marks the ERRC changes only on an earlier version the user opened, never on the final canvas", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    const markers = () => screen.queryAllByTestId("errc-marker").map((m) => m.textContent)
    expect(markers()).toEqual([]) // the final version (2) opens clean, though the loop made four changes to reach it

    pickVersion(1)
    expect(markers()).toEqual([])

    pickVersion(3)
    expect(markers().sort()).toEqual(["Create", "Raise", "Raise", "Raise"])
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

  it("does not show a FINAL badge when be did not name a final version", () => {
    const project = fixture(FARM)
    const cycle = project.rows.find((r) => r.stage === "swot_errc_cycle")!
    const without = buildProjectView({ ...project, rows: project.rows.map((r) => (r === cycle ? { ...r, finalVersion: undefined, finalCanvasId: undefined, finalSwotId: undefined } : r)) })
    renderIntl(<CanvasView view={without} {...flow} />)
    openHistory()
    expect(screen.queryByTestId("final-badge")).not.toBeInTheDocument()
    expect(screen.getByRole("menuitem", { name: /Version 3/ })).toHaveAttribute("aria-current", "true") // latest
  })
})

describe("SwotView", () => {
  it("shows the four clusters of the final farm version with the whole threat catalog (2 + 5 + 7 + 7 = 21)", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    openHistory()
    expect(screen.getByRole("menuitem", { name: /Version 2/ })).toHaveAttribute("aria-current", "true")
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" })
    const clusters = screen.getByTestId("swot-clusters").querySelectorAll("[data-cluster]")
    expect([...clusters].map((c) => c.getAttribute("data-cluster"))).toEqual(["value_proposition", "cost_revenue", "infrastructure", "customer_interface"])
    const sizes = [...clusters].map((c) => within(c as HTMLElement).getByTestId("threat-catalog").children.length)
    expect(sizes).toEqual([2, 5, 7, 7])
    expect(within(clusters[0] as HTMLElement).getByText("substitutes available")).toBeInTheDocument()
  })

  it("hides the ERRC moves on the final version and lists them for an earlier one", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    expect(screen.queryByTestId("errc-moves")).not.toBeInTheDocument()

    pickVersion(1)
    const moves = within(screen.getByTestId("errc-moves"))
    expect(moves.getByText("Moves from version 1 to 2")).toBeInTheDocument()
    expect(moves.getAllByRole("listitem").length).toBeGreaterThan(0)
  })

  it("says the last version has no moves after it", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    pickVersion(3)
    expect(screen.getByText("This is the last version: no moves follow it")).toBeInTheDocument()
  })

  it("marks the music project's final version 1 in the history", () => {
    renderIntl(<SwotView view={music} {...flow} />)
    openHistory()
    expect(within(screen.getByRole("menuitem", { name: /Version 1/ })).getByTestId("final-badge")).toBeInTheDocument()
  })
})

describe("StoryView", () => {
  it("shows the farm story with its goal, format and canvas references", () => {
    renderIntl(<StoryView view={farm} {...flow} />)
    const panel = within(screen.getByTestId("story-panel"))
    expect(panel.getByText("pitching investors")).toBeInTheDocument()
    expect(panel.getByText("text and image")).toBeInTheDocument()
    expect(panel.getByText(/On Tuesday evening, after her children are asleep, Maya Chen/)).toBeInTheDocument()
    expect(panel.getAllByRole("listitem")).toHaveLength(farm.canvases[0].storytelling!.artifact!.canvas_references.length)
  })

  it("shows the music story", () => {
    renderIntl(<StoryView view={music} {...flow} />)
    expect(screen.getByText(/On Tuesday evening after her café shift, Maya Torres/)).toBeInTheDocument()
  })
})

describe("FutureView", () => {
  it("shows the four farm scenarios with their adaptation questions", () => {
    renderIntl(<FutureView view={farm} {...flow} />)
    const variants = within(screen.getByTestId("future-variants"))
    for (const name of ["Trusted Local Routine", "Abundant Produce, Reluctant Payers", "Costly City, Strong Demand", "Fragile Supply, Convenience Reset"]) {
      expect(variants.getByRole("heading", { name })).toBeInTheDocument()
    }
    expect(variants.getByText(/How should recurring family-box payments, delivery fees, and preferred-produce add-ons be balanced/)).toBeInTheDocument()
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
    openHistory("Історія версій")
    expect(screen.getByRole("menuitem", { name: /Версія 2/ })).toBeInTheDocument()
    expect(within(screen.getByRole("menuitem", { name: /Версія 2/ })).getByTestId("final-badge")).toHaveTextContent("ФІНАЛЬНА")
  })
})
