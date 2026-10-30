"use client"

import { GitBranch, Layers, Link2, Tags } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { ProjectView } from "@/lib/mappers/project"
import { cn } from "@/lib/utils"
import { humanize, NotReady, Panel, Section } from "../primitives"

export function PatternsView({ view }: { view: ProjectView }) {
  const t = useTranslations("Views.patterns")
  const tp = useTranslations("Project")
  const patterns = view.patterns
  if (!patterns) return <NotReady message={tp("notReady")} />

  // Pairs and groups name empathy maps by artifact id; show the segment label instead.
  const labelOf = (artifactId: string): string => view.segments.find((s) => s.empathyMap?.id === artifactId)?.label ?? artifactId

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 border-l-4 border-l-indigo-500 bg-white p-5 sm:p-6">
        <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          <GitBranch className="size-6" />
        </span>
        <div>
          <p className="text-xs font-medium text-slate-500">{t("branch")}</p>
          <p className="text-xl font-medium text-slate-900">{t(patterns.branch_decision)}</p>
        </div>
      </div>

      <Panel className="space-y-4">
        <Section title={t("groups")} icon={Layers} accent="violet">
          <ul className="grid gap-3 md:grid-cols-2" data-testid="pattern-groups">
            {patterns.groups.map((group, index) => (
              <li key={group.id} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">#{index + 1}</span>
                  <Badge tone="accent">{humanize(group.relation_type)}</Badge>
                </div>
                <p className="mt-2 font-medium text-slate-800">{group.empathy_map_ids.map(labelOf).join(", ")}</p>
              </li>
            ))}
          </ul>
        </Section>
      </Panel>

      <Panel className="space-y-3">
        <Section title={t("tags")} icon={Tags} accent="sky">
          {patterns.pattern_tags.length === 0 ? (
            <p className="text-sm text-slate-400">{t("noTags")}</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2" data-testid="pattern-tags">
              {patterns.pattern_tags.map((tag) => (
                <li key={tag.pattern} className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 text-sm">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone="info" className="px-2.5 py-1 text-xs">{humanize(tag.pattern)}</Badge>
                    {tag.subtype ? <Badge className="px-2.5 py-1 text-xs">{humanize(tag.subtype)}</Badge> : null}
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-700"><span className="font-semibold">{t("rationale")}: </span>{tag.rationale}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </Panel>

      <Panel className="space-y-3">
        <Section title={t("pairs")} icon={Link2} accent="emerald">
          {patterns.pairwise_scores.length === 0 ? (
            <p className="text-sm text-slate-400">{t("noPairs")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" data-testid="pair-scores">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="py-2 pr-4 font-semibold">{t("segments")}</th>
                    <th className="py-2 pr-4 font-semibold">{t("synergy")}</th>
                    <th className="py-2 font-semibold">{t("conflict")}</th>
                  </tr>
                </thead>
                <tbody>
                  {patterns.pairwise_scores.map((pair, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="py-2.5 pr-4 font-medium text-slate-800">
                        {labelOf(pair.segment_pair.empathy_map_id_a)} / {labelOf(pair.segment_pair.empathy_map_id_b)}
                      </td>
                      <td className="py-2.5 pr-4"><ScoreMeter value={pair.synergy} max={5} tone="emerald" /></td>
                      <td className="py-2.5"><ScoreMeter value={pair.conflict} max={7} tone="red" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </Panel>
    </div>
  )
}

/** A number with a bar beside it; the domain scales are synergy 0..5 and conflict -7..0, so the bar shows the magnitude. */
function ScoreMeter({ value, max, tone }: { value: number; max: number; tone: "emerald" | "red" }) {
  return (
    <span className="flex items-center gap-2">
      <span className="w-5 font-semibold tabular-nums text-slate-800">{value}</span>
      <span aria-hidden className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
        <span className={cn("block h-full rounded-full", tone === "emerald" ? "bg-emerald-500" : "bg-red-500")} style={{ width: `${Math.min(100, (Math.abs(value) / max) * 100)}%` }} />
      </span>
    </span>
  )
}
