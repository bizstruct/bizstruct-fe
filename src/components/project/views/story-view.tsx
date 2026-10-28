"use client"

import { BookOpen, Quote } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import type { ProjectView } from "@/lib/mappers/project"
import { Fact, humanize, IconBadge, NotReady, Panel, Section } from "../primitives"
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
        <div className="space-y-4" data-testid="story-panel">
          <dl className="grid gap-3 sm:grid-cols-3">
            <Fact label={t("goal")}>{humanize(story.goal)}</Fact>
            <Fact label={t("format")}>{humanize(story.format)}</Fact>
            <Fact label={t("perspective")}>{humanize(story.perspective)}</Fact>
          </dl>
          <Panel className="space-y-4 p-6 sm:p-8">
            <h3 className="flex items-center gap-3 text-lg font-bold text-slate-900">
              <IconBadge icon={BookOpen} accent="violet" /> {t("narrative")}
            </h3>
            <div className="relative">
              <Quote aria-hidden className="absolute -left-1 -top-2 size-8 text-violet-100" />
              <p className="relative whitespace-pre-line pl-4 text-base leading-8 text-slate-800">{story.narrative_text}</p>
            </div>
          </Panel>
          <Panel>
            <Section title={t("references")}>
              <ul className="space-y-2.5 text-sm">
                {story.canvas_references.map((ref, i) => (
                  <li key={i} className="flex flex-wrap items-start gap-2.5 leading-relaxed text-slate-700">
                    <Badge tone="accent" className="mt-0.5">{tc(`sections.${ref.section}`)}</Badge>
                    <span className="min-w-0 flex-1">{ref.note}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </Panel>
        </div>
      )}
    </div>
  )
}
