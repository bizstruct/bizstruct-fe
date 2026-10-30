"use client"

import { Boxes, Lightbulb, SearchX, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { BulletList, Fact, NotReady, Panel, Section } from "../primitives"

export function BriefView({ view }: { view: ProjectView }) {
  const t = useTranslations("Views.brief")
  const tp = useTranslations("Project")
  const brief = view.brief
  if (!brief) return <NotReady message={tp("notReady")} />

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-500 to-violet-500 p-6 text-[#fff] shadow-lg shadow-indigo-200 sm:p-8">
        <div aria-hidden className="absolute -right-10 -top-10 size-48 rounded-full bg-[#fff]/10 blur-2xl" />
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#e0e4ff]">
          <Lightbulb className="size-4" aria-hidden /> {t("summary")}
        </p>
        <p className="relative mt-3 text-xl font-medium leading-relaxed sm:text-2xl" data-testid="brief-summary">{brief.idea_summary}</p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact label={t("industry")}>{brief.industry}</Fact>
        {brief.monetization_hint ? <Fact label={t("monetization")}>{brief.monetization_hint}</Fact> : null}
      </dl>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel>
          <Section title={t("segments")} icon={Users} accent="emerald">
            <BulletList items={brief.customer_segment_candidates} accent="emerald" />
          </Section>
        </Panel>
        <Panel>
          <Section title={t("resources")} icon={Boxes} accent="sky">
            <BulletList items={brief.existing_resources} empty={t("none")} accent="sky" />
          </Section>
        </Panel>
        <Panel>
          <Section title={t("gaps")} icon={SearchX} accent="amber">
            <BulletList items={brief.gaps} empty={t("none")} accent="amber" />
          </Section>
        </Panel>
      </div>
    </div>
  )
}
