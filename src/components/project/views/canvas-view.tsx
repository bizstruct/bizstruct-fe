"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CanvasFlow, CanvasVersionView, ProjectView } from "@/lib/mappers/project"
import type { CanvasCard, CanvasSections } from "@/types/domain/canvas"
import { NotReady, Panel } from "../primitives"

type Marker = NonNullable<CanvasCard["errc_marker"]>
const MARKER_TONE: Record<Marker, React.ComponentProps<typeof Badge>["tone"]> = { eliminate: "danger", reduce: "warning", raise: "success", create: "info" }

/** The nine blocks in the Business Model Canvas reading order (left to right, top to bottom). */
const ORDER: (keyof CanvasSections)[] = [
  "key_partnerships", "key_activities", "key_resources", "value_propositions", "customer_relationships", "channels", "customer_segments", "cost_structure", "revenue_streams",
]

/** One selector per canvas flow (several only for a split Patterns), shared by Canvas, SWOT, Story, Future and Pitch. */
export function CanvasPicker({ flows, value, onChange }: { flows: CanvasFlow[]; value: number; onChange: (index: number) => void }) {
  const t = useTranslations("Views.canvas")
  if (flows.length <= 1) return null
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {flows.map((f, i) => (
        <button
          key={f.canvasRow.id}
          role="tab"
          aria-selected={i === value}
          onClick={() => onChange(i)}
          className={cn("rounded-lg border px-3 py-1.5 text-sm", i === value ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}
        >
          {t("canvasN", { n: i + 1 })}
        </button>
      ))}
    </div>
  )
}

export function VersionSelector({ versions, value, onChange }: { versions: CanvasVersionView[]; value: number; onChange: (version: number) => void }) {
  const t = useTranslations("Views.canvas")
  return (
    <div role="tablist" aria-label={t("version")} className="flex flex-wrap items-center gap-2">
      {versions.map((v) => (
        <button
          key={v.version}
          role="tab"
          aria-selected={v.version === value}
          onClick={() => onChange(v.version)}
          className={cn("inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm", v.version === value ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}
        >
          {t("version")} {v.version}
          {v.isFinal ? <Badge tone="final" data-testid="final-badge">{t("final")}</Badge> : null}
        </button>
      ))}
    </div>
  )
}

export function CanvasView({ view, flowIndex, onFlow }: { view: ProjectView; flowIndex: number; onFlow: (i: number) => void }) {
  const t = useTranslations("Views.canvas")
  const tp = useTranslations("Project")
  const flow = view.canvases[Math.min(flowIndex, view.canvases.length - 1)]
  const [selected, setSelected] = useState<number | null>(null)
  if (!flow || flow.versions.length === 0) return <NotReady message={tp("notReady")} />

  // Open on the final version when be named one, else on the latest.
  const defaultVersion = flow.finalVersion ?? flow.versions[flow.versions.length - 1].version
  const current = flow.versions.find((v) => v.version === (selected ?? defaultVersion)) ?? flow.versions[flow.versions.length - 1]
  const chain = flow.versions.filter((v) => v.version <= current.version)

  return (
    <div className="space-y-4">
      <CanvasPicker flows={view.canvases} value={flowIndex} onChange={(i) => { onFlow(i); setSelected(null) }} />
      <p className="text-sm text-slate-500">{t("covers", { segments: flow.segments.map((s) => s.label).join(", ") })}</p>
      <VersionSelector versions={flow.versions} value={current.version} onChange={setSelected} />

      <Panel className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          {current.isFinal ? <Badge tone="final">{t("final")}</Badge> : null}
          {current.errcIn ? <span>{t("derivedFrom", { n: current.errcIn.from_version })}</span> : null}
          <span className="text-xs text-slate-400">{t("legend")}</span>
        </div>
        <CanvasGrid canvas={current.canvas.sections} />
        <div data-testid="version-chain" className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span className="font-medium">{t("previous")}:</span>
          {chain.map((v, i) => (
            <span key={v.version} className="inline-flex items-center gap-1.5">
              {i > 0 ? <span aria-hidden>←</span> : null}
              <button onClick={() => setSelected(v.version)} className={cn("rounded px-1.5 py-0.5 hover:bg-slate-100", v.version === current.version && "bg-slate-100 font-medium text-slate-800")}>
                v{v.version}
              </button>
            </span>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function CanvasGrid({ canvas }: { canvas: CanvasSections }) {
  const t = useTranslations("Views.canvas")
  return (
    <div className="grid gap-3 md:grid-cols-3" data-testid="canvas-grid">
      {ORDER.map((section) => {
        const cards = (canvas[section] as CanvasCard[] | undefined) ?? []
        return (
          <div key={section} data-section={section} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t(`sections.${section}`)}</h4>
            {cards.length === 0 ? <p className="text-xs text-slate-400">{t("empty")}</p> : null}
            <ul className="space-y-2">
              {cards.map((card) => (
                <li key={card.id} data-card={card.id} data-marker={card.errc_marker ?? undefined} className={cn("rounded-md border bg-white p-2 text-sm text-slate-800", card.errc_marker ? "border-indigo-300" : "border-slate-200")}>
                  {card.errc_marker ? (
                    <Badge tone={MARKER_TONE[card.errc_marker]} className="mb-1" data-testid="errc-marker">{t(`markers.${card.errc_marker}`)}</Badge>
                  ) : null}
                  <p>{card.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
