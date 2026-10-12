import { describe, expect, it } from "vitest"
import type { CanvasCard } from "@/types/domain/canvas"
import { FARM, FIXTURES, MUSIC, fixture } from "@/test/fixtures"
import { buildProjectView } from "./project"

describe.each(FIXTURES)("project view of $name", ({ project }) => {
  const view = buildProjectView(project)

  it("has a brief, one segment per empathy_map row and a patterns artifact", () => {
    expect(view.brief?.customer_segment_candidates.length).toBe(view.segments.length)
    expect(view.segments.map((s) => s.index)).toEqual(view.segments.map((_, i) => i))
    expect(view.patterns?.groups.length).toBe(view.canvases.length)
  })

  it("joins each segment to its own scenario and ideation through refs", () => {
    for (const s of view.segments) {
      expect(s.empathyMap?.id).toBe(s.scenario?.empathy_map_id)
      expect(s.empathyMap?.id).toBe(s.ideation?.empathy_map_id)
    }
  })

  it("gives every canvas a cycle, its versions in order, and downstream artifacts", () => {
    for (const flow of view.canvases) {
      expect(flow.cycleRow).toBeDefined()
      expect(flow.versions.map((v) => v.version)).toEqual(flow.versions.map((_, i) => i + 1))
      expect(flow.storytelling?.artifact).toBeDefined()
      expect(flow.futureScenario?.artifact).toBeDefined()
      expect(flow.pitch?.artifact).toBeDefined()
      expect(flow.segments.length).toBeGreaterThan(0)
    }
  })

  it("reads the final version from be's fields and marks exactly one version FINAL", () => {
    for (const flow of view.canvases) {
      const finals = flow.versions.filter((v) => v.isFinal)
      expect(finals).toHaveLength(1)
      expect(finals[0].version).toBe(flow.cycleRow?.finalVersion)
      expect(finals[0].canvas.id).toBe(flow.cycleRow?.finalCanvasId)
      expect(finals[0].swot?.id).toBe(flow.cycleRow?.finalSwotId)
    }
  })

  it("links every later version to the one before it and to the ERRC that produced it", () => {
    for (const flow of view.canvases) {
      flow.versions.forEach((v, i) => {
        if (i === 0) return expect(v.canvas.previous_version_id).toBeNull()
        expect(v.canvas.previous_version_id).toBe(flow.versions[i - 1].canvas.id)
        expect(v.errcIn?.result_canvas_id).toBe(v.canvas.id)
        expect(v.errcIn?.from_version).toBe(v.version - 1)
        expect(flow.versions[i - 1].errcOut?.id).toBe(v.errcIn?.id)
      })
    }
  })

  it("puts an ERRC marker only on cards of versions an ERRC produced", () => {
    for (const flow of view.canvases) {
      for (const v of flow.versions) {
        const cards = (Object.values(v.canvas.sections) as CanvasCard[][]).flat()
        const marked = cards.filter((c) => c.errc_marker)
        if (v.version === 1) expect(marked).toHaveLength(0)
        else expect(marked.length).toBe(v.errcIn?.moves.length)
      }
    }
  })

  it("never drops a row: every row's artifacts are reachable through the view", () => {
    const seen = new Set<string>()
    const add = (r?: { id: string }) => r && seen.add(r.id)
    add(view.briefRow)
    add(view.patternsRow)
    view.segments.forEach((s) => [s.empathyRow, s.scenarioRow, s.ideationRow].forEach(add))
    view.canvases.forEach((f) => [f.canvasRow, f.cycleRow, f.storytelling?.row, f.futureScenario?.row, f.pitch?.row].forEach(add))
    expect([...seen].sort()).toEqual(project.rows.map((r) => r.id).sort())
  })
})

describe("the farm fixture (one segment)", () => {
  const view = buildProjectView(fixture(FARM))

  it("has the expected real values", () => {
    expect(view.brief?.industry).toBe("Local food delivery and grocery technology")
    expect(view.segments.map((s) => s.label)).toEqual(["Maya Chen"])
    expect(view.patterns?.branch_decision).toBe("unified_model")
    expect(view.canvases).toHaveLength(1)
  })

  it("has three canvas versions and version 2 is the final one", () => {
    const [flow] = view.canvases
    expect(flow.versions.map((v) => [v.version, v.isFinal])).toEqual([[1, false], [2, true], [3, false]])
    expect(flow.finalVersion).toBe(2)
  })
})

describe("the music fixture (three segments, one multi-sided group)", () => {
  const view = buildProjectView(fixture(MUSIC))

  it("has three segments in order, labelled by persona", () => {
    expect(view.segments.map((s) => s.label)).toEqual(["Maya Torres", "Marcus Reed", "Maya Thompson"])
    expect(view.brief?.customer_segment_candidates).toHaveLength(3)
  })

  it("has one canvas that covers all three segments and a multi-sided pattern", () => {
    expect(view.canvases).toHaveLength(1)
    expect(view.canvases[0].segments.map((s) => s.index)).toEqual([0, 1, 2])
    expect(view.patterns?.pattern_tags.map((t) => t.pattern)).toEqual(["multi_sided_platform"])
    expect(view.patterns?.pairwise_scores).toHaveLength(3)
  })

  it("has two canvas versions and version 1 is the final one", () => {
    const [flow] = view.canvases
    expect(flow.versions.map((v) => [v.version, v.isFinal])).toEqual([[1, true], [2, false]])
  })
})
