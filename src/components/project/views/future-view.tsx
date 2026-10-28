"use client"

import { Compass, Waypoints } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { ProjectView } from "@/lib/mappers/project"
import { BulletList, IconBadge, NotReady, Panel, Reveal, Section, type Accent } from "../primitives"
import { CanvasPicker } from "./canvas-view"

const VARIANT_ACCENT: Accent[] = ["sky", "violet", "amber", "pink"]

export function FutureView({ view, flowIndex, onFlow }: { view: ProjectView; flowIndex: number; onFlow: (i: number) => void }) {
  const t = useTranslations("Views.future")
  const tc = useTranslations("Views.canvas")
  const tp = useTranslations("Project")
  const flow = view.canvases[Math.min(flowIndex, view.canvases.length - 1)]
  const future = flow?.futureScenario?.artifact
  return (
    <div className="space-y-4">
      <CanvasPicker flows={view.canvases} value={flowIndex} onChange={onFlow} />
      {!future ? (
        <NotReady message={tp("notReady")} />
      ) : (
        <>
          <Panel>
            <Section title={t("drivers")} icon={Compass} accent="indigo">
              <BulletList items={future.uncertainty_drivers} />
            </Section>
          </Panel>
          <div className="grid gap-4 lg:grid-cols-2" data-testid="future-variants">
            {future.variants.map((variant, n) => (
              <Reveal key={variant.name} delay={n * 0.07}>
                <Panel className="h-full space-y-4">
                  <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                    <IconBadge icon={Waypoints} accent={VARIANT_ACCENT[n % VARIANT_ACCENT.length]} /> {variant.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700">{variant.narrative}</p>
                  <Section title={t("questions")}>
                    <ul className="space-y-2.5 text-sm">
                      {variant.adaptation_questions.map((q, i) => (
                        <li key={i} className="flex flex-wrap items-start gap-2.5 leading-relaxed text-slate-700">
                          <Badge tone="accent" className="mt-0.5">{tc(`sections.${q.section}`)}</Badge>
                          <span className="min-w-0 flex-1">{q.question}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                </Panel>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
