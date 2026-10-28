"use client"

import { CheckCircle2, CircleAlert, Clock, Loader2, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import type { StageState } from "@/lib/mappers/tab-stages"
import { cn } from "@/lib/utils"

const ICON = {
  done: { Icon: CheckCircle2, className: "text-emerald-600" },
  running: { Icon: Loader2, className: "animate-spin text-sky-600" },
  attention: { Icon: CircleAlert, className: "text-amber-600" },
  error: { Icon: XCircle, className: "text-red-600" },
  waiting: { Icon: Clock, className: "text-slate-400" },
} as const

/** The one glyph for a stage state; the state's name is its accessible label. */
export function StateIcon({ state, className }: { state: StageState; className?: string }) {
  const t = useTranslations("Status.state")
  const { Icon, className: tone } = ICON[state]
  return <Icon role="img" aria-label={t(state)} data-state={state} className={cn("size-4 shrink-0", tone, className)} />
}
