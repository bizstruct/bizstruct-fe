"use client"

import * as React from "react"
import { motion } from "motion/react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/** Domain enums arrive as snake_case ids (channel_type, pitching_investors): show them as words. */
export const humanize = (id: string): string => id.replace(/_/g, " ")

/** Fades and lifts its children in; `delay` staggers siblings. Pure CSS, so content is never left invisible if scripts are slow or blocked. */
export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={cn("animate-in fade-in slide-in-from-bottom-3 fill-mode-backwards duration-500", className)} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  )
}

export type Accent = "indigo" | "sky" | "violet" | "pink" | "amber" | "red" | "emerald" | "slate"

const BRAND = { soft: "bg-indigo-50", ring: "border-indigo-200", text: "text-indigo-700", bar: "bg-indigo-500", icon: "bg-indigo-100 text-indigo-600", dot: "bg-indigo-400" }

/** Mono-accent: every accent is the brand lavender except red, which stays for what is a risk or a pain. Tailwind needs whole class names, so red lists its own. */
export const ACCENT: Record<Accent, { soft: string; ring: string; text: string; bar: string; icon: string; dot: string }> = {
  indigo: BRAND,
  sky: BRAND,
  violet: BRAND,
  pink: BRAND,
  amber: BRAND,
  emerald: BRAND,
  slate: BRAND,
  red: { soft: "bg-red-50", ring: "border-red-200", text: "text-red-700", bar: "bg-red-500", icon: "bg-red-100 text-red-600", dot: "bg-red-400" },
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

/** Flat tabs with a lavender line under the chosen one: the quiet sibling of SegmentedControl for a single row. */
export function UnderlineTabs<T extends string>({ items, value, onChange, label, className }: { items: readonly SegmentedItem<T>[]; value: T; onChange: (value: T) => void; label?: string; className?: string }) {
  return (
    <div role="tablist" aria-label={label} className={cn("flex gap-8", className)}>
      {items.map((item) => {
        const selected = item.id === value
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              "-mb-px inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-base font-medium transition-colors",
              selected ? "border-indigo-500 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
