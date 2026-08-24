import { cn } from "@/lib/utils"

export const homeStyles = {
  root:        "flex flex-col justify-between h-full max-w-4xl mx-auto px-6 py-10",
  hero:        "text-center mt-12 mb-8",
  heroTitle:   "text-3xl font-semibold tracking-tight text-slate-900",
  heroSubtitle:"text-sm text-slate-400 mt-2",
}

export const ideaFormStyles = {
  form:         "w-full max-w-2xl mx-auto mb-auto flex flex-col justify-center h-full",
  inputWrapper: "relative border border-slate-200 rounded-2xl bg-white p-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all",
  textarea:     "w-full resize-none border-0 bg-transparent p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none min-h-[70px] disabled:cursor-not-allowed disabled:opacity-70",
  error:        "px-3 text-xs text-rose-500 font-medium mt-1.5",
  submitRow:    "flex justify-end pt-2",
  submitBtn:    "h-8 w-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed",
}


export const modelSelectionStyles = {
  root:          "flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-8",
  container:     "w-full max-w-3xl",
  header:        "mb-6 text-center",
  label:         "text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400",
  title:         "mt-1 text-2xl font-semibold tracking-tight text-slate-900",
  carouselWrap:  "relative mx-auto max-w-3xl",
  card:          "mx-auto w-full max-w-2xl rounded-[2rem] border-slate-200 bg-white shadow-none",
  cardHeader:    "border-b border-slate-200 px-6 py-5",
  cardBadge:     "text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-500",
  cardTitle:     "mt-2 text-2xl font-semibold tracking-tight text-slate-900",
  cardBody:      "space-y-5 px-6 py-6",
  fieldLabel:    "text-xs font-semibold uppercase tracking-[0.22em] text-slate-400",
  fieldValue:    "mt-2 text-sm leading-6 text-slate-600",
  fieldValueMuted: "mt-2 text-sm leading-6 text-slate-500",
  selectBtn:     "mt-4 h-12 w-full rounded-2xl bg-violet-600 text-white shadow-none hover:bg-violet-700",
  navBtn:        "rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
  navBtnPrev:    "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  navBtnNext:    "absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  dots:          "mt-6 flex items-center justify-center gap-2",
  dot:           (active: boolean) => cn("h-2.5 rounded-full transition-all", active ? "w-8 bg-violet-600" : "w-2.5 bg-slate-300"),
  actionBtns:    "flex gap-2 pt-1",
  secondaryBtn:  "flex-1 h-10 rounded-xl border-slate-200 text-xs font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-800",
}
