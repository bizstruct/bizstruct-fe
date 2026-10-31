"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Lightbulb, Plus, ShieldAlert, ThumbsDown, ThumbsUp, X, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { cn } from "@/lib/utils"
import type { ErrcMove } from "@/types/domain/errc"
import { BLOCK, humanize, IconBadge, NotReady, Panel, Reveal, UnderlineTabs } from "../primitives"
import { CanvasPicker } from "./canvas-view"

const ACTION: Record<ErrcMove["action"], LucideIcon> = { eliminate: X, reduce: ArrowDown, raise: ArrowUp, create: Plus }

type Part = "swot" | "errc"
type Level = "high" | "medium" | "low"

/** One entry of a quadrant; `weight` only orders the entries, the reader sees the level. */
interface Entry {
  text: string
  tag: string
  level: Level
  weight: number
  title: string
}

/** A rating becomes a word: the top fifth is high, up to the middle is low (1-10: 8+ high, 5-7 medium; 1-5: 4+ high, 3 medium). */
const levelOf = (value: number, max: number): Level => (value / max >= 0.8 ? "high" : value / max > 0.4 ? "medium" : "low")

/** A quadrant shows this many entries until the reader asks for all of them, so the four blocks stay about equal. */
const PREVIEW = 5

export function SwotView({ view, flowIndex, onFlow }: { view: ProjectView; flowIndex: number; onFlow: (i: number) => void }) {
  const t = useTranslations("Views.swot")
  const tp = useTranslations("Project")
  const [part, setPart] = useState<Part>("swot")
  const flow = view.canvases[Math.min(flowIndex, view.canvases.length - 1)]
  const withSwot = flow?.versions.filter((v) => v.swot) ?? []
  if (!flow || withSwot.length === 0) return <NotReady message={tp("notReady")} />

  // Only the final version is shown (else the latest); the loop's earlier steps are not part of the client view.
  const current = withSwot.find((v) => v.version === flow.finalVersion) ?? withSwot[withSwot.length - 1]
  const swot = current.swot!
  // The ERRC moves that produced the shown version; version 1 has none, so then there is only SWOT.
  const errc = current.errcIn
  const active: Part = errc ? part : "swot"

  // The clusters are flattened into the four classic quadrants. Each axis lands on the side its score takes
  // (the other pole is its opposite wording and is dropped); importance and certainty become a word and a tooltip.
  const strengths: Entry[] = []
  const weaknesses: Entry[] = []
  const opportunities: Entry[] = []
  const threats: Entry[] = []
  for (const cluster of swot.clusters) {
    const tag = t(`clusters.${cluster.cluster}`)
    for (const a of cluster.axis_statements) {
      const entry = {
        text: a.score > 0 ? a.positive_statement : a.negative_statement,
        tag,
        level: levelOf(a.importance, 10),
        weight: a.importance + Math.abs(a.score) / 10,
        title: t("detail", { importance: a.importance, certainty: a.certainty }),
      }
      ;(a.score > 0 ? strengths : weaknesses).push(entry)
    }
    for (const o of cluster.opportunities) opportunities.push({ text: o.text, tag, level: levelOf(o.score, 5), weight: o.score, title: t("rating", { score: o.score }) })
    for (const th of cluster.threats) threats.push({ text: th.text, tag: humanize(th.question), level: levelOf(th.score, 5), weight: th.score, title: t("rating", { score: th.score }) })
  }
  for (const list of [strengths, weaknesses, opportunities, threats]) list.sort((a, b) => b.weight - a.weight)

  return (
    <div className="space-y-5">
      <CanvasPicker flows={view.canvases} value={flowIndex} onChange={onFlow} />

      {errc ? (
        <div className="border-b border-slate-200">
          <UnderlineTabs className="justify-center" label={t("part")} value={active} onChange={setPart} items={[{ id: "swot", label: "SWOT" }, { id: "errc", label: "ERRC" }]} />
        </div>
      ) : null}

      {active === "errc" && errc ? (
        <Reveal key="errc" className="space-y-4">
          <p className="text-center text-sm text-slate-500">{t("errcIntro")}</p>
          <ul className="grid gap-4 lg:grid-cols-2" data-testid="errc-moves">
            {errc.moves.map((move, i) => (
              <MoveCard key={i} move={move} />
            ))}
          </ul>
        </Reveal>
      ) : (
        <>
          <p className="text-center text-sm text-slate-500">{t("sorted")}</p>
          <div className="grid gap-4 md:grid-cols-2" data-testid="swot-quadrants">
            <Quadrant id="strengths" title={t("strengths")} icon={ThumbsUp} entries={strengths} delay={0} />
            <Quadrant id="weaknesses" title={t("weaknesses")} icon={ThumbsDown} entries={weaknesses} delay={0.06} />
            <Quadrant id="opportunities" title={t("opportunities")} icon={Lightbulb} entries={opportunities} delay={0.12} />
            <Quadrant id="threats" title={t("threats")} icon={ShieldAlert} entries={threats} delay={0.18} />
          </div>
        </>
      )}
    </div>
  )
}

