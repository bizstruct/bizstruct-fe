export const scenarioStyles = {
  // Layout (mirrors EmpathyView structure)
  root:           "flex flex-col h-full",
  header:         "shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white",
  headerTitle:    "text-sm font-bold text-slate-800 tracking-tight",
  headerSubtitle: "text-[11px] text-slate-400 mt-0.5",
  body:           "flex-1 overflow-y-auto p-5",

  // Grid
  grid:            "grid grid-cols-1 lg:grid-cols-12 gap-5 items-start",
  personaCardWrap: "col-span-1 lg:col-span-4",
  timelineCardWrap:"col-span-1 lg:col-span-8",

  // Card shell (mirrors empathy map card)
  card:       "border shadow-sm rounded-xl overflow-hidden",
  cardInner:  "p-4",
  cardHeader: "flex items-center gap-2.5 mb-4",
  cardIcon:   "flex items-center justify-center h-6 w-6 rounded-md shrink-0",
  cardTitle:  "text-[13px] font-bold tracking-wide uppercase",

  // Persona card content
  personaTopRow: "flex items-center gap-3 mb-4 pb-4 border-b border-indigo-100",
  avatar:        "h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-bold shrink-0",
  personaName:   "text-sm font-semibold text-slate-900 leading-tight",
  personaRole:   "text-[11px] text-slate-400 mt-0.5",
  personaFields: "space-y-3",
  fieldLabel:    "text-[9px] text-slate-400 uppercase tracking-widest mb-1.5",
  roleBadge:     "block rounded-full px-3 py-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-100",
  painBadge:     "block rounded-full px-3 py-1 text-xs bg-rose-50 text-rose-700 border border-rose-100",

  // Timeline step items (card-item style instead of line)
  timelineSteps:   "space-y-2",
  timelineStep:    "flex items-start gap-3 rounded-lg px-3 py-2.5",
  timelineStepIcon:"flex items-center justify-center h-7 w-7 rounded-md shrink-0",
  timelineContent: "flex-1 min-w-0",
  timelineLabel:   "text-[10px] font-semibold uppercase tracking-wider mb-0.5",
  timelineText:    "text-[12.5px] leading-relaxed text-slate-700 font-medium",

  // Metrics section
  metricsCard:    "border shadow-sm rounded-xl overflow-hidden border-slate-100 bg-white",
  metricsInner:   "p-4",
  metricsHeader:  "flex items-center gap-2.5 mb-4",
  metricsTitle:   "text-[13px] font-bold tracking-wide uppercase",
  metricsGrid:    "grid grid-cols-2 gap-4",
  metricBefore:   "rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center",
  metricBeforeVal:"text-5xl font-bold text-slate-300 leading-none mb-2 border-b-2 border-transparent",
  metricAfter:    "rounded-xl border border-indigo-200 bg-indigo-50/40 p-5 text-center",
  metricAfterVal: "text-5xl font-bold text-indigo-600 leading-none mb-2 border-b-2 border-transparent",
  metricLabel:    "text-xs text-slate-500",
  metricAfterTag: "flex items-center justify-center gap-1.5 text-xs text-indigo-500 font-medium mt-0.5",

  // Inline editing
  editTextarea:      "w-full resize-none overflow-hidden bg-transparent text-[12.5px] leading-relaxed text-slate-800 font-medium focus:outline-none",
  editBadgeInput:    "block rounded-full px-3 py-1 text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-300 w-full",
  editMetricInput:   "w-full bg-transparent text-center border-b-2 focus:outline-none leading-none font-bold mb-2",
}
