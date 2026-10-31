"use client"

import { Activity, Boxes, Coins, Gem, Handshake, Heart, Truck, Users, Wallet, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { CanvasFlow, ProjectView } from "@/lib/mappers/project"
import type { CanvasCard, CanvasSections } from "@/types/domain/canvas"
import { BLOCK, NotReady, Section, UnderlineTabs, type Accent } from "../primitives"

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
 * The nine blocks in the classic reading order (left to right, top to bottom) on an even 3x3 grid: wide
 * blocks keep long card texts short, and each row stretches to its tallest block so neighbours match.
 */
const BLOCKS: (keyof CanvasSections)[] = [
  "key_partnerships", "key_activities", "key_resources",
  "value_propositions", "customer_relationships", "channels",
  "customer_segments", "cost_structure", "revenue_streams",
]

/** One selector per canvas flow (several only for a split Patterns), shared by Canvas, SWOT, Story, Future and Pitch. */
export function CanvasPicker({ flows, value, onChange }: { flows: CanvasFlow[]; value: number; onChange: (index: number) => void }) {
  const t = useTranslations("Views.canvas")
  if (flows.length <= 1) return null
  return (
    <div className="border-b border-slate-200">
      <UnderlineTabs className="justify-center" value={value} onChange={onChange} items={flows.map((f, i) => ({ id: i, label: t("canvasN", { n: i + 1 }) }))} />
    </div>
  )
}

export function CanvasView({ view, flowIndex, onFlow }: { view: ProjectView; flowIndex: number; onFlow: (i: number) => void }) {
  const t = useTranslations("Views.canvas")
  const tp = useTranslations("Project")
  const flow = view.canvases[Math.min(flowIndex, view.canvases.length - 1)]
  if (!flow || flow.versions.length === 0) return <NotReady message={tp("notReady")} />

  // The loop's earlier versions are not shown: the final one, else the latest (see `finalVersion`).
  const shown = flow.versions.find((v) => v.version === flow.finalVersion) ?? flow.versions[flow.versions.length - 1]
  const covers = flow.segments.length > 1 ? t("covers", { segments: flow.segments.map((s) => s.label).join(", ") }) : null

  return (
    <div className="space-y-3">
      {view.canvases.length > 1 || covers ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {covers ? <p className="text-sm text-slate-500">{covers}</p> : <span />}
          <CanvasPicker flows={view.canvases} value={flowIndex} onChange={onFlow} />
        </div>
      ) : null}
      <CanvasGrid canvas={shown.canvas.sections} />
    </div>
  )
}

function CanvasGrid({ canvas }: { canvas: CanvasSections }) {
  const t = useTranslations("Views.canvas")
  const block = (section: keyof CanvasSections) => {
    const cards = (canvas[section] as CanvasCard[] | undefined) ?? []
    const { icon, accent } = PLACE[section]
    return (
      <div key={section} data-section={section} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/40">
        <Section title={t(`sections.${section}`)} icon={icon} accent={accent}>
          {cards.length === 0 ? <p className="text-xs text-slate-400">{t("empty")}</p> : null}
          <ul className="space-y-2">
            {cards.map((card) => (
              <li key={card.id} data-card={card.id} className={BLOCK}>
                <p>{card.text}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    )
  }
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3" data-testid="canvas-grid">
      {BLOCKS.map(block)}
    </div>
  )
}
