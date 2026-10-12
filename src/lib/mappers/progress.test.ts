import { describe, expect, it } from "vitest"
import { FARM, FIXTURES, MUSIC, fixture } from "@/test/fixtures"
import { actionsFor, dependentsOf, durationSeconds, stageColumns } from "./progress"

describe.each(FIXTURES)("stage graph of $name", ({ project }) => {
  const columns = stageColumns(project.rows, project.enabledOptional)

  it("places every row of the project in exactly one stage node", () => {
    const ids = columns.flatMap((c) => c.stages.flatMap((s) => s.rows.map((r) => r.id)))
    expect(ids.sort()).toEqual(project.rows.map((r) => r.id).sort())
  })

  it("puts each stage after every stage it depends on", () => {
    const layerOf = new Map(columns.flatMap((c) => c.stages.map((s) => [s.definition.id as string, c.layer] as const)))
    for (const { definition } of columns.flatMap((c) => c.stages)) {
      for (const parent of [...definition.depends_on, ...definition.optional_depends_on]) {
        if (layerOf.has(parent)) expect(layerOf.get(definition.id)!).toBeGreaterThan(layerOf.get(parent)!)
      }
    }
  })

  it("leaves out optional stages the project did not enable", () => {
    const stages = columns.flatMap((c) => c.stages.map((s) => s.definition.id as string))
    for (const optional of ["business_case", "environment_scan", "team_info"]) expect(stages).not.toContain(optional)
  })
})

describe("stageColumns", () => {
  it("shows an enabled optional stage and moves its consumer after it", () => {
    const { rows } = fixture(FARM)
    const columns = stageColumns(rows, ["environment_scan"])
    const layerOf = (id: string) => columns.find((c) => c.stages.some((s) => s.definition.id === id))!.layer
    expect(layerOf("environment_scan")).toBeLessThan(layerOf("swot_errc_cycle"))
    expect(columns.flatMap((c) => c.stages).find((s) => s.definition.id === "environment_scan")!.rows).toEqual([])
  })

  it("lists the rows of a multi-instance stage by instance index", () => {
    const { rows } = fixture(MUSIC)
    const node = stageColumns(rows, []).flatMap((c) => c.stages).find((s) => s.definition.id === "empathy_map")!
    expect(node.rows.map((r) => r.instanceIndex)).toEqual([0, 1, 2])
  })
})

describe("durationSeconds", () => {
  it("is finishedAt minus startedAt, from the real rows", () => {
    const brief = fixture(FARM).rows.find((r) => r.stage === "brief")!
    expect(durationSeconds(brief)).toBeCloseTo((Date.parse(brief.finishedAt!) - Date.parse(brief.startedAt!)) / 1000)
    expect(durationSeconds(brief)).toBeGreaterThan(0)
  })

  it("is undefined while either end is missing", () => {
    expect(durationSeconds({ startedAt: "2026-10-10T20:00:00Z", finishedAt: null })).toBeUndefined()
    expect(durationSeconds({ startedAt: null, finishedAt: null })).toBeUndefined()
  })
})

describe("actionsFor", () => {
  it("offers approve and regenerate on a row awaiting a decision, regenerate on done, retry on error, nothing otherwise", () => {
    expect(actionsFor("awaiting_decision")).toEqual(["approve", "regenerate"])
    expect(actionsFor("done")).toEqual(["regenerate"])
    expect(actionsFor("error")).toEqual(["retry"])
    for (const s of ["pending", "running", "consistency_check", "needs_retry"] as const) expect(actionsFor(s)).toEqual([])
  })
})

describe("dependentsOf (display only)", () => {
  const { rows } = fixture(FARM)
  const row = (stage: string) => rows.find((r) => r.stage === stage)!

  it("lists every other row for the brief", () => {
    expect(dependentsOf(rows, row("brief").id)).toHaveLength(rows.length - 1)
  })

  it("lists the cycle, storytelling, future scenario and pitch for the canvas, in graph order", () => {
    expect(dependentsOf(rows, row("canvas").id).map((r) => r.stage)).toEqual(["swot_errc_cycle", "storytelling", "future_scenario", "pitch"])
  })

  it("lists nothing for the last row, and never the row itself", () => {
    expect(dependentsOf(rows, row("pitch").id)).toEqual([])
    expect(dependentsOf(rows, row("storytelling").id).map((r) => r.stage)).toEqual(["pitch"])
  })
})
