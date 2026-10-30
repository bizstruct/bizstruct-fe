"use client"

import { Coins, FileText, Rocket, ShieldAlert, Trophy, Users } from "lucide-react"
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
        <div className="space-y-4" data-testid="pitch-panel">
          <div className="rounded-2xl border border-slate-200 border-l-4 border-l-indigo-500 bg-white p-4 sm:p-5">
            <p className="flex items-center gap-2 text-xs font-medium text-indigo-700">
              <Rocket className="size-4" aria-hidden /> {t("hook")}
            </p>
            <p className="mt-2 text-base font-medium leading-relaxed text-slate-900 sm:text-lg">{pitch.hook}</p>
          </div>

          <Panel>
            <Section title={t("summary")} icon={FileText} accent="indigo">
              <p className="text-sm leading-relaxed text-slate-700">{pitch.business_model_summary}</p>
            </Section>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <Section title={t("advantages")} icon={Trophy} accent="emerald">
                <BulletList items={pitch.competitive_advantages} accent="emerald" />
              </Section>
            </Panel>
            <Panel>
              <Section title={t("risks")} icon={ShieldAlert} accent="red">
                <BulletList items={pitch.risk_analysis} accent="red" />
              </Section>
            </Panel>
          </div>

          {pitch.team_section ? (
            <Panel>
              <Section title={t("team")} icon={Users} accent="sky">
                <p className="text-sm leading-relaxed text-slate-700">{pitch.team_section}</p>
              </Section>
            </Panel>
          ) : null}
          {pitch.financial_analysis_section ? (
            <Panel>
              <Section title={t("financial")} icon={Coins} accent="amber">
                <p className="text-sm leading-relaxed text-slate-700">{pitch.financial_analysis_section}</p>
              </Section>
            </Panel>
          ) : null}
        </div>
      )}
    </div>
  )
}
