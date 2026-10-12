import { describe, expect, it } from "vitest"
import { STAGES } from "@/types/domain/stages"
import { MESSAGES } from "@/test/render"

// fe owns the stage id -> title map (messages/{uk,en}.json, "Stages"). When the domain adds a stage to
// stages.json (a `pnpm sync:domain` after a version bump), these tests fail until both titles exist.
describe.each(Object.entries(MESSAGES))("stage titles (%s)", (locale, messages) => {
  const titles = messages.Stages as Record<string, string>

  it.each(STAGES.map((s) => s.id))("has a non-empty title for %s", (id) => {
    expect(titles[id], `${locale} is missing a title for stage "${id}"`).toBeTruthy()
  })

  it("has no title for a stage that does not exist", () => {
    const known = new Set<string>(STAGES.map((s) => s.id))
    expect(Object.keys(titles).filter((id) => !known.has(id))).toEqual([])
  })
})

describe("the two locales", () => {
  it("define exactly the same message keys", () => {
    const keys = (value: unknown, prefix = ""): string[] =>
      Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
        typeof v === "object" && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
      )
    expect(keys(MESSAGES.uk).sort()).toEqual(keys(MESSAGES.en).sort())
  })
})
