"use client"

import { Boxes, Coins, Factory, Lightbulb, SearchX, Users, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { BulletList, NotReady, Panel, Section } from "../primitives"

export function BriefView({ view }: { view: ProjectView }) {
  const t = useTranslations("Views.brief")
  const tp = useTranslations("Project")
  const brief = view.brief
  if (!brief) return <NotReady message={tp("notReady")} />

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="p-5">
          <Section title={t("summary")} icon={Lightbulb} accent="indigo">
            <p className="text-pretty text-lg font-medium leading-8 text-slate-900" data-testid="brief-summary">{brief.idea_summary}</p>
          </Section>
        </div>
        <dl className="grid border-t border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-slate-200">
          <Meta icon={Factory} label={t("industry")}>{brief.industry}</Meta>
          {brief.monetization_hint ? <Meta icon={Coins} label={t("monetization")}>{brief.monetization_hint}</Meta> : null}
        </dl>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-3">
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

/** One labelled fact under the summary: a small icon, the label, the value. */
function Meta({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 px-5 py-3.5 not-first:border-t not-first:border-slate-200 sm:not-first:border-t-0">
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-slate-400" />
      <div className="min-w-0">
        <dt className="text-xs font-medium text-slate-500">{label}</dt>
        <dd className="mt-0.5 text-sm leading-relaxed text-slate-800">{children}</dd>
      </div>
    </div>
  )
}
