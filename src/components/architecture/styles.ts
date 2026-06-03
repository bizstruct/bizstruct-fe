export const architectureStyles = {
  root:            "overflow-y-auto h-full bg-slate-50",
  inner:           "mx-auto max-w-5xl px-6 py-10",

  // Header
  header:          "mb-8 flex items-start justify-between gap-4",
  headerLeft:      "min-w-0",
  headerLabel:     "text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400 mb-2",
  headerTitle:     "text-2xl font-bold text-slate-900",
  headerSubtitle:  "mt-1.5 text-sm text-slate-500 max-w-xl leading-relaxed",
  headerActions:   "flex items-center gap-2 shrink-0",

  // Cards row
  cardsWrap:       "grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 mb-10",

  // Individual card
  card:            "bg-white border border-slate-200 rounded-2xl shadow-sm p-7 flex flex-col gap-5",
  epicenterCard:        "border-t-4 border-t-indigo-500",
  epicenterCardChanged: "border-t-4 border-t-emerald-500 ring-1 ring-emerald-100",
  patternCard:          "border-t-4 border-t-violet-500",
  patternCardChanged:   "border-t-4 border-t-emerald-500 ring-1 ring-emerald-100",

  // Card internals
  cardTop:         "flex items-start justify-between gap-3",
  cardTopLeft:     "flex items-start gap-3 min-w-0 flex-1",
  cardIconIndigo:  "mt-0.5 h-10 w-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600",
  cardIconViolet:  "mt-0.5 h-10 w-10 shrink-0 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600",
  cardMeta:        "min-w-0 flex-1",
  cardTypeLabel:   "text-[10px] font-bold uppercase tracking-widest text-slate-400",
  cardTitleIndigo: "mt-1 text-base font-bold text-indigo-700 leading-snug outline-none cursor-text rounded px-0.5 -mx-0.5 focus:bg-indigo-50/60 transition-colors",
  cardTitleViolet: "mt-1 text-base font-bold text-violet-700 leading-snug outline-none cursor-text rounded px-0.5 -mx-0.5 focus:bg-violet-50/60 transition-colors",
  cardBadgeDetermined: "shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700",
  cardBadgeSystem:     "shrink-0 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500",

  // Divider between cards
  divider:         "hidden lg:flex flex-col items-center justify-center px-5 gap-2",
  dividerDot:      "h-1.5 w-1.5 rounded-full bg-slate-300",
  dividerLine:     "flex-1 w-px bg-slate-200",
  dividerPlus:     "text-sm font-bold text-slate-400 leading-none",

  // CTA
  cta:             "flex flex-col items-center gap-4",
  ctaArrow:        "text-slate-300",
  ctaBtn:          "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-xl px-8 h-12 text-sm gap-2.5 font-medium",

  // Description block (inside card, at bottom)
  descWrap:        "flex flex-col gap-1.5 pt-2 border-t border-slate-100 mt-auto",
  descLabel:       "text-[10px] font-bold uppercase tracking-widest text-slate-400",
  cardDesc:        "text-sm text-slate-600 leading-relaxed outline-none cursor-text rounded px-0.5 -mx-0.5 focus:bg-slate-100/60 transition-colors",

  // Subtype row (2nd level pattern selector)
  subtypeWrap:     "flex flex-col gap-1.5 pl-3 border-l-2 border-violet-100",
  subtypeLabel:    "text-[10px] font-bold uppercase tracking-widest text-violet-400",

  // Save button states
  saveBtnIdle:     "h-8 gap-1.5 text-xs font-medium cursor-not-allowed opacity-40",
  saveBtnDirty:    "h-8 gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white",
  saveBtnSaving:   "h-8 gap-1.5 text-xs font-medium bg-indigo-400 text-white cursor-wait",
  saveBtnSaved:    "h-8 gap-1.5 text-xs font-medium bg-emerald-600 text-white",
}
