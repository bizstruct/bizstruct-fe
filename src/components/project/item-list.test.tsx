import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ItemList } from "./primitives"

describe("ItemList", () => {
  it("draws a block per item by default and accepts plain strings", () => {
    render(<ItemList items={["one", "two"]} />)
    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(2)
    expect(items[0].className).toContain("bg-indigo-500/[0.08]")
  })

  it("draws plain dotted lines for the bullet variant", () => {
    render(<ItemList variant="bullet" items={["one"]} />)
    expect(screen.getByRole("listitem").className).not.toContain("bg-indigo")
    expect(screen.getByText("one")).toBeInTheDocument()
  })

  it("shows a caption and a meta element above the text of a block", () => {
    render(<ItemList items={[{ text: "body", tag: "Value", meta: <span>High</span>, id: "x" }]} />)
    const item = screen.getByRole("listitem")
    expect(within(item).getByText("Value")).toBeInTheDocument()
    expect(within(item).getByText("High")).toBeInTheDocument()
    expect(item).toHaveAttribute("data-item", "x")
  })

  it("numbers the blocks in an ordered list when asked", () => {
    const { container } = render(<ItemList numbered items={["a", "b", "c"]} />)
    expect(container.querySelector("ol")).not.toBeNull()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("renders the empty text, or nothing without one", () => {
    const { container, rerender } = render(<ItemList items={[]} empty="nothing here" />)
    expect(screen.getByText("nothing here")).toBeInTheDocument()
    rerender(<ItemList items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
