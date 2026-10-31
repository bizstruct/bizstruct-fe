import { describe, expect, it } from "vitest"
import { titleFromIdea } from "./title"

describe("titleFromIdea", () => {
  it("uses a short first sentence as it is, without the final dot", () => {
    expect(titleFromIdea("Додаток для автомайстерень. Він надсилає нагадування.")).toBe("Додаток для автомайстерень")
  })

  it("cuts a long sentence at a word boundary and marks the cut", () => {
    const title = titleFromIdea("Мобільний застосунок для власників невеликих автомайстерень, що надсилає клієнтам нагадування про сезонну заміну шин")
    expect(title.length).toBeLessThanOrEqual(49)
    expect(title.endsWith("…")).toBe(true)
    expect(title).toBe("Мобільний застосунок для власників невеликих…")
  })

  it("collapses line breaks and spaces", () => {
    expect(titleFromIdea("  A marketplace\n\nfor   local  food ")).toBe("A marketplace for local food")
  })

  it("hard-cuts a single very long word", () => {
    expect(titleFromIdea("x".repeat(80))).toBe(`${"x".repeat(48)}…`)
  })
})
