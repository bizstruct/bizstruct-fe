import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Sticker, StickerList } from "./primitives"

describe("Sticker", () => {
  it("shows the text, and a caption, a meta element and a number only when given", () => {
    const { rerender } = render(<Sticker text="body" />)
    expect(screen.getByText("body")).toBeInTheDocument()
    expect(screen.queryByText("1")).not.toBeInTheDocument()

    rerender(<Sticker text="body" tag="Value" meta={<span>High</span>} number={1} id="x" />)
    expect(screen.getByText("Value")).toBeInTheDocument()
    expect(screen.getByText("High")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(document.querySelector("[data-sticker=x]")).not.toBeNull()
  })

  it("is the lavender block, whatever it holds", () => {
    render(<Sticker text="body" />)
    expect(document.querySelector("[data-sticker]")!.className).toContain("bg-indigo-500/[0.08]")
  })
})

describe("StickerList", () => {
  it("makes a sticker per item and accepts plain strings", () => {
    render(<StickerList items={["one", { text: "two", tag: "T" }]} />)
    const items = screen.getAllByRole("listitem")
    expect(items).toHaveLength(2)
    expect(within(items[1]).getByText("T")).toBeInTheDocument()
  })

  it("numbers the stickers in an ordered list when asked", () => {
    const { container } = render(<StickerList numbered items={["a", "b", "c"]} />)
    expect(container.querySelector("ol")).not.toBeNull()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("renders the empty text, or nothing without one", () => {
    const { container, rerender } = render(<StickerList items={[]} empty="nothing here" />)
    expect(screen.getByText("nothing here")).toBeInTheDocument()
    rerender(<StickerList items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
