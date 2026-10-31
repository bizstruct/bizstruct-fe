"use client"

import { useState } from "react"
import { Compass } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { cn } from "@/lib/utils"
import type { FutureScenario } from "@/types/domain/future-scenario"
import { ACCENT, BulletList, NotReady, Panel, Reveal, Section } from "../primitives"
import { CanvasPicker } from "./canvas-view"

export function FutureView({ view, flowIndex, onFlow }: { view: ProjectView; flowIndex: number; onFlow: (i: number) => void }) {
  const t = useTranslations("Views.future")
  const tp = useTranslations("Project")
  const flow = view.canvases[Math.min(flowIndex, view.canvases.length - 1)]
  const future = flow?.futureScenario?.artifact
  // One switch for all scenarios: they are read side by side, so they open together and each row stays equally tall.
  const [open, setOpen] = useState(false)
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
          <p className="text-center text-sm text-slate-500">{t("intro", { n: future.variants.length })}</p>
          <div className="grid gap-4 lg:grid-cols-2" data-testid="future-variants">
            {future.variants.map((variant, n) => (
              <Reveal key={variant.name} delay={n * 0.07} className="h-full">
                <Variant variant={variant} number={n + 1} open={open} onToggle={() => setOpen(!open)} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/** A scenario shows its title and a short read; the full text and the questions it raises open on request (for all scenarios at once). */
function Variant({ variant, number, open, onToggle }: { variant: FutureScenario["variants"][number]; number: number; open: boolean; onToggle: () => void }) {
  const t = useTranslations("Views.future")
  return (
    <Panel className="h-full space-y-4">
      <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
        <span aria-hidden className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold", ACCENT.indigo.icon)}>{number}</span>
        {variant.name}
      </h3>
      <p className={cn("text-sm leading-relaxed text-slate-700", !open && "line-clamp-4")}>{variant.narrative}</p>
      {open ? (
        <Section title={t("questions")}>
          <BulletList items={variant.adaptation_questions.map((q) => q.question)} />
        </Section>
      ) : null}
      <button type="button" aria-expanded={open} onClick={onToggle} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        {open ? t("less") : t("more")}
      </button>
    </Panel>
  )
}
