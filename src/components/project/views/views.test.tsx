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

  it("says so when the brief is not generated yet", () => {
    const empty: ProjectView = { ...farm, brief: undefined }
    renderIntl(<BriefView view={empty} />)
    expect(screen.getByText("This part is not generated yet")).toBeInTheDocument()
  })
})

describe("SegmentsView", () => {
  it("shows the farm persona with their pains, the scenario and the ideation", () => {
    renderIntl(<SegmentsView view={farm} />)
    expect(screen.queryByRole("tab")).not.toBeInTheDocument() // one segment: no selector
    expect(screen.getByRole("heading", { name: "Maya Chen" })).toBeInTheDocument()
    expect(screen.getByText("Limited time for store visits, farmers' markets, meal planning, and food preparation.")).toBeInTheDocument()
    expect(within(screen.getByTestId("scenario-panel")).getByText(/On a Tuesday evening after the children are asleep, Maya opens the app/)).toBeInTheDocument()
    expect(within(screen.getByTestId("ideation-panel")).getByText("customer driven")).toBeInTheDocument()
  })

  it("lets the user switch between the three music segments", () => {
    renderIntl(<SegmentsView view={music} />)
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual(["Maya Torres", "Marcus Reed", "Maya Thompson"])
    expect(screen.getByRole("heading", { name: "Maya Torres" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("tab", { name: "Marcus Reed" }))

    expect(screen.getByRole("heading", { name: "Marcus Reed" })).toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "Maya Torres" })).not.toBeInTheDocument()
    // the scenario and the ideation follow the selected segment
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
  it("offers all three farm versions and badges only version 2 as FINAL", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    const tabs = screen.getAllByRole("tab")
    expect(tabs.map((t) => t.textContent)).toEqual(["Version 1", "Version 2FINAL", "Version 3"])
    expect(screen.getAllByTestId("final-badge")).toHaveLength(1)
    expect(within(tabs[1]).getByTestId("final-badge")).toHaveTextContent("FINAL")
  })

  it("opens on the final version", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    expect(screen.getByRole("tab", { name: /Version 2/ })).toHaveAttribute("aria-selected", "true")
  })

  it("opens on the final version even when it is not the last (music: final is version 1 of 2)", () => {
    renderIntl(<CanvasView view={music} {...flow} />)
    expect(screen.getByRole("tab", { name: /Version 1/ })).toHaveAttribute("aria-selected", "true")
    expect(within(screen.getByRole("tab", { name: /Version 1/ })).getByTestId("final-badge")).toBeInTheDocument()
    expect(within(screen.getByRole("tab", { name: /Version 2/ })).queryByTestId("final-badge")).not.toBeInTheDocument()
  })

  it("draws the nine blocks with the real cards", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    fireEvent.click(screen.getByRole("tab", { name: /Version 1/ }))
    const grid = within(screen.getByTestId("canvas-grid"))
    expect(Object.keys(farm.canvases[0].versions[0].canvas.sections)).toHaveLength(9)
    expect(grid.getByText("Family-customizable local produce boxes matched to children’s preferences")).toBeInTheDocument()
    expect(screen.getByTestId("canvas-grid").querySelectorAll("[data-section]")).toHaveLength(9)
  })

  it("marks the cards the ERRC changed: none in version 1, four in versions 2 and 3", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    const markers = () => screen.queryAllByTestId("errc-marker").map((m) => m.textContent)

    fireEvent.click(screen.getByRole("tab", { name: /Version 1/ }))
    expect(markers()).toEqual([])

    fireEvent.click(screen.getByRole("tab", { name: /Version 2/ }))
    expect(markers().sort()).toEqual(["Create", "Raise", "Raise", "Reduce"])

    fireEvent.click(screen.getByRole("tab", { name: /Version 3/ }))
    expect(markers().sort()).toEqual(["Create", "Raise", "Raise", "Raise"])
  })

  it("shows the chain of previous versions and jumps to one", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    fireEvent.click(screen.getByRole("tab", { name: /Version 3/ }))
    const chain = within(screen.getByTestId("version-chain"))
    expect(chain.getAllByRole("button").map((b) => b.textContent)).toEqual(["v1", "v2", "v3"])

    fireEvent.click(chain.getByRole("button", { name: "v1" }))
    expect(screen.getByRole("tab", { name: /Version 1/ })).toHaveAttribute("aria-selected", "true")
    expect(within(screen.getByTestId("version-chain")).getAllByRole("button")).toHaveLength(1)
  })

  it("says which version an ERRC-produced canvas came from, and which segments the canvas covers", () => {
    renderIntl(<CanvasView view={farm} {...flow} />)
    expect(screen.getByText("from version 1")).toBeInTheDocument()
    expect(screen.getByText("Covers: Maya Chen")).toBeInTheDocument()
  })

  it("does not show a FINAL badge when be did not name a final version", () => {
    const project = fixture(FARM)
    const cycle = project.rows.find((r) => r.stage === "swot_errc_cycle")!
    const without = buildProjectView({ ...project, rows: project.rows.map((r) => (r === cycle ? { ...r, finalVersion: undefined, finalCanvasId: undefined, finalSwotId: undefined } : r)) })
    renderIntl(<CanvasView view={without} {...flow} />)
    expect(screen.queryByTestId("final-badge")).not.toBeInTheDocument()
    expect(screen.getByRole("tab", { name: /Version 3/ })).toHaveAttribute("aria-selected", "true") // latest
  })
})

describe("SwotView", () => {
  it("shows the four clusters of the final farm version with the whole threat catalog (2 + 5 + 7 + 7 = 21)", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    expect(screen.getByRole("tab", { name: /Version 2/ })).toHaveAttribute("aria-selected", "true")
    const clusters = screen.getByTestId("swot-clusters").querySelectorAll("[data-cluster]")
    expect([...clusters].map((c) => c.getAttribute("data-cluster"))).toEqual(["value_proposition", "cost_revenue", "infrastructure", "customer_interface"])
    const sizes = [...clusters].map((c) => within(c as HTMLElement).getByTestId("threat-catalog").children.length)
    expect(sizes).toEqual([2, 5, 7, 7])
    expect(within(clusters[0] as HTMLElement).getByText("substitutes available")).toBeInTheDocument()
  })

  it("lists the ERRC moves that lead to the next version", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    const moves = within(screen.getByTestId("errc-moves"))
    expect(moves.getByText("Moves from version 2 to 3")).toBeInTheDocument()
    expect(moves.getAllByRole("listitem")).toHaveLength(4)
    // a raise shows the card it targets and the text it becomes, both starting the same way
    expect(moves.getAllByText(/In-app item pages showing farms, harvest dates, shelf life/).length).toBeGreaterThanOrEqual(2)
  })

  it("says the last version has no moves after it", () => {
    renderIntl(<SwotView view={farm} {...flow} />)
    fireEvent.click(screen.getByRole("tab", { name: /Version 3/ }))
    expect(screen.getByText("This is the last version: no moves follow it")).toBeInTheDocument()
  })

  it("marks the music project's final version 1 and shows its five moves", () => {
    renderIntl(<SwotView view={music} {...flow} />)
    expect(within(screen.getByRole("tab", { name: /Version 1/ })).getByTestId("final-badge")).toBeInTheDocument()
    expect(within(screen.getByTestId("errc-moves")).getAllByRole("listitem")).toHaveLength(5)
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
    expect(screen.getByRole("tab", { name: /Версія 2/ })).toBeInTheDocument()
    expect(within(screen.getByRole("tab", { name: /Версія 2/ })).getByTestId("final-badge")).toHaveTextContent("ФІНАЛЬНА")
  })
})
