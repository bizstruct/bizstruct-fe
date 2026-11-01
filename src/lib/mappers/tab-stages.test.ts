import { describe, expect, it } from "vitest"
import type { Row } from "@/lib/api/projects"
import { FARM, MUSIC, fixture } from "@/test/fixtures"
import { TAB_IDS, stageProgress, stagesOfTab, stateOf } from "./tab-stages"

const farm = fixture(FARM)
const withStatus = (stage: string, status: Row["status"], index = 0): Row[] =>
  farm.rows.map((r) => (r.stage === stage && r.instanceIndex === index ? { ...r, status } : r))

describe("stagesOfTab", () => {
  it("covers every stage of a default project exactly once", () => {
    const covered = TAB_IDS.flatMap((tab) => stagesOfTab(tab, []))
    expect([...covered].sort()).toEqual([...new Set(farm.rows.map((r) => r.stage))].sort())
  })

  it("puts an enabled optional stage with the brief, and leaves a disabled one out", () => {
    expect(stagesOfTab("brief", [])).toEqual(["brief"])
    expect(stagesOfTab("brief", ["business_case"])).toEqual(["brief", "business_case"])
  })
})

describe("stateOf", () => {
  it("is done for a finished project's tabs", () => {
    for (const tab of TAB_IDS) expect(stateOf(farm.rows, stagesOfTab(tab, []))).toBe("done")
  })

  it("is running while a row runs or is being checked", () => {
    expect(stateOf(withStatus("patterns", "running"), ["patterns"])).toBe("running")
    expect(stateOf(withStatus("patterns", "consistency_check"), ["patterns"])).toBe("running")
  })

  it("lets an error or a waiting decision outrank a running sibling", () => {
    const rows = withStatus("ideation", "error").map((r) => (r.stage === "empathy_map" ? { ...r, status: "running" as const } : r))
    expect(stateOf(rows, stagesOfTab("segments", []))).toBe("error")
    expect(stateOf(withStatus("brief", "awaiting_decision"), ["brief"])).toBe("attention")
    expect(stateOf(withStatus("brief", "needs_retry"), ["brief"])).toBe("attention")
  })

  it("is waiting for pending rows and for a stage that has no rows yet", () => {
    expect(stateOf(withStatus("pitch", "pending"), ["pitch"])).toBe("waiting")
    expect(stateOf([], ["pitch"])).toBe("waiting")
  })

  it("is not done until every instance of a multi-instance stage is done (music: three empathy maps)", () => {
    const music = fixture(MUSIC)
    const rows = music.rows.map((r) => (r.stage === "empathy_map" && r.instanceIndex === 2 ? { ...r, status: "pending" as const } : r))
    expect(stateOf(rows, ["empathy_map"])).toBe("waiting")
  })
})

describe("stageProgress", () => {
  it("counts finished stages out of the stages the project runs", () => {
    expect(stageProgress(farm.rows, [])).toEqual({ done: 10, total: 10 })
    expect(stageProgress(withStatus("pitch", "running"), [])).toEqual({ done: 9, total: 10 })
  })

  it("counts an enabled optional stage in the total", () => {
    expect(stageProgress(farm.rows, ["business_case"]).total).toBe(11)
  })
})
