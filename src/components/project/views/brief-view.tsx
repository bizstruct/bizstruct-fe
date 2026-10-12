"use client"

import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { BulletList, Fact, NotReady, Panel, Section } from "../primitives"

export function BriefView({ view }: { view: ProjectView }) {
  const t = useTranslations("Views.brief")
  const tp = useTranslations("Project")
  const brief = view.brief
  if (!brief) return <NotReady message={tp("notReady")} />

  return (
    <Panel className="space-y-5">
      <p className="text-base leading-relaxed text-slate-900" data-testid="brief-summary">{brief.idea_summary}</p>
      <dl className="grid gap-4 sm:grid-cols-2">
        <Fact label={t("industry")}>{brief.industry}</Fact>
        {brief.monetization_hint ? <Fact label={t("monetization")}>{brief.monetization_hint}</Fact> : null}
      </dl>
      <Section title={t("segments")}>
        <BulletList items={brief.customer_segment_candidates} />
      </Section>
      <Section title={t("resources")}>
        <BulletList items={brief.existing_resources} empty={t("none")} />
      </Section>
      <Section title={t("gaps")}>
        <BulletList items={brief.gaps} empty={t("none")} />
      </Section>
    </Panel>
  )
}
