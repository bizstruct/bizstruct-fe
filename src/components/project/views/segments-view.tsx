"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ProjectView, SegmentView } from "@/lib/mappers/project"
import { BulletList, Fact, humanize, NotReady, Panel, Section } from "../primitives"
import { RowStatusChip } from "../status-chip"

export function SegmentsView({ view }: { view: ProjectView }) {
  const tp = useTranslations("Project")
  const t = useTranslations("Views.empathy")
  const [selected, setSelected] = useState(0)
  if (view.segments.length === 0) return <NotReady message={tp("notReady")} />
  const segment = view.segments[Math.min(selected, view.segments.length - 1)]

  return (
    <div className="space-y-4">
      {view.segments.length > 1 ? (
        <div role="tablist" aria-label={t("segment")} className="flex flex-wrap gap-2">
          {view.segments.map((s, i) => (
            <button
              key={s.empathyRow.id}
              role="tab"
              aria-selected={i === selected}
              onClick={() => setSelected(i)}
              className={cn("rounded-lg border px-3 py-1.5 text-sm", i === selected ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : null}
      <EmpathyPanel segment={segment} />
      <ScenarioPanel segment={segment} />
      <IdeationPanel segment={segment} />
    </div>
  )
}

function EmpathyPanel({ segment }: { segment: SegmentView }) {
  const t = useTranslations("Views.empathy")
  const tp = useTranslations("Project")
  const map = segment.empathyMap
  if (!map) return <NotReady message={tp("notReady")} />
  const quadrants: [string, readonly string[]][] = [
    [t("sees"), map.sees],
    [t("hears"), map.hears],
    [t("thinksAndFeels"), map.thinks_and_feels],
    [t("saysAndDoes"), map.says_and_does],
    [t("pains"), map.pains],
    [t("gains"), map.gains],
  ]
  return (
    <Panel className="space-y-4" data-testid="empathy-panel">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold text-slate-900">{map.persona_name}</h3>
        <RowStatusChip status={segment.empathyRow.status} />
      </div>
      <p className="text-sm text-slate-600">{map.persona_demographics}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quadrants.map(([title, items]) => (
          <Section key={title} title={title}>
            <BulletList items={items} />
          </Section>
        ))}
      </div>
    </Panel>
  )
}

function ScenarioPanel({ segment }: { segment: SegmentView }) {
  const t = useTranslations("Views.scenario")
  const tp = useTranslations("Project")
  const s = segment.scenario
  if (!s) return <NotReady message={tp("notReady")} />
  return (
    <Panel className="space-y-4" data-testid="scenario-panel">
      <h3 className="text-base font-semibold text-slate-900">{t("title")}</h3>
      <Section title={t("narrative")}>
        <p className="text-sm leading-relaxed text-slate-700">{s.situation_narrative}</p>
      </Section>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {s.channel_type ? <Fact label={t("channel")}>{humanize(s.channel_type)}</Fact> : null}
        {s.relationship_type ? <Fact label={t("relationship")}>{humanize(s.relationship_type)}</Fact> : null}
        {s.pricing_tier ? <Fact label={t("pricing")}>{humanize(s.pricing_tier)}</Fact> : null}
        {s.interdependence_signal !== undefined ? (
          <Fact label={t("interdependence")}>
            <Badge tone={s.interdependence_signal ? "accent" : "neutral"}>{s.interdependence_signal ? t("yes") : t("no")}</Badge>
          </Fact>
        ) : null}
      </dl>
      <Section title={t("questions")}>
        <BulletList items={s.open_questions} />
      </Section>
    </Panel>
  )
}

function IdeationPanel({ segment }: { segment: SegmentView }) {
  const t = useTranslations("Views.ideation")
  const tp = useTranslations("Project")
  const i = segment.ideation
  if (!i) return <NotReady message={tp("notReady")} />
  return (
    <Panel className="space-y-4" data-testid="ideation-panel">
      <h3 className="text-base font-semibold text-slate-900">{t("title")}</h3>
      <Section title={t("epicenter")}>
        <div className="flex flex-wrap gap-1.5">
          {i.epicenter.tags.map((tag) => (
            <Badge key={tag} tone="accent">{humanize(tag)}</Badge>
          ))}
        </div>
        <p className="text-sm text-slate-700">{i.epicenter.rationale}</p>
      </Section>
      <Section title={t("whatIf")}>
        <BulletList items={i.what_if_questions} />
      </Section>
    </Panel>
  )
}
