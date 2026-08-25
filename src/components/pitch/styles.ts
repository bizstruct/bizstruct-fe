export const pitchStyles = {
  // ── shell ─────────────────────────────────────────────────────────────────
  root:          "flex flex-col h-full",
  header:        "shrink-0 flex items-center px-5 py-3 border-b border-slate-200 bg-white",
  headerTitle:   "text-sm font-semibold text-slate-900",
  headerLeft:    "flex-1 flex items-center",
  headerCenter:  "flex items-center",
  headerRight:   "flex-1 flex items-center justify-end gap-2",
  tabGroup:           "flex items-center rounded-xl bg-slate-100 p-1 gap-0.5",
  tabActiveInvestor:  "px-5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-indigo-600 shadow-sm text-white",
  tabActiveCustomer:  "px-5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-teal-600 shadow-sm text-white",
  tabInactive:        "px-5 py-1.5 rounded-lg text-xs font-medium transition-all text-slate-500 hover:text-slate-700 hover:bg-white/60",
  regenBtn:      "h-7 gap-1.5 text-xs font-semibold tracking-wide transition-colors bg-indigo-600 hover:bg-indigo-700 text-white",
  body:          "flex-1 flex overflow-hidden",

  // ── step sidebar ──────────────────────────────────────────────────────────
  stepList:      "w-52 shrink-0 border-r border-slate-200 overflow-y-auto bg-slate-50/60 p-3 flex flex-col gap-1",
  stepBtn:       "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all w-full",
  stepBtnActive: "bg-white shadow-sm border border-slate-200",
  stepBtnInact:  "hover:bg-white/70",
  stepNumActive: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold bg-indigo-600 text-white",
  stepNumDone:   "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold bg-emerald-500 text-white",
  stepNumPend:   "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold border border-slate-300 text-slate-400",
  stepLabel:     "text-[11px] font-medium leading-tight",
  stepLabelAct:  "text-slate-900",
  stepLabelInact:"text-slate-500",
  progress:      "mt-auto pt-3 px-1",
  progressBar:   "h-1 w-full rounded-full bg-slate-200",
  progressFill:  "h-1 rounded-full bg-indigo-500 transition-all",
  progressText:  "mt-1 text-[9px] text-slate-400 text-center",

  // ── content panel ─────────────────────────────────────────────────────────
  content:       "flex-1 flex flex-col overflow-hidden bg-slate-50/70",
  contentBody:   "flex-1 overflow-y-auto flex justify-center px-8 py-8",

  // ── slide card ────────────────────────────────────────────────────────────
  slideCard:     "w-full max-w-2xl h-fit bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden",
  slideAccentBar:"h-[3px] w-full shrink-0",
  slideInner:    "px-9 py-7 flex flex-col gap-5",

  slideMeta:     "flex items-center gap-2",
  slideBadge:    "inline-flex items-center text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full",
  slideCounter:  "ml-auto text-[11px] text-slate-300 font-medium tabular-nums",

  headlineWrap:  "flex flex-col",
  headlineInput: "w-full resize-none overflow-hidden bg-transparent text-[22px] font-bold text-slate-900 leading-snug focus:outline-none placeholder:text-slate-300 tracking-tight",
  slideDivider:  "h-px w-full shrink-0",
  bodyTextarea:  "w-full resize-none overflow-hidden bg-transparent text-[14px] leading-[1.85] text-slate-600 focus:outline-none placeholder:text-slate-300",

  // ── footer ────────────────────────────────────────────────────────────────
  footer:        "shrink-0 border-t border-slate-200 bg-white px-6 py-3 flex items-center justify-between",
  footerLabel:   "text-[11px] font-medium text-slate-400",

  // ── save button states ────────────────────────────────────────────────────
  saveBtnIdle:   "h-7 gap-1.5 text-xs font-semibold cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-100",
  saveBtnDirty:  "h-7 gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white",
  saveBtnSaving: "h-7 gap-1.5 text-xs font-semibold bg-indigo-400 text-white cursor-wait",
  saveBtnSaved:  "h-7 gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-600 text-white",
}

export type StepColors = { bar: string; badge: string; badgeBg: string; divider: string }

export const STEP_COLORS: Record<string, StepColors> = {
  hook:           { bar: "bg-amber-400",   badge: "text-amber-700",   badgeBg: "bg-amber-50",   divider: "bg-amber-100"   },
  problem:        { bar: "bg-rose-500",    badge: "text-rose-700",    badgeBg: "bg-rose-50",    divider: "bg-rose-100"    },
  solution:       { bar: "bg-indigo-500",  badge: "text-indigo-700",  badgeBg: "bg-indigo-50",  divider: "bg-indigo-100"  },
  traction:       { bar: "bg-emerald-500", badge: "text-emerald-700", badgeBg: "bg-emerald-50", divider: "bg-emerald-100" },
  ask:            { bar: "bg-violet-500",  badge: "text-violet-700",  badgeBg: "bg-violet-50",  divider: "bg-violet-100"  },
  opening:        { bar: "bg-sky-400",     badge: "text-sky-700",     badgeBg: "bg-sky-50",     divider: "bg-sky-100"     },
  empathy:        { bar: "bg-pink-500",    badge: "text-pink-700",    badgeBg: "bg-pink-50",    divider: "bg-pink-100"    },
  transformation: { bar: "bg-indigo-500",  badge: "text-indigo-700",  badgeBg: "bg-indigo-50",  divider: "bg-indigo-100"  },
  socialProof:    { bar: "bg-teal-500",    badge: "text-teal-700",    badgeBg: "bg-teal-50",    divider: "bg-teal-100"    },
  invitation:     { bar: "bg-amber-500",   badge: "text-amber-700",   badgeBg: "bg-amber-50",   divider: "bg-amber-100"   },
}

export const DEFAULT_STEP_COLORS: StepColors = {
  bar: "bg-slate-300", badge: "text-slate-600", badgeBg: "bg-slate-100", divider: "bg-slate-100",
}
