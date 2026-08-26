"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  HeartHandshake,
  Route,
  GitBranch,
  LayoutGrid,
  Cpu,
  Mic2,
  FlaskConical,
  Check,
} from "lucide-react"

// ─── Stage definitions ────────────────────────────────────────────────────────

const STAGES = [
  { key: "empathy-map",  label: "Empathy Map",   icon: HeartHandshake },
  { key: "scenario",     label: "Scenario",       icon: Route },
  { key: "what-if",      label: "What-If",        icon: GitBranch },
  { key: "canvas",       label: "Canvas",         icon: LayoutGrid },
  { key: "architecture", label: "Architecture",   icon: Cpu },
  { key: "pitch",        label: "Pitch",          icon: Mic2 },
  { key: "hypotheses",   label: "Hypotheses",     icon: FlaskConical },
] as const

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectStepper() {
  const params  = useParams()
  const pathname = usePathname()
  const router  = useRouter()

  const projectId = params?.id as string
  const locale    = params?.locale as string ?? "en"

  const activeIndex = STAGES.findIndex((s) => pathname?.endsWith(`/${s.key}`))

  function navigate(key: string) {
    router.push(`/${locale}/project/${projectId}/${key}`)
  }

  return (
    <div
      className="shrink-0 h-11 bg-white border-b border-slate-200 px-4 flex items-center overflow-x-auto"
      style={{ scrollbarWidth: "none" }}
    >
      {STAGES.map((stage, index) => {
        const Icon        = stage.icon
        const isActive    = index === activeIndex
        const isCompleted = activeIndex > -1 && index < activeIndex
        const isUpcoming  = !isActive && !isCompleted

        return (
          <div key={stage.key} className="flex items-center shrink-0">

            {/* Step button */}
            <button
              onClick={() => navigate(stage.key)}
              title={stage.label}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1 transition-all duration-150 whitespace-nowrap",
                isActive   && "text-indigo-700",
                isCompleted && "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50",
                isUpcoming  && "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50",
              )}
            >
              {/* Badge */}
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all",
                  isActive    && "bg-indigo-600 text-white ring-2 ring-indigo-100",
                  isCompleted && "bg-slate-300 text-white",
                  isUpcoming  && "border border-slate-300 bg-white text-slate-400",
                )}
              >
                {isCompleted ? (
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                ) : (
                  <Icon className="h-2.5 w-2.5" />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[11px] font-medium leading-none",
                  isActive    && "font-semibold text-indigo-700",
                  isCompleted && "text-slate-400",
                  isUpcoming  && "text-slate-400",
                )}
              >
                {stage.label}
              </span>
            </button>

            {/* Connector line */}
            {index < STAGES.length - 1 && (
              <div
                className={cn(
                  "w-6 h-px mx-0.5 shrink-0 transition-colors duration-300",
                  index < activeIndex ? "bg-indigo-300" : "bg-slate-200",
                )}
              />
            )}

          </div>
        )
      })}
    </div>
  )
}
