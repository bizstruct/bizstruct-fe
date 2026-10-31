"use client"

import { Blocks, Coins, Gem, Lightbulb, ShieldAlert, ThumbsDown, ThumbsUp, Users, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import type { ProjectView } from "@/lib/mappers/project"
import { cn } from "@/lib/utils"
import { ACCENT, humanize, IconBadge, NotReady, Panel, Reveal, Section, type Accent } from "../primitives"
import { CanvasPicker } from "./canvas-view"

const CLUSTER: Record<string, { icon: LucideIcon; accent: Accent }> = {
  value_proposition: { icon: Gem, accent: "indigo" },
  cost_revenue: { icon: Coins, accent: "amber" },
  infrastructure: { icon: Blocks, accent: "sky" },
  customer_interface: { icon: Users, accent: "violet" },
}

export function SwotView({ view, flowIndex, onFlow }: { view: ProjectView; flowIndex: number; onFlow: (i: number) => void }) {
  const t = useTranslations("Views.swot")
  const tp = useTranslations("Project")
  const flow = view.canvases[Math.min(flowIndex, view.canvases.length - 1)]
  const withSwot = flow?.versions.filter((v) => v.swot) ?? []
  if (!flow || withSwot.length === 0) return <NotReady message={tp("notReady")} />

  // Only the final version is shown (else the latest); the loop's earlier steps are not part of the client view.
  const current = withSwot.find((v) => v.version === flow.finalVersion) ?? withSwot[withSwot.length - 1]
  const swot = current.swot!

  return (
    <div className="space-y-5">
      <CanvasPicker flows={view.canvases} value={flowIndex} onChange={onFlow} />

      <div className="grid gap-4 lg:grid-cols-2" data-testid="swot-clusters">
        {swot.clusters.map((cluster, n) => {
          const { icon, accent } = CLUSTER[cluster.cluster] ?? { icon: Gem, accent: "slate" as Accent }
          const a = ACCENT[accent]
          return (
            <Reveal key={`${current.version}-${cluster.cluster}`} delay={n * 0.06}>
              <Panel data-cluster={cluster.cluster} className="h-full space-y-5">
                <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                  <IconBadge icon={icon} accent={accent} /> {t(`clusters.${cluster.cluster}`)}
                </h3>

                <Section title={t("axis")} icon={ThumbsUp} accent="emerald">
                  <AxisChart scores={cluster.axis_statements.map((x) => x.score)} label={t("score")} />
                  <ul className="space-y-2.5">
                    {cluster.axis_statements.map((axis, i) => (
                      <li key={i} className="space-y-1.5 rounded-xl border border-slate-200/80 p-3 text-sm leading-relaxed">
                        <p className="flex gap-2"><ThumbsUp className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden /><span><span className="font-semibold text-emerald-700">{t("positive")}: </span>{axis.positive_statement}</span></p>
                        <p className="flex gap-2"><ThumbsDown className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden /><span><span className="font-semibold text-red-700">{t("negative")}: </span>{axis.negative_statement}</span></p>
                        <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
                          <Badge tone={axis.score >= 0 ? "success" : "danger"}>{t("score")} {axis.score}</Badge>
                          <Badge>{t("importance")} {axis.importance}</Badge>
                          <Badge>{t("certainty")} {axis.certainty}</Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title={t("opportunities")} icon={Lightbulb} accent="amber">
                  <ul className="space-y-2">
                    {cluster.opportunities.map((o, i) => (
                      <li key={i} className={cn("flex items-start justify-between gap-3 rounded-xl border p-3 text-sm leading-relaxed text-slate-800", a.soft, a.ring)}>
                        <span>{o.text}</span>
                        <Badge tone="success">{o.score}</Badge>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title={t("catalog")} icon={ShieldAlert} accent="red">
                  <ul className="space-y-3" data-testid="threat-catalog">
                    {cluster.threats.map((threat) => (
                      <li key={threat.question} className="space-y-1 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{humanize(threat.question)}</span>
                          <span className="flex items-center gap-2">
                            <span aria-hidden className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                              <span className={cn("block h-full rounded-full", threat.score >= 4 ? "bg-red-500" : threat.score === 3 ? "bg-amber-500" : "bg-slate-400")} style={{ width: `${(threat.score / 5) * 100}%` }} />
                            </span>
                            <Badge tone={threat.score >= 4 ? "danger" : "warning"}>{threat.score}</Badge>
                          </span>
                        </div>
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
    </div>
  )
}

/** The axis scores of a cluster as bars around zero (-5 = very negative, 5 = very positive). */
function AxisChart({ scores, label }: { scores: number[]; label: string }) {
  const data = scores.map((score, i) => ({ name: `#${i + 1}`, score }))
  return (
    <div className="h-36 w-full" role="img" aria-label={`${label}: ${scores.join(", ")}`}>
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 320, height: 144 }}>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--color-slate-400)" }} />
          <YAxis domain={[-5, 5]} ticks={[-5, 0, 5]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--color-slate-400)" }} />
          <ReferenceLine y={0} stroke="var(--color-slate-300)" />
          <Tooltip cursor={{ fill: "var(--color-slate-100)" }} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-slate-200)", background: "var(--color-white)", color: "var(--color-slate-800)", fontSize: 12 }} formatter={(value) => [value, label]} />
          <Bar dataKey="score" radius={[6, 6, 6, 6]} maxBarSize={36} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.score >= 0 ? "var(--color-emerald-500)" : "var(--color-red-500)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
