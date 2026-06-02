export const empathyStyles = {
  root:          "flex flex-col h-full",
  header:        "shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white",
  headerLeft:    "",
  headerTitle:   "text-sm font-bold text-slate-800 tracking-tight",
  headerSubtitle:"text-[11px] text-slate-400 mt-0.5",
  body:          "flex-1 overflow-y-auto p-5",
  topGrid:       "grid grid-cols-2 gap-4 mb-4",
  bottomGrid:    "grid grid-cols-2 gap-4",

  card:          "border shadow-sm rounded-xl overflow-hidden",
  cardInner:     "p-4",
  cardHeader:    "flex items-center gap-2.5 mb-3.5",
  cardTitle:     "text-[13px] font-bold tracking-wide uppercase",
  cardAddBtn:    "ml-auto rounded-md p-1 text-slate-400 hover:text-slate-700 hover:bg-white/70 transition-colors",

  emptyState:    "flex items-center justify-center rounded-lg border border-dashed border-slate-200 py-6",
  emptyText:     "text-xs text-slate-400 italic",

  list:          "space-y-2",
  listItem:      "group flex items-start gap-2 rounded-lg px-3 py-2.5 cursor-grab active:cursor-grabbing",
  itemText:      "flex-1 text-[12.5px] leading-relaxed text-slate-700 font-medium",
  itemTextarea:  "flex-1 resize-none overflow-hidden bg-transparent text-[12.5px] leading-relaxed text-slate-800 font-medium focus:outline-none",
  itemDelete:    "shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-rose-500",
  grip:          "h-3.5 w-3.5 mt-1 shrink-0 text-slate-300 group-hover:text-slate-400 transition-colors",

  saveBtnSaved:  "h-7 gap-1.5 text-xs font-semibold tracking-wide transition-colors bg-emerald-600 hover:bg-emerald-700",
  saveBtnDefault:"h-7 gap-1.5 text-xs font-semibold tracking-wide transition-colors bg-indigo-600 hover:bg-indigo-700",
}
