"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { ProjectView } from "@/lib/mappers/project"
import { Fact, humanize, NotReady, Panel, Section } from "../primitives"

export function PatternsView({ view }: { view: ProjectView }) {
  const t = useTranslations("Views.patterns")
  const tp = useTranslations("Project")
  const patterns = view.patterns
  if (!patterns) return <NotReady message={tp("notReady")} />

  // Pairs and groups name empathy maps by artifact id; show the segment label instead.
  const labelOf = (artifactId: string): string => view.segments.find((s) => s.empathyMap?.id === artifactId)?.label ?? artifactId

  return (
    <div className="space-y-4">
      <Panel className="space-y-4">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Fact label={t("branch")}>{t(patterns.branch_decision)}</Fact>
        </dl>
        <Section title={t("groups")}>
          <ul className="space-y-2" data-testid="pattern-groups">
            {patterns.groups.map((group, index) => (
              <li key={group.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-900">#{index + 1}</span>
                  <Badge tone="accent">{humanize(group.relation_type)}</Badge>
                </div>
                <p className="mt-1 text-slate-700">{group.empathy_map_ids.map(labelOf).join(", ")}</p>
              </li>
            ))}
          </ul>
        </Section>
      </Panel>

      <Panel className="space-y-3">
        <Section title={t("tags")}>
          {patterns.pattern_tags.length === 0 ? (
            <p className="text-sm text-slate-400">{t("noTags")}</p>
          ) : (
            <ul className="space-y-2" data-testid="pattern-tags">
              {patterns.pattern_tags.map((tag) => (
                <li key={tag.pattern} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <Badge tone="info">{humanize(tag.pattern)}</Badge>
                  {tag.subtype ? <Badge className="ml-1.5">{humanize(tag.subtype)}</Badge> : null}
                  <p className="mt-1.5 text-slate-700"><span className="font-medium">{t("rationale")}: </span>{tag.rationale}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </Panel>

      <Panel className="space-y-3">
        <Section title={t("pairs")}>
          {patterns.pairwise_scores.length === 0 ? (
            <p className="text-sm text-slate-400">{t("noPairs")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" data-testid="pair-scores">
                <thead className="text-xs uppercase text-slate-400">
                  <tr>
                    <th className="py-1 pr-4 font-medium">{t("segments")}</th>
                    <th className="py-1 pr-4 font-medium">{t("synergy")}</th>
                    <th className="py-1 font-medium">{t("conflict")}</th>
                  </tr>
                </thead>
                <tbody>
                  {patterns.pairwise_scores.map((pair, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="py-1.5 pr-4 text-slate-800">
                        {labelOf(pair.segment_pair.empathy_map_id_a)} / {labelOf(pair.segment_pair.empathy_map_id_b)}
                      </td>
                      <td className="py-1.5 pr-4">{pair.synergy}</td>
                      <td className="py-1.5">{pair.conflict}</td>
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
