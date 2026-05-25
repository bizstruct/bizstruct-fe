export const hypothesesStyles = {
  root:        "flex flex-col h-full",
  header:      "shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-slate-200 bg-white",
  headerTitle: "text-xs font-semibold text-slate-700",
  body:        "flex-1 overflow-auto p-4",
  matrixWrap:  "flex h-full min-h-[400px] gap-2",
  yAxis:       "w-6 shrink-0 flex flex-col items-center justify-between py-1 text-[8px] font-bold uppercase tracking-widest text-slate-400",
  yLabel:      "[writing-mode:vertical-rl] rotate-180 tracking-[0.2em]",
  matrixInner: "flex-1 flex flex-col gap-1.5",
  grid:        "flex-1 grid grid-cols-2 grid-rows-2 border-l border-b border-slate-300 relative overflow-hidden rounded-br-sm",
  hDivider:    "absolute top-1/2 w-full border-t border-dashed border-slate-300 pointer-events-none z-20",
  vDivider:    "absolute left-1/2 h-full border-l border-dashed border-slate-300 pointer-events-none z-20",
  xAxis:       "flex items-center justify-between px-1 text-[8px] font-bold uppercase tracking-widest text-slate-400",
  legend:      "mt-3 flex items-center gap-4 text-[10px] text-slate-400",
  legendItem:  "flex items-center gap-1.5",
  legendDot:   (bg: string) => `h-2 w-2 rounded-full ${bg}`,
  legendDrag:  "ml-auto flex items-center gap-1",
  card:        "w-full bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col gap-1.5 cursor-grab active:cursor-grabbing select-none border-l-4 transition-all hover:shadow-md",
  cardId:      "text-[9px] font-bold tracking-widest uppercase text-slate-400",
  cardText:    "text-[11px] leading-snug text-slate-800",
  cardMeta:    "flex items-center gap-1",
  cardDot:     (bg: string) => `h-1.5 w-1.5 rounded-full ${bg}`,
  cardBadge:   (cls: string) => `text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${cls}`,
  cell:        (bg: string) => `relative flex flex-col overflow-y-auto transition-colors duration-100 ${bg}`,
  cellOver:    "bg-indigo-50/60 ring-2 ring-inset ring-indigo-200",
  cellWatermark: "absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.045]",
  cellWatermarkText: "text-2xl font-black text-slate-900 text-center whitespace-pre-line leading-tight",
  cellInner:   "relative z-10 flex flex-col gap-2 p-3",
  dropZone:    "rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50/50 h-12 flex items-center justify-center",
  dropZoneText: "text-[10px] font-semibold text-indigo-400",
}

export const HYP_CAT_CFG = {
  Desirability: { border: "border-l-sky-500",     dot: "bg-sky-500",     badge: "bg-sky-50 text-sky-700" },
  Viability:    { border: "border-l-emerald-500",  dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
  Feasibility:  { border: "border-l-teal-500",     dot: "bg-teal-500",    badge: "bg-teal-50 text-teal-700" },
} as const

export const HYP_Q_CFG = {
  q1: { watermarkKey: "HypothesesView.quadrants.q1", bg: "bg-amber-50/40" },
  q2: { watermarkKey: "HypothesesView.quadrants.q2", bg: "bg-emerald-50/30" },
  q3: { watermarkKey: "HypothesesView.quadrants.q3", bg: "bg-slate-50/60" },
  q4: { watermarkKey: "HypothesesView.quadrants.q4", bg: "bg-blue-50/30" },
} as const
