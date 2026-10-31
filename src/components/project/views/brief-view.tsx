"use client"

import { Boxes, Coins, Factory, Lightbulb, SearchX, Users, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { cn } from "@/lib/utils"
import { BulletList, IconBadge, NotReady, Panel, Section, type Accent } from "../primitives"

export function BriefView({ view }: { view: ProjectView }) {
  const t = useTranslations("Views.brief")
  const tp = useTranslations("Project")
  const brief = view.brief
  if (!brief) return <NotReady message={tp("notReady")} />

  // A list with nothing in it gets no card: an empty card says "none" and adds nothing.
  const lists = [
    { key: "segments", title: t("segments"), icon: Users, items: brief.customer_segment_candidates },
    { key: "resources", title: t("resources"), icon: Boxes, items: brief.existing_resources },
    { key: "gaps", title: t("gaps"), icon: SearchX, items: brief.gaps },
  ].filter((list) => list.items.length > 0)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="p-5">
          <Section title={t("summary")} icon={Lightbulb} accent="indigo">
            <p className="text-pretty text-lg font-medium leading-8 text-slate-900" data-testid="brief-summary">{brief.idea_summary}</p>
          </Section>
        </div>
        <dl className="grid border-t border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-slate-200">
          <Meta icon={Factory} accent="sky" label={t("industry")}>{brief.industry}</Meta>
          {brief.monetization_hint ? <Meta icon={Coins} accent="amber" label={t("monetization")}>{brief.monetization_hint}</Meta> : null}
        </dl>
      </div>

      <div className={cn("grid gap-4", lists.length === 3 ? "lg:grid-cols-3" : lists.length === 2 ? "lg:grid-cols-2" : "")}>
        {lists.map(({ key, title, icon, items }) => (
          <Panel key={key}>
            <Section title={title} icon={icon} accent="indigo">
              <BulletList items={items} accent="indigo" />
            </Section>
          </Panel>
        ))}
      </div>
    </div>
  )
}

/** One labelled fact under the summary: icon and label on one line, the value under them, flush with the icon like every other card. */
function Meta({ icon, accent, label, children }: { icon: LucideIcon; accent: Accent; label: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4 not-first:border-t not-first:border-slate-200 sm:not-first:border-t-0">
      <dt className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <IconBadge icon={icon} accent={accent} className="size-7 rounded-lg" />
        {label}
      </dt>
      <dd className="mt-3 text-sm leading-relaxed text-slate-800">{children}</dd>
    </div>
  )
}
