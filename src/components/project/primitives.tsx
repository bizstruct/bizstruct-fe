"use client"

import * as React from "react"
import { motion } from "motion/react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/** Domain enums arrive as snake_case ids (channel_type, pitching_investors): show them as words. */
export const humanize = (id: string): string => id.replace(/_/g, " ")

/** Fades and lifts its children in; `delay` staggers siblings. */
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  )
}

export type Accent = "indigo" | "sky" | "violet" | "pink" | "amber" | "red" | "emerald" | "slate"

/** Tailwind needs whole class names, so each accent lists its own. */
export const ACCENT: Record<Accent, { soft: string; ring: string; text: string; bar: string; icon: string; dot: string }> = {
  indigo: { soft: "bg-indigo-50", ring: "border-indigo-200", text: "text-indigo-700", bar: "bg-indigo-500", icon: "bg-indigo-100 text-indigo-600", dot: "bg-indigo-400" },
  sky: { soft: "bg-sky-50", ring: "border-sky-200", text: "text-sky-700", bar: "bg-sky-500", icon: "bg-sky-100 text-sky-600", dot: "bg-sky-400" },
  violet: { soft: "bg-violet-50", ring: "border-violet-200", text: "text-violet-700", bar: "bg-violet-500", icon: "bg-violet-100 text-violet-600", dot: "bg-violet-400" },
  pink: { soft: "bg-pink-50", ring: "border-pink-200", text: "text-pink-700", bar: "bg-pink-500", icon: "bg-pink-100 text-pink-600", dot: "bg-pink-400" },
  amber: { soft: "bg-amber-50", ring: "border-amber-200", text: "text-amber-800", bar: "bg-amber-500", icon: "bg-amber-100 text-amber-600", dot: "bg-amber-400" },
  red: { soft: "bg-red-50", ring: "border-red-200", text: "text-red-700", bar: "bg-red-500", icon: "bg-red-100 text-red-600", dot: "bg-red-400" },
  emerald: { soft: "bg-emerald-50", ring: "border-emerald-200", text: "text-emerald-700", bar: "bg-emerald-500", icon: "bg-emerald-100 text-emerald-600", dot: "bg-emerald-400" },
  slate: { soft: "bg-slate-50", ring: "border-slate-200", text: "text-slate-700", bar: "bg-slate-400", icon: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
}

export function IconBadge({ icon: Icon, accent = "indigo", className }: { icon: LucideIcon; accent?: Accent; className?: string }) {
  return (
    <span aria-hidden className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-xl", ACCENT[accent].icon, className)}>
      <Icon className="size-4" />
    </span>
  )
}

export function Section({ title, icon, accent, children, className }: { title?: React.ReactNode; icon?: LucideIcon; accent?: Accent; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("space-y-3", className)}>
      {title ? (
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          {icon ? <IconBadge icon={icon} accent={accent} className="size-7 rounded-lg" /> : null}
          {title}
        </h3>
      ) : null}
      {children}
    </section>
  )
}

export function BulletList({ items, empty, accent = "indigo" }: { items: readonly string[]; empty?: string; accent?: Accent }) {
  if (items.length === 0) return empty ? <p className="text-sm text-slate-400">{empty}</p> : null
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-slate-700">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span aria-hidden className={cn("mt-2 size-1.5 shrink-0 rounded-full", ACCENT[accent].dot)} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1 rounded-xl bg-slate-50/80 px-3.5 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="text-sm font-medium text-slate-800">{children}</dd>
    </div>
  )
}

export function Panel({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40", className)} {...props}>
      {children}
    </div>
  )
}

export function NotReady({ message }: { message: string }) {
  return <p className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm text-slate-400">{message}</p>
}

export interface SegmentedItem<T extends string | number> {
  id: T
  label: React.ReactNode
}

/** A pill-shaped single choice (tabs semantics) whose highlight glides to the chosen item. */
export function SegmentedControl<T extends string | number>({ items, value, onChange, label, id }: { items: readonly SegmentedItem<T>[]; value: T; onChange: (value: T) => void; label?: string; id: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
      {items.map((item) => {
        const selected = item.id === value
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={cn("relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors", selected ? "text-indigo-900" : "text-slate-600 hover:text-slate-900")}
          >
            {selected ? <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-indigo-500/30" transition={{ type: "spring", stiffness: 500, damping: 38 }} /> : null}
            <span className="relative z-10 inline-flex items-center gap-1.5">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
