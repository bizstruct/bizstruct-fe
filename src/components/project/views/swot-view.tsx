"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { ProjectView } from "@/lib/mappers/project"
import { humanize, NotReady, Panel, Section } from "../primitives"
import { CanvasPicker, VersionSelector } from "./canvas-view"

export function SwotView({ view, flowIndex, onFlow }: { view: ProjectView; flowIndex: number; onFlow: (i: number) => void }) {
  const t = useTranslations("Views.swot")
  const tc = useTranslations("Views.canvas")
  const tp = useTranslations("Project")
  const flow = view.canvases[Math.min(flowIndex, view.canvases.length - 1)]
  const [selected, setSelected] = useState<number | null>(null)
  const withSwot = flow?.versions.filter((v) => v.swot) ?? []
  if (!flow || withSwot.length === 0) return <NotReady message={tp("notReady")} />

  const defaultVersion = flow.finalVersion ?? withSwot[withSwot.length - 1].version
  const current = withSwot.find((v) => v.version === (selected ?? defaultVersion)) ?? withSwot[withSwot.length - 1]
  const swot = current.swot!

  return (
    <div className="space-y-4">
      <CanvasPicker flows={view.canvases} value={flowIndex} onChange={(i) => { onFlow(i); setSelected(null) }} />
      <VersionSelector versions={withSwot} value={current.version} onChange={setSelected} />

      <div className="grid gap-4 lg:grid-cols-2" data-testid="swot-clusters">
        {swot.clusters.map((cluster) => (
          <Panel key={cluster.cluster} data-cluster={cluster.cluster} className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">{t(`clusters.${cluster.cluster}`)}</h3>

            <Section title={t("axis")}>
              <ul className="space-y-2">
                {cluster.axis_statements.map((axis, i) => (
                  <li key={i} className="rounded-lg border border-slate-200 p-2 text-sm">
                    <p><span className="font-medium text-emerald-700">{t("positive")}: </span>{axis.positive_statement}</p>
                    <p className="mt-1"><span className="font-medium text-red-700">{t("negative")}: </span>{axis.negative_statement}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
                      <Badge>{t("score")} {axis.score}</Badge>
                      <Badge>{t("importance")} {axis.importance}</Badge>
                      <Badge>{t("certainty")} {axis.certainty}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title={t("opportunities")}>
              <ul className="space-y-1.5">
                {cluster.opportunities.map((o, i) => (
                  <li key={i} className="flex items-start justify-between gap-2 text-sm text-slate-700">
                    <span>{o.text}</span>
                    <Badge tone="success">{o.score}</Badge>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title={t("catalog")}>
              <ul className="space-y-1.5" data-testid="threat-catalog">
                {cluster.threats.map((threat) => (
                  <li key={threat.question} className="text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{humanize(threat.question)}</span>
                      <Badge tone="warning">{threat.score}</Badge>
                    </div>
                    <p className="text-slate-700">{threat.text}</p>
                  </li>
                ))}
              </ul>
            </Section>
          </Panel>
        ))}
      </div>

      <Panel className="space-y-3" data-testid="errc-moves">
        {current.errcOut ? (
          <>
            <h3 className="text-base font-semibold text-slate-900">{t("movesFrom", { from: current.errcOut.from_version, to: current.errcOut.to_version })}</h3>
            <ul className="space-y-2">
              {current.errcOut.moves.map((move, i) => (
                <li key={i} className="rounded-lg border border-slate-200 p-3 text-sm" data-action={move.action}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="accent">{tc(`markers.${move.action}`)}</Badge>
                    <span className="text-xs text-slate-500">{tc(`sections.${move.target_section}`)}</span>
                  </div>
                  {move.target_card_text ? <p className="mt-1.5 text-slate-600"><span className="font-medium">{t("target")}: </span>{move.target_card_text}</p> : null}
                  {move.new_text ? <p className="mt-1 text-slate-800"><span className="font-medium">{t("newText")}: </span>{move.new_text}</p> : null}
                  <p className="mt-1 text-slate-600"><span className="font-medium">{t("impact")}: </span>{move.opposite_side_impact}</p>
                  <p className="mt-1 text-slate-600"><span className="font-medium">{t("rationale")}: </span>{move.rationale}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-slate-400">{t("noMoves")}</p>
        )}
      </Panel>
    </div>
  )
}
