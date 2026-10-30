import { describe, expect, it } from "vitest"
import { groupByRecency, recencyOf } from "./recency"

const now = new Date(2026, 9, 30, 15, 0) // 30 Oct 2026, 15:00 local
const at = (day: number, hour = 12) => new Date(2026, 9, day, hour).toISOString()

describe("recencyOf", () => {
  it("is today from local midnight on, the week for the 6 days before, earlier after that", () => {
    expect(recencyOf(at(30, 0), now)).toBe("today")
    expect(recencyOf(at(29, 23), now)).toBe("week")
    expect(recencyOf(at(24, 0), now)).toBe("week")
    expect(recencyOf(at(23, 23), now)).toBe("earlier")
  })
})

describe("groupByRecency", () => {
  const items = [
    { id: "old", createdAt: at(1) },
    { id: "now", createdAt: at(30, 9) },
    { id: "week", createdAt: at(27) },
    { id: "later today", createdAt: at(30, 14) },
  ]

  it("orders the groups and puts the newest first inside each", () => {
    const groups = groupByRecency(items, now)
    expect(groups.map((g) => g.group)).toEqual(["today", "week", "earlier"])
    expect(groups[0].items.map((i) => i.id)).toEqual(["later today", "now"])
  })

  it("leaves out empty groups", () => {
    expect(groupByRecency([items[1]], now).map((g) => g.group)).toEqual(["today"])
    expect(groupByRecency([], now)).toEqual([])
  })
})