function Quadrant({ id, title, icon, entries, delay }: { id: string; title: string; icon: LucideIcon; entries: Entry[]; delay: number }) {
  const t = useTranslations("Views.swot")
  const [open, setOpen] = useState(false)
  const hidden = entries.length - PREVIEW
  return (
    <Reveal delay={delay} className="h-full">
      <Panel data-quadrant={id} className="h-full space-y-4">
        <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
          <IconBadge icon={icon} accent="indigo" /> {title}
        </h3>
        {entries.length > 0 ? <EntryList entries={open ? entries : entries.slice(0, PREVIEW)} /> : null}
        {hidden > 0 ? (
          <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            {open ? t("showLess") : t("showAll", { n: entries.length })}
          </button>
        ) : null}
      </Panel>
    </Reveal>
  )
}

function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ul className="space-y-2.5">
      {entries.map((entry, i) => (
        <li key={i} className={cn(BLOCK, "space-y-1.5")}>
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-400">{entry.tag}</span>
            <LevelChip level={entry.level} title={entry.title} />
          </div>
          <p>{entry.text}</p>
        </li>
      ))}
    </ul>
  )
}

/** Three dots and a word; the exact figures sit in the tooltip for whoever wants them. */
function LevelChip({ level, title }: { level: Level; title: string }) {
  const t = useTranslations("Views.swot")
  const filled = { high: 3, medium: 2, low: 1 }[level]
  return (
    <span title={title} className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-600">
      <span aria-hidden className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={cn("size-1.5 rounded-full", i < filled ? "bg-indigo-400" : "bg-slate-300/70")} />
        ))}
      </span>
      {t(`levels.${level}`)}
    </span>
  )
}

function MoveCard({ move }: { move: ErrcMove }) {
  const t = useTranslations("Views.swot")
  const tc = useTranslations("Views.canvas")
  const Icon = ACTION[move.action]
  const focus = move.new_text ?? move.target_card_text
  return (
    <li data-move={move.action} className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-sm leading-relaxed shadow-sm shadow-slate-200/40">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <IconBadge icon={Icon} accent="indigo" className="size-6 shrink-0 rounded-lg" />
        <span className="text-indigo-600">{t(`actions.${move.action}`)}</span>
        <span aria-hidden className="text-slate-300">·</span>
        <span className="text-slate-500">{tc(`sections.${move.target_section}`)}</span>
      </div>
      {move.new_text && move.target_card_text ? <p className="text-slate-500">{move.target_card_text}</p> : null}
      {/* The filled block is what the move is about: the new text, or for an elimination the card that goes away. */}
      {focus ? <p data-focus className={cn(BLOCK, "font-medium", move.new_text ? "text-slate-900" : "text-slate-500 line-through")}>{focus}</p> : null}
      <p className="text-slate-700"><span className="font-semibold text-slate-900">{t("rationale")}: </span>{move.rationale}</p>
      <p className="text-slate-500"><span className="font-semibold text-slate-600">{t("impact")}: </span>{move.opposite_side_impact}</p>
    </li>
  )
}
