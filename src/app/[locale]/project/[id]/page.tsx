"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  LayoutGrid, FlaskConical, Mic2, Route, Heart,
  GitBranch, Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProjectStore } from "@/store/use-project-store"
import { getEmpathyMap } from "@/services/empathy-map"
import { getHypotheses } from "@/services/hypotheses"
import { getPitch } from "@/services/pitch"
import { getScenario } from "@/services/scenario"
import { getWhatIfVectors } from "@/services/what-if"
import { getArchitecture } from "@/services/architecture"
import { getCanvas } from "@/services/canvas"
import { EmpathyView } from "@/components/empathy-map/EmpathyView"
import { CanvasView } from "@/components/canvas/CanvasView"
import { HypothesesView } from "@/components/hypotheses/HypothesesView"
import { PitchView } from "@/components/pitch/PitchView"
import { ScenarioView } from "@/components/scenario/ScenarioView"
import { WhatIfView } from "@/components/what-if/WhatIfView"
import { ArchitectureView } from "@/components/architecture/ArchitectureView"
import type { EmpathyMap } from "@/schemas/empathy-map.schema"
import type { Hypothesis } from "@/schemas/hypotheses.schema"
import type { PitchData } from "@/schemas/pitch.schema"
import type { ScenarioData } from "@/schemas/scenario.schema"
import type { WhatIfVector } from "@/schemas/what-if.schema"
import type { Architecture } from "@/schemas/architecture.schema"
import type { CanvasSections } from "@/schemas/canvas.schema"

type ActiveView = "empathy" | "canvas" | "hypotheses" | "pitch" | "what-if" | "architecture" | "scenario"

const VIEW_ICONS: Record<ActiveView, React.ElementType> = {
  empathy:      Heart,
  scenario:     Route,
  "what-if":    GitBranch,
  canvas:       LayoutGrid,
  architecture: Cpu,
  hypotheses:   FlaskConical,
  pitch:        Mic2,
}

function GeneratingPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
      <div className="h-6 w-6 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin" />
      <p className="text-sm">Generating content…</p>
    </div>
  )
}

