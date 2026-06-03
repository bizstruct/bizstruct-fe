export const canvasStyles = {
  root:          "flex flex-col h-full",
  header:        "shrink-0 flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white",
  headerTitle:   "text-sm font-bold text-slate-800 tracking-tight",

  gridWrapper:   "flex-1 overflow-y-auto p-4",
  grid:          "grid grid-cols-10 gap-2",

  // Section card shell (mirrors EmpathyCardList Card)
  card:          "border shadow-sm rounded-xl overflow-hidden",
  cardInner:     "p-3 flex flex-col",
  cardHeader:    "flex items-center gap-2 mb-2.5 shrink-0",
  cardTitle:     "text-[10px] font-bold tracking-widest uppercase",
  cardCount:     "ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
  cardAddBtn:    "rounded-md p-1 text-slate-400 hover:text-slate-700 hover:bg-white/70 transition-colors",

  // Items list
  list:          "space-y-1.5 mt-1",
  listItem:      "group flex items-start gap-1.5 rounded-lg px-2 py-2 cursor-grab active:cursor-grabbing",
  itemText:      "flex-1 text-[11.5px] leading-relaxed text-slate-700 font-medium",
  itemTextarea:  "flex-1 resize-none overflow-hidden bg-transparent text-[11.5px] leading-relaxed text-slate-800 font-medium focus:outline-none",
  grip:          "h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-300 group-hover:text-slate-400 transition-colors",
  itemDelete:    "shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-rose-500",
  aiBadge:       "shrink-0 mt-1 text-[8px] font-semibold text-indigo-400",

  emptyState:    "flex items-center justify-center rounded-lg border border-dashed border-slate-200 py-4",
  emptyText:     "text-[10px] text-slate-400 italic",
}
