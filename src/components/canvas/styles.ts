import { cn } from "@/lib/utils"

export const canvasStyles = {
  root:        "flex flex-col h-full",
  header:      "shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-slate-200 bg-white",
  headerTitle: "text-xs font-semibold text-slate-700",
  gridWrapper: "flex-1 overflow-auto p-4",
  grid:        "group grid grid-cols-10 grid-rows-[1fr_1fr_auto] gap-1.5 h-full min-h-[480px]",
  section:     (bg: string, border: string) => cn("flex flex-col gap-2 p-3 overflow-y-auto border rounded-lg", bg, border),
  sectionLabel:(text: string) => cn("flex items-center gap-1.5 shrink-0", text),
  sectionLabelText: "text-[10px] font-bold uppercase tracking-widest leading-none",
  card:        "group relative bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm hover:shadow-md transition-all",
  cardText:    "text-[11px] leading-snug text-slate-700 pr-4",
  cardActions: "absolute bottom-1.5 right-1.5 hidden group-hover:flex items-center gap-0.5",
  cardAiBadge: "absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-500",
  cardTextarea: "w-full resize-none rounded border border-indigo-300 bg-white px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200",
  emptySection: "flex-1 flex items-center justify-center border border-dashed border-slate-200 rounded-lg py-4",
  emptyText:    "text-[10px] text-slate-400",
  addButton:    (text: string) => cn("shrink-0 flex items-center gap-1 text-[10px] font-medium transition-opacity opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100", text),
  addTextarea:  "w-full resize-none rounded border border-indigo-300 bg-white px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200",
  inlineActions:"flex gap-1 justify-end",
}
