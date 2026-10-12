"use client"

import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { BulletList, NotReady, Panel, Section } from "../primitives"
import { CanvasPicker } from "./canvas-view"

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
            <Section title={t("drivers")}>
              <BulletList items={future.uncertainty_drivers} />
            </Section>
          </Panel>
          <div className="grid gap-4 lg:grid-cols-2" data-testid="future-variants">
            {future.variants.map((variant) => (
              <Panel key={variant.name} className="space-y-3">
                <h3 className="text-base font-semibold text-slate-900">{variant.name}</h3>
                <p className="text-sm leading-relaxed text-slate-700">{variant.narrative}</p>
                <Section title={t("questions")}>
                  <ul className="space-y-1.5 text-sm">
                    {variant.adaptation_questions.map((q, i) => (
                      <li key={i} className="text-slate-700">
                        <span className="mr-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">{tc(`sections.${q.section}`)}</span>
                        {q.question}
                      </li>
                    ))}
                  </ul>
                </Section>
              </Panel>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
