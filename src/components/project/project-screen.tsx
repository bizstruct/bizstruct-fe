"use client"

import { useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notifyProjectsChanged } from "@/hooks/use-projects"
import { useProject } from "@/hooks/use-project"
import { deleteProject } from "@/lib/api/projects"
import { buildProjectView } from "@/lib/mappers/project"
import { TAB_IDS, stageProgress, stagesOfTab, stateOf, type TabId } from "@/lib/mappers/tab-stages"
import { Link, useRouter } from "@/i18n/routing"
import { NotReady, Reveal } from "./primitives"
import { StageStatusPanel } from "./stage-status"
import { StateIcon } from "./state-icon"
import { ProjectStatusChip } from "./status-chip"
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
  const { project, error, loading, polling, refresh, replace } = useProject(id)
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

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <Reveal><Header project={project} polling={polling} /></Reveal>
      {error ? <p role="alert" className="text-xs text-amber-700">{t("loadError")}</p> : null}

      <Tabs defaultValue="brief">
        <TabsList className="group-data-horizontal/tabs:h-auto w-full flex-wrap justify-start gap-1 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm shadow-slate-200/40">
          {TAB_IDS.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="h-10 flex-none gap-2 rounded-xl px-3.5 text-sm font-medium after:hidden data-active:bg-indigo-50 data-active:text-indigo-900 data-active:shadow-none">
              <StateIcon state={stateOf(project.rows, stagesOfTab(tab, project.enabledOptional))} />
              {t(`tabs.${tab}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="pt-4">
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

function Header({ project, polling }: { project: NonNullable<ReturnType<typeof useProject>["project"]>; polling: boolean }) {
  const t = useTranslations("Project")
  const ta = useTranslations("Actions")
  const td = useTranslations("Delete")
  const locale = useLocale()
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  async function remove() {
    setBusy(true)
    const result = await deleteProject(project.id)
    setBusy(false)
    if (result.ok) {
      notifyProjectsChanged()
      router.replace("/")
    } else setFailed(true)
  }

  return (
    <header className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <Link href="/" className="text-xs text-slate-500 hover:text-slate-800">← {t("back")}</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h1 className="truncate text-3xl font-medium tracking-tight text-slate-900">{project.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <ProjectStatusChip status={project.status} />
            <span>{t("language")}: {project.language.toUpperCase()}</span>
            <span>{new Date(project.createdAt).toLocaleString(locale)}</span>
            <span aria-live="polite">{polling ? t("live") : t("stopped")}</span>
          </div>
        </div>
        <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
          <Trash2 /> {ta("delete")}
        </Button>
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-slate-600">{project.idea}</p>
      <ProgressBar project={project} />

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{td("title")}</DialogTitle>
            <DialogDescription>{td("body")}</DialogDescription>
          </DialogHeader>
          {failed ? <p role="alert" className="text-sm text-red-700">{ta("failed")}</p> : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirming(false)}>{ta("cancel")}</Button>
            <Button variant="destructive" disabled={busy} onClick={() => void remove()}>{busy ? ta("working") : td("confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}

function ProgressBar({ project }: { project: NonNullable<ReturnType<typeof useProject>["project"]> }) {
  const t = useTranslations("Project")
  const { done, total } = stageProgress(project.rows, project.enabledOptional)
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  const failed = project.status === "failed"
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{t("progress", { done, total })}</span>
        <span>{percent}%</span>
      </div>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} className="h-2.5 overflow-hidden rounded-full bg-slate-200/70">
        <div
          style={{ width: `${percent}%` }}
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${failed ? "bg-red-500" : done === total ? "bg-emerald-500" : "bg-indigo-500"}`}
        />
      </div>
    </div>
  )
}
