"use client"

import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { BulletList, NotReady, Panel, Section } from "../primitives"
import { CanvasPicker } from "./canvas-view"

export function PitchView({ view, flowIndex, onFlow }: { view: ProjectView; flowIndex: number; onFlow: (i: number) => void }) {
  const t = useTranslations("Views.pitch")
  const tp = useTranslations("Project")
  const flow = view.canvases[Math.min(flowIndex, view.canvases.length - 1)]
  const pitch = flow?.pitch?.artifact
  return (
    <div className="space-y-4">
      <CanvasPicker flows={view.canvases} value={flowIndex} onChange={onFlow} />
      {!pitch ? (
        <NotReady message={tp("notReady")} />
      ) : (
        <Panel className="space-y-5" data-testid="pitch-panel">
          <Section title={t("hook")}>
            <p className="text-base font-medium leading-relaxed text-slate-900">{pitch.hook}</p>
          </Section>
          <Section title={t("summary")}>
            <p className="text-sm leading-relaxed text-slate-700">{pitch.business_model_summary}</p>
          </Section>
          <Section title={t("advantages")}>
            <BulletList items={pitch.competitive_advantages} />
          </Section>
          <Section title={t("risks")}>
            <BulletList items={pitch.risk_analysis} />
          </Section>
          {pitch.team_section ? (
            <Section title={t("team")}>
              <p className="text-sm text-slate-700">{pitch.team_section}</p>
            </Section>
          ) : null}
          {pitch.financial_analysis_section ? (
            <Section title={t("financial")}>
              <p className="text-sm text-slate-700">{pitch.financial_analysis_section}</p>
            </Section>
          ) : null}
        </Panel>
      )}
    </div>
  )
}
