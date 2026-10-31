"use client"

import { useState } from "react"
import { Brain, Check, ChevronDown, Ear, Eye, Frown, Lightbulb, MessageCircle, Route, Smile } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { ProjectView, SegmentView } from "@/lib/mappers/project"
import { stateOf, type StageState } from "@/lib/mappers/tab-stages"
import type { StageId } from "@/types/domain/stages"
import { ACCENT, BLOCK, BulletList, Fact, humanize, IconBadge, NotReady, Panel, Reveal, Section, UnderlineTabs, type Accent } from "../primitives"

type Part = "empathy" | "scenario" | "ideation"

/** Only a part that is not finished shows a dot: red for an error, pulsing while it runs, muted while it waits. */
const PART_DOT: Partial<Record<StageState, string>> = { error: "bg-red-500", attention: "bg-red-500", running: "animate-pulse bg-indigo-400", waiting: "bg-slate-300" }

function PartLabel({ text, segment, part }: { text: string; segment: SegmentView; part: Part }) {
  const row = { empathy: segment.empathyRow, scenario: segment.scenarioRow, ideation: segment.ideationRow }[part]
  const stage: StageId = { empathy: "empathy_map", scenario: "customer_scenario", ideation: "ideation" }[part] as StageId
  const dot = PART_DOT[row ? stateOf([row], [stage]) : "waiting"]
  return (
    <>
      {text}
      {dot ? <span aria-hidden className={cn("size-1.5 rounded-full", dot)} /> : null}
    </>
  )
}

export function SegmentsView({ view }: { view: ProjectView }) {
  const tp = useTranslations("Project")
  const t = useTranslations("Views.empathy")
  const ts = useTranslations("Views.scenario")
  const ti = useTranslations("Views.ideation")
  const [selected, setSelected] = useState(0)
  const [part, setPart] = useState<Part>("empathy")
  if (view.segments.length === 0) return <NotReady message={tp("notReady")} />
  const index = Math.min(selected, view.segments.length - 1)
  const segment = view.segments[index]

  return (
    <div className="space-y-5">
      <div className="relative border-b border-slate-200">
        {view.segments.length > 1 ? (
          <div className="flex justify-end pb-2 sm:absolute sm:inset-y-0 sm:right-0 sm:items-center sm:pb-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex max-w-56 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50" aria-label={t("segment")}>
                <span className="truncate">{segment.label}</span>
                <ChevronDown aria-hidden className="size-3.5 shrink-0 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {view.segments.map((s, i) => (
                  <DropdownMenuItem key={s.empathyRow.id} onSelect={() => setSelected(i)}>
                    <span className="flex-1">{s.label}</span>
                    {i === index ? <Check aria-hidden className="size-3.5 text-indigo-500" /> : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
        <UnderlineTabs
          className="justify-center"
          label={t("part")}
          value={part}
          onChange={setPart}
          items={[
            { id: "empathy", label: <PartLabel text={t("tab")} segment={segment} part="empathy" /> },
            { id: "scenario", label: <PartLabel text={ts("title")} segment={segment} part="scenario" /> },
            { id: "ideation", label: <PartLabel text={ti("title")} segment={segment} part="ideation" /> },
          ]}
        />
      </div>
      <Reveal key={`${segment.empathyRow.id}-${part}`} className="space-y-5">
        {part === "empathy" ? <EmpathyPanel segment={segment} /> : null}
        {part === "scenario" ? <ScenarioPanel segment={segment} /> : null}
        {part === "ideation" ? <IdeationPanel segment={segment} /> : null}
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
          <h3 className="text-xl font-bold tracking-tight text-slate-900">{map.persona_name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{map.persona_demographics}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Highlight title={t("pains")} items={map.pains} icon={Frown} accent="red" />
        <Highlight title={t("gains")} items={map.gains} icon={Smile} accent="emerald" />
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

function Highlight({ title, items, icon, accent }: { title: string; items: readonly string[]; icon: typeof Eye; accent: Accent }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 p-4">
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
        <blockquote className="border-l-2 border-indigo-300 py-1 pl-4 text-sm leading-relaxed text-slate-700">{s.situation_narrative}</blockquote>
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
            <li key={n} className={cn(BLOCK, "flex gap-3")}>
              <span aria-hidden className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold", ACCENT.indigo.icon)}>{n + 1}</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </Section>
    </Panel>
  )
}
