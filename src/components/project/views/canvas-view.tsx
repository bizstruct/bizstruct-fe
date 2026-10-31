"use client"

import { useState } from "react"
import { Activity, ArrowDown, ArrowUp, Boxes, Check, ChevronDown, Coins, Gem, Handshake, Heart, History, Plus, Star, Trash2, Truck, Users, Wallet, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { CanvasFlow, CanvasVersionView, ProjectView } from "@/lib/mappers/project"
import type { CanvasCard, CanvasSections } from "@/types/domain/canvas"
import { IconBadge, NotReady, SegmentedControl, type Accent } from "../primitives"

type Marker = NonNullable<CanvasCard["errc_marker"]>
const MARKER: Record<Marker, { tone: React.ComponentProps<typeof Badge>["tone"]; icon: LucideIcon; card: string }> = {
  eliminate: { tone: "danger", icon: Trash2, card: "border-red-400/70" },
  reduce: { tone: "warning", icon: ArrowDown, card: "border-amber-400/70" },
  raise: { tone: "success", icon: ArrowUp, card: "border-emerald-400/70" },
  create: { tone: "info", icon: Plus, card: "border-sky-400/70" },
}

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
  return <SegmentedControl id="canvas-flow" value={value} onChange={onChange} items={flows.map((f, i) => ({ id: i, label: t("canvasN", { n: i + 1 }) }))} />
}

/**
 * The versions of a canvas or SWOT are the steps of the generation loop; the user is shown the final one and
 * the others stay behind this quiet button. With one version there is nothing to open.
 */
export function VersionHistory({ versions, value, defaultVersion, onChange }: { versions: CanvasVersionView[]; value: number; defaultVersion: number; onChange: (version: number) => void }) {
  const t = useTranslations("Views.canvas")
  if (versions.length <= 1) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={t("history")} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">
        <History aria-hidden className="size-3.5" />
        {value === defaultVersion ? t("history") : `V${value}`}
        <ChevronDown aria-hidden className="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {versions.map((v) => (
          <DropdownMenuItem key={v.version} aria-label={`${t("version")} ${v.version}`} aria-current={v.version === value ? "true" : undefined} onSelect={() => onChange(v.version)}>
            <span className="flex-1">V{v.version}</span>
            {v.isFinal ? (
              <Badge tone="final" data-testid="final-badge" className="gap-0.5">
                <Star className="fill-current" aria-hidden />
                {t("final")}
              </Badge>
            ) : null}
            {v.version === value ? <Check aria-hidden className="size-3.5 text-indigo-500" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const railItem = "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
const railActive = "bg-indigo-500/10 text-slate-900 dark:bg-indigo-400/[0.22]"
const railIdle = "text-slate-500 hover:bg-slate-100 hover:text-slate-800"

/** The canvases (only when Patterns split them) and the quiet version history, in one row above the board. */
function CanvasRail({ flows, flowIndex, onFlow, versions, value, defaultVersion, onChange }: { flows: CanvasFlow[]; flowIndex: number; onFlow: (index: number) => void; versions: CanvasVersionView[]; value: number; defaultVersion: number; onChange: (version: number) => void }) {
  const t = useTranslations("Views.canvas")
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {flows.length > 1 ? (
        <div role="tablist" className="flex flex-wrap gap-1">
          {flows.map((_, i) => (
            <button key={i} role="tab" type="button" aria-selected={i === flowIndex} onClick={() => onFlow(i)} className={cn(railItem, i === flowIndex ? railActive : railIdle)}>
              {t("canvasN", { n: i + 1 })}
            </button>
          ))}
        </div>
      ) : null}
      <VersionHistory versions={versions} value={value} defaultVersion={defaultVersion} onChange={onChange} />
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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {flow.segments.length > 1 ? <p className="text-sm text-slate-500">{t("covers", { segments: flow.segments.map((s) => s.label).join(", ") })}</p> : <span />}
        <CanvasRail
          flows={view.canvases}
          flowIndex={flowIndex}
          onFlow={(i) => { onFlow(i); setSelected(null) }}
          versions={flow.versions}
          value={current.version}
          defaultVersion={defaultVersion}
          onChange={setSelected}
        />
      </div>
      <CanvasGrid canvas={current.canvas.sections} showMarkers={current.version !== defaultVersion} />
    </div>
  )
}

/** The ERRC markers say what the loop changed to reach a version: shown when the user looks at an earlier one, not on the final canvas. */
function CanvasGrid({ canvas, showMarkers }: { canvas: CanvasSections; showMarkers: boolean }) {
  const t = useTranslations("Views.canvas")
  const block = (section: keyof CanvasSections) => {
    const cards = (canvas[section] as CanvasCard[] | undefined) ?? []
    const { icon, accent } = PLACE[section]
    return (
      <div key={section} data-section={section} className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/40">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <IconBadge icon={icon} accent={accent} className="size-6 shrink-0 rounded-lg" /> {t(`sections.${section}`)}
        </h4>
        {cards.length === 0 ? <p className="text-xs text-slate-400">{t("empty")}</p> : null}
        <ul className="space-y-2">
          {cards.map((card) => {
            const marker = showMarkers && card.errc_marker ? MARKER[card.errc_marker] : null
            return (
              <li
                key={card.id}
                data-card={card.id}
                data-marker={card.errc_marker ?? undefined}
                className={cn("rounded-lg border p-3 text-[13px] leading-snug text-slate-800", marker ? marker.card : "border-transparent bg-slate-100/70")}
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
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3" data-testid="canvas-grid">
      {BLOCKS.map(block)}
    </div>
  )
}
