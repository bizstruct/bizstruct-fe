"use client"

import { BookOpen } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { humanize, IconBadge, NotReady, Panel } from "../primitives"
import { CanvasPicker } from "./canvas-view"

export function StoryView({ view, flowIndex, onFlow }: { view: ProjectView; flowIndex: number; onFlow: (i: number) => void }) {
  const t = useTranslations("Views.story")
  const tp = useTranslations("Project")
  const flow = view.canvases[Math.min(flowIndex, view.canvases.length - 1)]
  const story = flow?.storytelling?.artifact
  return (
    <div className="space-y-4">
      <CanvasPicker flows={view.canvases} value={flowIndex} onChange={onFlow} />
      {!story ? (
        <NotReady message={tp("notReady")} />
      ) : (
        <div className="space-y-4" data-testid="story-panel">
          <dl className="flex flex-wrap justify-center gap-x-12 gap-y-3 text-center">
            {[
              [t("goal"), story.goal],
              [t("format"), story.format],
              [t("perspective"), story.perspective],
            ].map(([label, value]) => (
              <div key={label} className="space-y-0.5">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</dt>
                <dd className="text-sm font-medium text-slate-800">{humanize(value)}</dd>
              </div>
            ))}
          </dl>
          <Panel className="px-5 py-5 sm:px-8 sm:py-6">
            {/* A reading column: the full panel width is far too long a line for a story. */}
            <div className="mx-auto max-w-[92ch] space-y-4">
              <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                <IconBadge icon={BookOpen} accent="violet" /> {t("narrative")}
              </h3>
              <div className="space-y-3 text-base leading-7 text-slate-800">
                {story.narrative_text.split(/\n{2,}/).map((paragraph, i) => (
                  <p key={i} className="whitespace-pre-line">{paragraph}</p>
                ))}
              </div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}
