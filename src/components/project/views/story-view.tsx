"use client"

import { useTranslations } from "next-intl"
import type { ProjectView } from "@/lib/mappers/project"
import { Fact, humanize, NotReady, Panel, Section } from "../primitives"
import { CanvasPicker } from "./canvas-view"

export function StoryView({ view, flowIndex, onFlow }: { view: ProjectView; flowIndex: number; onFlow: (i: number) => void }) {
  const t = useTranslations("Views.story")
  const tc = useTranslations("Views.canvas")
  const tp = useTranslations("Project")
  const flow = view.canvases[Math.min(flowIndex, view.canvases.length - 1)]
  const story = flow?.storytelling?.artifact
  return (
    <div className="space-y-4">
      <CanvasPicker flows={view.canvases} value={flowIndex} onChange={onFlow} />
      {!story ? (
        <NotReady message={tp("notReady")} />
      ) : (
        <Panel className="space-y-5" data-testid="story-panel">
          <dl className="grid gap-4 sm:grid-cols-3">
            <Fact label={t("goal")}>{humanize(story.goal)}</Fact>
            <Fact label={t("format")}>{humanize(story.format)}</Fact>
            <Fact label={t("perspective")}>{humanize(story.perspective)}</Fact>
          </dl>
          <Section title={t("narrative")}>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">{story.narrative_text}</p>
          </Section>
          <Section title={t("references")}>
            <ul className="space-y-1.5 text-sm">
              {story.canvas_references.map((ref, i) => (
                <li key={i} className="text-slate-700">
                  <span className="mr-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">{tc(`sections.${ref.section}`)}</span>
                  {ref.note}
                </li>
              ))}
            </ul>
          </Section>
        </Panel>
      )}
    </div>
  )
}

