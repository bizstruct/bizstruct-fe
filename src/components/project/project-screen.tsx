"use client"

import { useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notifyProjectsChanged } from "@/hooks/use-projects"
import { useProject } from "@/hooks/use-project"
import { deleteProject } from "@/lib/api/projects"
import { buildProjectView } from "@/lib/mappers/project"
import { Link, useRouter } from "@/i18n/routing"
import { NotReady } from "./primitives"
import { ProgressView } from "./progress-view"
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

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <Header project={project} polling={polling} />
      {error ? <p role="alert" className="text-xs text-amber-700">{t("loadError")}</p> : null}

      <Tabs defaultValue="progress">
        <TabsList className="h-auto flex-wrap justify-start">
          {(["progress", "brief", "segments", "patterns", "canvas", "swot", "story", "future", "pitch"] as const).map((tab) => (
            <TabsTrigger key={tab} value={tab}>{t(`tabs.${tab}`)}</TabsTrigger>
          ))}
        </TabsList>
        <div className="pt-4">
          <TabsContent value="progress"><ProgressView project={project} onProject={replace} onRefresh={() => void refresh()} /></TabsContent>
          <TabsContent value="brief"><BriefView view={view} /></TabsContent>
          <TabsContent value="segments"><SegmentsView view={view} /></TabsContent>
          <TabsContent value="patterns"><PatternsView view={view} /></TabsContent>
          <TabsContent value="canvas">{view.canvases.length ? <CanvasView view={view} {...flow} /> : <NotReady message={t("notReady")} />}</TabsContent>
          <TabsContent value="swot">{view.canvases.length ? <SwotView view={view} {...flow} /> : <NotReady message={t("notReady")} />}</TabsContent>
          <TabsContent value="story">{view.canvases.length ? <StoryView view={view} {...flow} /> : <NotReady message={t("notReady")} />}</TabsContent>
          <TabsContent value="future">{view.canvases.length ? <FutureView view={view} {...flow} /> : <NotReady message={t("notReady")} />}</TabsContent>
          <TabsContent value="pitch">{view.canvases.length ? <PitchView view={view} {...flow} /> : <NotReady message={t("notReady")} />}</TabsContent>
        </div>
      </Tabs>
    </div>
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
    <header className="space-y-3">
      <Link href="/" className="text-xs text-slate-500 hover:text-slate-800">← {t("back")}</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900">{project.title}</h1>
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
      <p className="max-w-3xl text-sm text-slate-600">{project.idea}</p>

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
