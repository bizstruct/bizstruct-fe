"use client"

import { useState } from "react"
import { Activity, ArrowDown, ArrowLeft, ArrowUp, Boxes, Coins, Gem, Handshake, Heart, Plus, Star, Trash2, Truck, Users, Wallet, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CanvasFlow, CanvasVersionView, ProjectView } from "@/lib/mappers/project"
import type { CanvasCard, CanvasSections } from "@/types/domain/canvas"
import { ACCENT, IconBadge, NotReady, Panel, SegmentedControl, type Accent } from "../primitives"

type Marker = NonNullable<CanvasCard["errc_marker"]>
const MARKER: Record<Marker, { tone: React.ComponentProps<typeof Badge>["tone"]; icon: LucideIcon; card: string }> = {
  eliminate: { tone: "danger", icon: Trash2, card: "border-red-300 bg-red-50/60" },
  reduce: { tone: "warning", icon: ArrowDown, card: "border-amber-300 bg-amber-50/60" },
  raise: { tone: "success", icon: ArrowUp, card: "border-emerald-300 bg-emerald-50/60" },
  create: { tone: "info", icon: Plus, card: "border-sky-300 bg-sky-50/60" },
}

/** The nine blocks in the Business Model Canvas reading order. */
const ORDER: (keyof CanvasSections)[] = [
  "key_partnerships", "key_activities", "key_resources", "value_propositions", "customer_relationships", "channels", "customer_segments", "cost_structure", "revenue_streams",
]

const PLACE: Record<keyof CanvasSections, { icon: LucideIcon; accent: Accent }> = {
  key_partnerships: { icon: Handshake, accent: "slate" },
  key_activities: { icon: Activity, accent: "sky" },
  key_resources: { icon: Boxes, accent: "sky" },
  value_propositions: { icon: Gem, accent: "indigo" },
  customer_relationships: { icon: Heart, accent: "violet" },
  channels: { icon: Truck, accent: "violet" },
  customer_segments: { icon: Users, accent: "emerald" },
  cost_structure: { icon: Wallet, accent: "red" },
  revenue_streams: { icon: Coins, accent: "amber" },
}

/**
 * The classic board: five columns (the second and the fourth stack two blocks) over a cost/revenue row.
 * Columns, not a rigid row grid, so one long block never pushes its neighbour's partner away.
 */
const COLUMNS: (keyof CanvasSections)[][] = [["key_partnerships"], ["key_activities", "key_resources"], ["value_propositions"], ["customer_relationships", "channels"], ["customer_segments"]]
const BOTTOM: (keyof CanvasSections)[][] = [["cost_structure"], ["revenue_streams"]]

/** One selector per canvas flow (several only for a split Patterns), shared by Canvas, SWOT, Story, Future and Pitch. */
export function CanvasPicker({ flows, value, onChange }: { flows: CanvasFlow[]; value: number; onChange: (index: number) => void }) {
  const t = useTranslations("Views.canvas")
  if (flows.length <= 1) return null
  return <SegmentedControl id="canvas-flow" value={value} onChange={onChange} items={flows.map((f, i) => ({ id: i, label: t("canvasN", { n: i + 1 }) }))} />
}

export function VersionSelector({ versions, value, onChange }: { versions: CanvasVersionView[]; value: number; onChange: (version: number) => void }) {
  const t = useTranslations("Views.canvas")
  return (
    <SegmentedControl
      id="canvas-version"
      label={t("version")}
      value={value}
      onChange={onChange}
      items={versions.map((v) => ({
        id: v.version,
        label: (
          <>
            {t("version")} {v.version}
            {v.isFinal ? (
              <Badge tone="final" data-testid="final-badge" className="gap-0.5">
                <Star className="fill-current" aria-hidden />
                {t("final")}
              </Badge>
            ) : null}
          </>
        ),
      }))}
    />
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <CanvasPicker flows={view.canvases} value={flowIndex} onChange={(i) => { onFlow(i); setSelected(null) }} />
          <p className="text-sm text-slate-500">{t("covers", { segments: flow.segments.map((s) => s.label).join(", ") })}</p>
        </div>
        <VersionSelector versions={flow.versions} value={current.version} onChange={setSelected} />
      </div>

      <Panel className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          {current.isFinal ? (
            <Badge tone="final" className="gap-0.5 px-2 py-1">
              <Star className="fill-current" aria-hidden />
                {t("final")}
            </Badge>
          ) : null}
          {current.errcIn ? <span className="font-medium">{t("derivedFrom", { n: current.errcIn.from_version })}</span> : null}
          <span className="text-xs text-slate-400">{t("legend")}</span>
        </div>
        <CanvasGrid canvas={current.canvas.sections} />
        <div data-testid="version-chain" className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="font-semibold">{t("previous")}:</span>
          {chain.map((v, i) => (
            <span key={v.version} className="inline-flex items-center gap-1.5">
              {i > 0 ? <ArrowLeft className="size-3 text-slate-300" aria-hidden /> : null}
              <button onClick={() => setSelected(v.version)} className={cn("rounded-lg px-2 py-1 font-medium transition-colors hover:bg-slate-100", v.version === current.version && "bg-indigo-50 text-indigo-800")}>
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
  const block = (section: keyof CanvasSections) => {
    const cards = (canvas[section] as CanvasCard[] | undefined) ?? []
    const { icon, accent } = PLACE[section]
    const a = ACCENT[accent]
    return (
      <div key={section} data-section={section} className={cn("flex flex-col gap-2.5 rounded-2xl border p-3.5", a.soft, a.ring)}>
        <h4 className={cn("flex items-center gap-2 text-xs font-bold uppercase tracking-wider", a.text)}>
          <IconBadge icon={icon} accent={accent} className="size-6 shrink-0 rounded-lg" /> {t(`sections.${section}`)}
        </h4>
        {cards.length === 0 ? <p className="text-xs text-slate-400">{t("empty")}</p> : null}
        <ul className="space-y-2">
          {cards.map((card) => {
            const marker = card.errc_marker ? MARKER[card.errc_marker] : null
            return (
              <li
                key={card.id}
                data-card={card.id}
                data-marker={card.errc_marker ?? undefined}
                className={cn("rounded-xl border bg-white p-2.5 text-[13px] leading-snug text-slate-800 shadow-sm shadow-slate-200/50", marker ? marker.card : "border-white")}
              >
                {marker && card.errc_marker ? (
                  <Badge tone={marker.tone} className="mb-1.5" data-testid="errc-marker">
                    <marker.icon aria-hidden />
                    {t(`markers.${card.errc_marker}`)}
                  </Badge>
                ) : null}
                <p>{card.text}</p>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  return (
    <div className="space-y-3" data-testid="canvas-grid">
      <div className="grid items-start gap-3 md:grid-cols-2 lg:grid-cols-5">
        {COLUMNS.map((column) => (
          <div key={column[0]} className="space-y-3">{column.map(block)}</div>
        ))}
      </div>
      <div className="grid items-start gap-3 md:grid-cols-2">{BOTTOM.map((column) => column.map(block))}</div>
    </div>
  )
}