export default function ProjectWorkspacePage() {
  const t       = useTranslations("WorkspacePage")
  const params  = useParams()
  const projectId = (params?.id as string) ?? ""
  const locale    = (params?.locale as string) ?? "en"
  const history   = useProjectStore((s) => s.history)
  const project   = history.find((h) => h.id === projectId)

  const [activeView, setActiveView] = useState<ActiveView>("empathy")

  const [empathyData,      setEmpathyData]      = useState<EmpathyMap | null>(null)
  const [hypotheses,       setHypotheses]        = useState<Hypothesis[] | null>(null)
  const [pitchData,        setPitchData]         = useState<PitchData | null>(null)
  const [scenarioData,     setScenarioData]      = useState<ScenarioData | null>(null)
  const [whatIfVectors,    setWhatIfVectors]     = useState<WhatIfVector[] | null>(null)
  const [architecture,      setArchitecture]      = useState<Architecture | null>(null)
  const [canvasData,       setCanvasData]        = useState<CanvasSections | null>(null)

  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    async function fetchAll() {
      const [empathy, hyps, pitch, scenario, whatIf, arch, canvas] = await Promise.all([
        getEmpathyMap(projectId).catch(() => null),
        getHypotheses(projectId).catch(() => null),
        getPitch(projectId, locale).catch(() => null),
        getScenario(projectId).catch(() => null),
        getWhatIfVectors(projectId).catch(() => null),
        getArchitecture(projectId).catch(() => null),
        getCanvas(projectId).catch(() => null),
      ])
      if (cancelled) return
      if (empathy)  setEmpathyData(empathy)
      if (hyps)     setHypotheses(hyps)
      if (pitch)    setPitchData(pitch)
      if (scenario) setScenarioData(scenario)
      if (whatIf?.length)  setWhatIfVectors(whatIf)
      if (arch)     setArchitecture(arch)
      if (canvas)   setCanvasData(canvas)
      const allReady = empathy && hyps !== null && pitch && scenario && whatIf !== null && arch && canvas
      if (!allReady) {
        timer = setTimeout(fetchAll, 5000)
      }
    }

    fetchAll()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [projectId, locale])

  const views: { key: ActiveView; label: string }[] = [
    { key: "empathy",      label: t("views.empathy") },
    { key: "scenario",     label: t("views.scenario") },
    { key: "what-if",      label: t("views.whatIf") },
    { key: "architecture", label: t("views.architecture") },
    { key: "canvas",       label: t("views.canvas") },
    { key: "pitch",        label: t("views.pitch") },
    { key: "hypotheses",   label: t("views.hypotheses") },
  ]

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="px-5 pt-3 pb-2 flex items-center gap-2">
          <h1 className="text-sm font-semibold text-slate-900 truncate">
            {project?.title ?? `Project ${projectId.slice(-8)}`}
          </h1>
          <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            {t("status.draft")}
          </span>
          <span className="shrink-0 text-[10px] text-slate-400 ml-1">· {t("projectWorkspace")}</span>
        </div>

        <nav className="overflow-x-auto px-5 pb-2" style={{ scrollbarWidth: "none" }}>
          <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5 w-max">
            {views.map(({ key, label }) => {
              const Icon = VIEW_ICONS[key]
              return (
                <button
                  key={key}
                  onClick={() => setActiveView(key)}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium whitespace-nowrap transition-all",
                    activeView === key
                      ? "bg-white shadow-sm text-slate-900 border border-slate-200"
                      : "text-slate-500 hover:text-slate-700 hover:bg-white/60",
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              )
            })}
          </div>
        </nav>
      </header>

      <div className="flex-1 min-h-0 relative">
        {activeView === "empathy" && (empathyData
          ? <EmpathyView projectId={projectId} projectName={project?.title ?? projectId} locale={locale} initialData={empathyData} onNext={() => setActiveView("scenario")} hasSubsequentData={scenarioData !== null} />
          : <GeneratingPlaceholder />
        )}
        {activeView === "scenario" && (scenarioData
          ? <ScenarioView projectId={projectId} locale={locale} scenarioData={scenarioData} onNext={() => setActiveView("what-if")} hasSubsequentData={whatIfVectors !== null} />
          : <GeneratingPlaceholder />
        )}
        {activeView === "what-if" && (whatIfVectors
          ? <WhatIfView
              projectId={projectId}
              vectors={whatIfVectors}
              hasSubsequentData={architecture !== null}
              onApplied={(scenarioId) => {
                setWhatIfVectors(prev =>
                  prev?.map(v => ({
                    ...v,
                    status: v.scenarioId === scenarioId ? "applied" as const : v.status === "applied" ? null : v.status,
                  })) ?? null
                )
                setActiveView("architecture")
              }}
            />
          : <GeneratingPlaceholder />
        )}
        {activeView === "canvas" && <CanvasView hasPitch={pitchData !== null} onGoToPitch={() => setActiveView("pitch")} />}
        {activeView === "architecture" && (architecture
          ? <ArchitectureView projectId={projectId} locale={locale} architecture={architecture} hasCanvas={canvasData !== null} onGoToCanvas={() => setActiveView("canvas")} />
          : <GeneratingPlaceholder />
        )}
        {activeView === "hypotheses" && (hypotheses
          ? <HypothesesView initialHypotheses={hypotheses} />
          : <GeneratingPlaceholder />
        )}
        {activeView === "pitch" && (
          <PitchView
            pitchData={pitchData ?? { investor: [], customer: [] }}
            projectId={projectId}
            locale={locale}
            onMapHypotheses={() => setActiveView("hypotheses")}
          />
        )}
      </div>
    </div>
  )
}
