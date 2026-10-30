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
      <div className="rounded-2xl border border-slate-200 border-l-indigo-500 bg-white p-4 sm:p-5 border-l-4">
        <p className="flex items-center gap-2 text-xs font-medium text-indigo-700">
          <Lightbulb className="size-4" aria-hidden /> {t("summary")}
        </p>
        <p className="mt-2 text-base font-medium leading-relaxed text-slate-900 sm:text-lg" data-testid="brief-summary">{brief.idea_summary}</p>
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
