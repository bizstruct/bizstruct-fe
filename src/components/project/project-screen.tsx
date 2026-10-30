"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProject } from "@/hooks/use-project"
import { buildProjectView } from "@/lib/mappers/project"
import { TAB_IDS, stageProgress, stagesOfTab, stateOf, type TabId } from "@/lib/mappers/tab-stages"
import { NotReady, Reveal } from "./primitives"
import { StageStatusPanel } from "./stage-status"
import { StateIcon } from "./state-icon"
import { BriefView } from "./views/brief-view"
import { CanvasView } from "./views/canvas-view"
import { FutureView } from "./views/future-view"
import { PatternsView } from "./views/patterns-view"
import { PitchView } from "./views/pitch-view"
import { SegmentsView } from "./views/segments-view"
import { StoryView } from "./views/story-view"
import { SwotView } from "./views/swot-view"

export function ProjectScreen({ id }: { id: string }) {
  const t = useTranslations("Project")
  const { project, error, loading, refresh, replace } = useProject(id)
  const view = useMemo(() => (project ? buildProjectView(project) : null), [project])
  const [flowIndex, setFlowIndex] = useState(0)

  if (loading && !project) return <p className="p-8 text-sm text-slate-500">{t("loading")}</p>
  if (!project || !view) {
    return <p role="alert" className="p-8 text-sm text-red-700">{error?.kind === "not_found" ? t("notFound") : t("loadError")}</p>
  }

  const flow = { flowIndex, onFlow: setFlowIndex }
  const hasCanvas = view.canvases.length > 0
  const content: Record<TabId, { ready: boolean; node: React.ReactNode }> = {
    brief: { ready: true, node: <BriefView view={view} /> },
    segments: { ready: true, node: <SegmentsView view={view} /> },
    patterns: { ready: true, node: <PatternsView view={view} /> },
    canvas: { ready: hasCanvas, node: <CanvasView view={view} {...flow} /> },
    swot: { ready: hasCanvas, node: <SwotView view={view} {...flow} /> },
    story: { ready: hasCanvas, node: <StoryView view={view} {...flow} /> },
    future: { ready: hasCanvas, node: <FutureView view={view} {...flow} /> },
    pitch: { ready: hasCanvas, node: <PitchView view={view} {...flow} /> },
  }

  const { done, total } = stageProgress(project.rows, project.enabledOptional)
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  const failed = project.status === "failed"

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Tabs defaultValue="brief" className="h-full min-h-0 gap-0">
        {/*
          The bar sits above the scrolling area instead of floating over it, so the content is cut off at the same
          gap that separates them at rest: nothing ever slides behind or past the bar. The tabs say where each stage
          stands; the line along the bottom edge says how far the whole project is.
        */}
        <div className="shrink-0 px-4 pb-5 pt-3 sm:px-6">
          <div className="relative mx-auto flex max-w-6xl items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-black/10">
            <TabsList className="group-data-horizontal/tabs:h-auto grid w-full grid-flow-col auto-cols-fr gap-1 overflow-x-auto rounded-none bg-transparent p-1.5 pb-2.5">
              {TAB_IDS.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="h-10 min-w-28 flex-none gap-2 rounded-xl border-transparent px-3 text-sm font-medium text-slate-500 after:hidden hover:text-slate-900 data-active:bg-indigo-500/15 data-active:text-indigo-900 data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-indigo-400/15"
                >
                  <StateIcon state={stateOf(project.rows, stagesOfTab(tab, project.enabledOptional))} />
                  {t(`tabs.${tab}`)}
                </TabsTrigger>
              ))}
            </TabsList>
            <div
              role="progressbar"
              aria-label={t("progress", { done, total })}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={done}
              className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-200/70"
            >
              <div
                style={{ width: `${percent}%` }}
                className={`h-full transition-[width] duration-700 ease-out ${failed ? "bg-red-500" : done === total ? "bg-emerald-500" : "bg-indigo-500"}`}
              />
            </div>
          </div>
          {error ? <p role="alert" className="mx-auto mt-3 max-w-6xl text-xs text-amber-700">{t("loadError")}</p> : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
          <div className="mx-auto max-w-6xl pb-10">
            {TAB_IDS.map((tab) => {
              const stages = stagesOfTab(tab, project.enabledOptional)
              const state = stateOf(project.rows, stages)
              return (
                <TabsContent key={tab} value={tab} className="space-y-5">
                  <Reveal><StageStatusPanel project={project} stages={stages} onProject={replace} onRefresh={() => void refresh()} /></Reveal>
                  <Reveal delay={0.08}>{content[tab].ready ? content[tab].node : <Pending running={state === "running"} />}</Reveal>
                </TabsContent>
              )
            })}
          </div>
        </div>
      </Tabs>
    </div>
  )
}

/** What a tab shows in place of its content while the stage behind it has produced nothing yet. */
function Pending({ running }: { running: boolean }) {
  const t = useTranslations("Project")
  if (!running) return <NotReady message={t("waitingFor")} />
  return (
    <p role="status" className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-sky-200 bg-sky-50/50 p-6 text-sm text-sky-800">
      <Loader2 className="size-4 animate-spin" /> {t("generating")}
    </p>
  )
}
