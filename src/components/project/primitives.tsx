import * as React from "react"
import { cn } from "@/lib/utils"

/** Domain enums arrive as snake_case ids (channel_type, pitching_investors): show them as words. */
export const humanize = (id: string): string => id.replace(/_/g, " ")

export function Section({ title, children, className }: { title?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("space-y-2", className)}>
      {title ? <h3 className="text-sm font-semibold text-slate-900">{title}</h3> : null}
      {children}
    </section>
  )
}

export function BulletList({ items, empty }: { items: readonly string[]; empty?: string }) {
  if (items.length === 0) return empty ? <p className="text-sm text-slate-400">{empty}</p> : null
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-800">{children}</dd>
    </div>
  )
}

export function Panel({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function NotReady({ message }: { message: string }) {
  return <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">{message}</p>
}
