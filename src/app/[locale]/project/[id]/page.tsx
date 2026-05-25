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
import { EmpathyView } from "@/components/empathy-map/EmpathyView"
import { CanvasView } from "@/components/canvas/CanvasView"
import { HypothesesView } from "@/components/hypotheses/HypothesesView"
import { PitchView } from "@/components/pitch/PitchView"
import { ScenarioView } from "@/components/scenario/ScenarioView"
import { WhatIfView } from "@/components/what-if/WhatIfView"
import { ArchitectureView } from "@/components/architecture/ArchitectureView"
import type { EmpathyData } from "@/schemas/empathy-map.schema"
import type { Hypothesis } from "@/schemas/hypotheses.schema"
import type { PitchData } from "@/schemas/pitch.schema"
import type { ScenarioData } from "@/schemas/scenario.schema"
import type { WhatIfVector } from "@/schemas/what-if.schema"
import type { ArchitectureData } from "@/schemas/architecture.schema"

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

export default function ProjectWorkspacePage() {
  const t       = useTranslations("WorkspacePage")
  const params  = useParams()
  const projectId = (params?.id as string) ?? ""
  const locale    = (params?.locale as string) ?? "en"
  const history   = useProjectStore((s) => s.history)
  const project   = history.find((h) => h.id === projectId)

  const [activeView, setActiveView] = useState<ActiveView>("empathy")

  const [empathyData,      setEmpathyData]      = useState<EmpathyData | null>(null)
  const [hypotheses,       setHypotheses]        = useState<Hypothesis[] | null>(null)
  const [pitchData,        setPitchData]         = useState<PitchData | null>(null)
  const [scenarioData,     setScenarioData]      = useState<ScenarioData | null>(null)
  const [whatIfVectors,    setWhatIfVectors]     = useState<WhatIfVector[] | null>(null)
  const [architectureData, setArchitectureData]  = useState<ArchitectureData | null>(null)

  useEffect(() => {
    if (!projectId) return
    getEmpathyMap(projectId, locale).then(setEmpathyData).catch(() => {})
    getHypotheses(projectId).then(setHypotheses).catch(() => {})
    getPitch(projectId, locale).then(setPitchData).catch(() => {})
    getScenario(projectId, locale).then(setScenarioData).catch(() => {})
    getWhatIfVectors(projectId).then(setWhatIfVectors).catch(() => {})
    getArchitecture(projectId, locale).then(setArchitectureData).catch(() => {})
  }, [projectId, locale])

  const views: { key: ActiveView; label: string }[] = [
    { key: "empathy",      label: t("views.empathy") },
    { key: "scenario",     label: t("views.scenario") },
    { key: "what-if",      label: t("views.whatIf") },
    { key: "canvas",       label: t("views.canvas") },
    { key: "architecture", label: t("views.architecture") },
    { key: "hypotheses",   label: t("views.hypotheses") },
    { key: "pitch",        label: t("views.pitch") },
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

      <div className="flex-1 min-h-0">
        {activeView === "empathy" && empathyData && (
          <EmpathyView projectId={projectId} projectName={project?.title ?? projectId} initialData={empathyData} />
        )}
        {activeView === "scenario" && scenarioData && (
          <ScenarioView scenarioData={scenarioData} />
        )}
        {activeView === "what-if" && whatIfVectors && (
          <WhatIfView vectors={whatIfVectors} onApply={() => setActiveView("architecture")} />
        )}
        {activeView === "canvas" && <CanvasView />}
        {activeView === "architecture" && architectureData && (
          <ArchitectureView architectureData={architectureData} onGoToCanvas={() => setActiveView("canvas")} />
        )}
        {activeView === "hypotheses" && hypotheses && (
          <HypothesesView initialHypotheses={hypotheses} />
        )}
        {activeView === "pitch" && pitchData && (
          <PitchView pitchData={pitchData} />
        )}
      </div>
    </div>
  )
}
