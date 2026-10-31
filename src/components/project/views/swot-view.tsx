"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Blocks, Coins, Gem, Lightbulb, Plus, ShieldAlert, ThumbsDown, ThumbsUp, Users, X, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { cn } from "@/lib/utils"
import type { ErrcMove } from "@/types/domain/errc"
import { humanize, IconBadge, NotReady, Panel, Reveal, Section, UnderlineTabs, type Accent } from "../primitives"
import { CanvasPicker } from "./canvas-view"

const CLUSTER: Record<string, { icon: LucideIcon; accent: Accent }> = {
  value_proposition: { icon: Gem, accent: "indigo" },
  cost_revenue: { icon: Coins, accent: "amber" },
  infrastructure: { icon: Blocks, accent: "sky" },
  customer_interface: { icon: Users, accent: "violet" },
}

const ACTION: Record<ErrcMove["action"], LucideIcon> = { eliminate: X, reduce: ArrowDown, raise: ArrowUp, create: Plus }

type Part = "swot" | "errc"

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
      <div className="grid gap-4 lg:grid-cols-2" data-testid="swot-clusters">
        {swot.clusters.map((cluster, n) => {
          const { icon, accent } = CLUSTER[cluster.cluster] ?? { icon: Gem, accent: "slate" as Accent }
          return (
            <Reveal key={`${current.version}-${cluster.cluster}`} delay={n * 0.06}>
              <Panel data-cluster={cluster.cluster} className="h-full space-y-5">
                <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                  <IconBadge icon={icon} accent={accent} /> {t(`clusters.${cluster.cluster}`)}
                </h3>

                <Section title={t("axis")} icon={ThumbsUp} accent="emerald">
                  <ul className="space-y-2.5">
                    {cluster.axis_statements.map((axis, i) => (
                      <li key={i} className="space-y-1.5 rounded-xl border border-slate-200/80 p-3 text-sm leading-relaxed">
                        <p className="flex gap-2"><ThumbsUp className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden /><span><span className="font-semibold text-emerald-700">{t("positive")}: </span>{axis.positive_statement}</span></p>
                        <p className="flex gap-2"><ThumbsDown className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden /><span><span className="font-semibold text-red-700">{t("negative")}: </span>{axis.negative_statement}</span></p>
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <Meter label={t("score")} value={axis.score} max={5} />
                          <Meter label={t("importance")} value={axis.importance} max={10} />
                          <Meter label={t("certainty")} value={axis.certainty} max={10} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title={t("opportunities")} icon={Lightbulb} accent="amber">
                  <ul className="space-y-2">
                    {cluster.opportunities.map((o, i) => (
                      <li key={i} className="space-y-2 rounded-xl border border-slate-200/80 p-3 text-sm leading-relaxed text-slate-800">
                        <p>{o.text}</p>
                        <Meter value={o.score} max={5} />
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title={t("catalog")} icon={ShieldAlert} accent="red">
                  <ul className="space-y-3" data-testid="threat-catalog">
                    {cluster.threats.map((threat) => (
                      <li key={threat.question} className="space-y-1.5 text-sm">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{humanize(threat.question)}</span>
                        <Meter value={threat.score} max={5} />
                        <p className="leading-relaxed text-slate-700">{threat.text}</p>
                      </li>
                    ))}
                  </ul>
                </Section>
              </Panel>
            </Reveal>
          )
        })}
      </div>
      )}
    </div>
  )
}

function MoveCard({ move }: { move: ErrcMove }) {
  const t = useTranslations("Views.swot")
  const tc = useTranslations("Views.canvas")
  const Icon = ACTION[move.action]
  return (
    <li data-move={move.action} className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-sm leading-relaxed shadow-sm shadow-slate-200/40">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <IconBadge icon={Icon} accent="indigo" className="size-6 shrink-0 rounded-lg" />
        <span className="text-indigo-600">{t(`actions.${move.action}`)}</span>
        <span aria-hidden className="text-slate-300">·</span>
        <span className="text-slate-500">{tc(`sections.${move.target_section}`)}</span>
      </div>
      {move.target_card_text ? <p className={cn("text-slate-500", move.action === "eliminate" && "line-through")}>{move.target_card_text}</p> : null}
      {move.new_text ? <p className="font-medium text-slate-900">{move.new_text}</p> : null}
      <p className="text-slate-700"><span className="font-semibold text-slate-900">{t("rationale")}: </span>{move.rationale}</p>
      <p className="text-slate-500"><span className="font-semibold text-slate-600">{t("impact")}: </span>{move.opposite_side_impact}</p>
    </li>
  )
}

/** A rating as a thin line that fills in proportion: `4/5`. A negative rating fills the same way, in red, and shows its sign. */
function Meter({ label, value, max, className }: { label?: string; value: number; max: number; className?: string }) {
  const negative = value < 0
  const shown = negative ? `\u2212${Math.abs(value)}` : String(value)
  return (
    <div className={cn("space-y-1", className)} role="meter" aria-label={label} aria-valuenow={value} aria-valuemin={negative ? -max : 0} aria-valuemax={max}>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        {label ? <span className="text-slate-500">{label}</span> : <span />}
        <span className="font-medium tabular-nums text-slate-700">{shown}<span className="text-slate-400">/{max}</span></span>
      </div>
      <div aria-hidden className="h-1 overflow-hidden rounded-full bg-slate-200/70">
        <div className={cn("h-full rounded-full", negative ? "bg-red-400" : "bg-indigo-400")} style={{ width: `${(Math.abs(value) / max) * 100}%` }} />
      </div>
    </div>
  )
}
