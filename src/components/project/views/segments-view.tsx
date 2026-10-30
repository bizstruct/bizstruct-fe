"use client"

import { useState } from "react"
import { Brain, Ear, Eye, Frown, Lightbulb, MessageCircle, Route, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { ProjectView, SegmentView } from "@/lib/mappers/project"
import { ACCENT, BulletList, Fact, humanize, IconBadge, NotReady, Panel, Reveal, Section, SegmentedControl, type Accent } from "../primitives"
import { RowStatusChip } from "../status-chip"

export function SegmentsView({ view }: { view: ProjectView }) {
  const tp = useTranslations("Project")
  const t = useTranslations("Views.empathy")
  const [selected, setSelected] = useState(0)
  if (view.segments.length === 0) return <NotReady message={tp("notReady")} />
  const index = Math.min(selected, view.segments.length - 1)
  const segment = view.segments[index]

  return (
    <div className="space-y-5">
      {view.segments.length > 1 ? (
        <SegmentedControl
          id="segments"
          label={t("segment")}
          value={index}
          onChange={setSelected}
          items={view.segments.map((s, i) => ({ id: i, label: s.label }))}
        />
      ) : null}
      <Reveal key={segment.empathyRow.id} className="space-y-5">
        <EmpathyPanel segment={segment} />
        <ScenarioPanel segment={segment} />
        <IdeationPanel segment={segment} />
      </Reveal>
    </div>
  )
}

const initials = (name: string): string =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")

function EmpathyPanel({ segment }: { segment: SegmentView }) {
  const t = useTranslations("Views.empathy")
  const tp = useTranslations("Project")
  const map = segment.empathyMap
  if (!map) return <NotReady message={tp("notReady")} />
  const quadrants: { title: string; items: readonly string[]; icon: typeof Eye; accent: Accent }[] = [
    { title: t("sees"), items: map.sees, icon: Eye, accent: "sky" },
    { title: t("hears"), items: map.hears, icon: Ear, accent: "violet" },
    { title: t("thinksAndFeels"), items: map.thinks_and_feels, icon: Brain, accent: "pink" },
    { title: t("saysAndDoes"), items: map.says_and_does, icon: MessageCircle, accent: "amber" },
  ]
  return (
    <Panel className="space-y-5 p-5 sm:p-6" data-testid="empathy-panel">
      <div className="flex flex-wrap items-center gap-4">
        <span aria-hidden className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 text-lg font-semibold text-indigo-700">
          {initials(map.persona_name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">{map.persona_name}</h3>
            <RowStatusChip status={segment.empathyRow.status} />
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{map.persona_demographics}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Highlight title={t("pains")} items={map.pains} icon={Frown} accent="red" />
        <Highlight title={t("gains")} items={map.gains} icon={Sparkles} accent="emerald" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quadrants.map(({ title, items, icon, accent }) => (
          <div key={title} className="rounded-2xl border border-slate-200/80 p-4">
            <Section title={title} icon={icon} accent={accent}>
              <BulletList items={items} accent={accent} />
            </Section>
          </div>
        ))}
      </div>
    </Panel>
  )
}

/** Pains and gains are what the rest of the pipeline is built on, so they get the loud colors. */
function Highlight({ title, items, icon, accent }: { title: string; items: readonly string[]; icon: typeof Eye; accent: Accent }) {
  const a = ACCENT[accent]
  return (
    <div className={`rounded-2xl border p-4 ${a.soft} ${a.ring}`}>
      <Section title={title} icon={icon} accent={accent}>
        <BulletList items={items} accent={accent} />
      </Section>
    </div>
  )
}

function ScenarioPanel({ segment }: { segment: SegmentView }) {
  const t = useTranslations("Views.scenario")
  const tp = useTranslations("Project")
  const s = segment.scenario
  if (!s) return <NotReady message={tp("notReady")} />
  return (
    <Panel className="space-y-5 p-5 sm:p-6" data-testid="scenario-panel">
      <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
        <IconBadge icon={Route} accent="violet" /> {t("title")}
      </h3>
      <Section title={t("narrative")}>
        <blockquote className="border-l-4 border-violet-300 bg-violet-50/50 py-2 pl-4 pr-3 text-sm leading-relaxed text-slate-700">{s.situation_narrative}</blockquote>
      </Section>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        <BulletList items={s.open_questions} accent="violet" />
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
    <Panel className="space-y-5 p-5 sm:p-6" data-testid="ideation-panel">
      <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
        <IconBadge icon={Lightbulb} accent="amber" /> {t("title")}
      </h3>
      <Section title={t("epicenter")}>
        <div className="flex flex-wrap gap-1.5">
          {i.epicenter.tags.map((tag) => (
            <Badge key={tag} tone="accent" className="px-2.5 py-1 text-xs">{humanize(tag)}</Badge>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-slate-700">{i.epicenter.rationale}</p>
      </Section>
      <Section title={t("whatIf")}>
        <ol className="grid gap-2.5 md:grid-cols-2">
          {i.what_if_questions.map((q, n) => (
            <li key={n} className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-sm leading-relaxed text-slate-800">
              <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-900">{n + 1}</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </Section>
    </Panel>
  )
}
