export const hypothesesStyles = {
  root:        "flex flex-col h-full",
  header:      "shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-slate-200 bg-white",
  headerTitle: "text-[11px] font-semibold text-slate-600 tracking-wide",
  body:        "flex-1 overflow-auto p-4 bg-[#f7f8fb]",
  matrixWrap:  "flex gap-3",
  yAxis:       "w-5 shrink-0 flex flex-col items-center justify-between py-1 text-[8px] font-black uppercase tracking-widest text-slate-300",
  yLabel:      "[writing-mode:vertical-rl] rotate-180 tracking-[0.18em]",
  matrixInner: "flex-1 flex flex-col gap-2 min-w-0",
  grid:        "grid grid-cols-2 gap-px bg-slate-200/80 rounded-2xl overflow-hidden shadow-md",
  hDivider:    "",
  vDivider:    "",
  xAxis:       "flex items-center justify-between px-1 text-[8px] font-black uppercase tracking-widest text-slate-300",
  legend:      "mt-3 flex items-center gap-5 text-[10px] text-slate-400",
  legendItem:  "flex items-center gap-1.5",
  legendDot:   (bg: string) => `h-2 w-2 rounded-full ${bg}`,
  legendDrag:  "ml-auto flex items-center gap-1 text-slate-300",
  // card
  card:        "w-full bg-white rounded-xl p-3 shadow-sm flex flex-col gap-1.5 cursor-grab active:cursor-grabbing select-none border-l-[3px] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ring-1 ring-slate-900/[0.06]",
  cardHeader:  "flex items-center justify-between",
  cardId:      "text-[9px] font-mono font-bold tracking-[0.12em] uppercase text-slate-300",
  cardText:    "text-[11.5px] leading-snug text-slate-800 font-medium",
  cardMeta:    "flex items-center gap-1.5",
  cardDot:     (bg: string) => `h-1.5 w-1.5 rounded-full shrink-0 ${bg}`,
  cardBadge:   (cls: string) => `text-[9px] font-bold px-2 py-[3px] rounded-full tracking-wide ${cls}`,
  // cell
  cell:        (bg: string) => `relative flex flex-col min-h-[140px] transition-all duration-150 ${bg}`,
  cellOver:    "ring-2 ring-inset ring-indigo-300/70 brightness-[0.98]",
  cellWatermark: "absolute bottom-2.5 right-3 z-10 pointer-events-none select-none text-right",
  cellWatermarkText: (color: string) => `text-[7px] font-black uppercase tracking-[0.14em] leading-[1.55] whitespace-pre-line ${color}`,
  cellInner:   "relative z-10 flex flex-col gap-2 p-3",
  dropZone:    "rounded-xl border-2 border-dashed border-indigo-300/70 bg-indigo-50/70 h-14 flex items-center justify-center",
  dropZoneText: "text-[9px] font-bold text-indigo-400 uppercase tracking-widest",
}

export const HYP_CAT_CFG = {
  desirability: { border: "border-l-sky-500",     dot: "bg-sky-500",     badge: "bg-sky-50 text-sky-700" },
  viability:    { border: "border-l-emerald-500",  dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
  feasibility:  { border: "border-l-teal-500",     dot: "bg-teal-500",    badge: "bg-teal-50 text-teal-700" },
} as const

export const HYP_Q_CFG = {
  q1: {
    watermarkKey: "HypothesesView.quadrants.q1",
    bg: "bg-gradient-to-br from-amber-50 to-orange-50/40",
    labelColor: "text-amber-900/[0.18]",
    tagBg: "bg-amber-100/90 border border-amber-200/80",
    tagText: "text-amber-700",
  },
  q2: {
    watermarkKey: "HypothesesView.quadrants.q2",
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50/50",
    labelColor: "text-emerald-900/[0.18]",
    tagBg: "bg-emerald-100/90 border border-emerald-200/80",
    tagText: "text-emerald-700",
  },
  q3: {
    watermarkKey: "HypothesesView.quadrants.q3",
    bg: "bg-slate-50/90",
    labelColor: "text-slate-500/[0.15]",
    tagBg: "bg-slate-100/90 border border-slate-200/80",
    tagText: "text-slate-400",
  },
  q4: {
    watermarkKey: "HypothesesView.quadrants.q4",
    bg: "bg-gradient-to-br from-sky-50/80 to-blue-50/40",
    labelColor: "text-sky-900/[0.18]",
    tagBg: "bg-sky-100/90 border border-sky-200/80",
    tagText: "text-sky-600",
  },
} as const

export const HYP_Q_META = {
  q1: { icon: "zap",      label: "Investigate" },
  q2: { icon: "star",     label: "Validated"   },
  q3: { icon: "archive",  label: "Ignore"      },
  q4: { icon: "bookmark", label: "Parked"      },
} as const
