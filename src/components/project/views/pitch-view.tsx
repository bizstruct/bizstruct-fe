"use client"

import { Coins, FileText, Rocket, ShieldAlert, Trophy, Users, type LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { BlockList, NotReady, Panel, Section } from "../primitives"
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
          {/* The hook is the headline of the page, so it stands bare and large instead of in a panel. */}
          <div className="space-y-3 px-2 py-3 text-center">
            <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <Rocket className="size-4" aria-hidden /> {t("hook")}
            </p>
            <p className="text-lg font-semibold leading-snug text-slate-900 sm:text-xl">{pitch.hook}</p>
          </div>

          <Prose title={t("summary")} icon={FileText} text={pitch.business_model_summary} />

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <Section title={t("advantages")} icon={Trophy} accent="indigo">
                <BlockList items={pitch.competitive_advantages} />
              </Section>
            </Panel>
            <Panel>
              <Section title={t("risks")} icon={ShieldAlert} accent="indigo">
                <BlockList items={pitch.risk_analysis} />
              </Section>
            </Panel>
          </div>

          {pitch.team_section ? <Prose title={t("team")} icon={Users} text={pitch.team_section} /> : null}
          {pitch.financial_analysis_section ? <Prose title={t("financial")} icon={Coins} text={pitch.financial_analysis_section} /> : null}
        </div>
      )}
    </div>
  )
}

/** A text section across the full panel width, split into paragraphs where the text has blank lines. */
function Prose({ title, icon, text }: { title: string; icon: LucideIcon; text: string }) {
  return (
    <Panel className="px-5 py-5 sm:px-8 sm:py-6">
      <Section title={title} icon={icon} accent="indigo">
        <div className="space-y-3 text-base leading-7 text-slate-800">
          {text.split(/\n{2,}/).map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">{paragraph}</p>
          ))}
        </div>
      </Section>
    </Panel>
  )
}
