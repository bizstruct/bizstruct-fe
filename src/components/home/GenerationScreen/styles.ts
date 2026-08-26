import { cva, type VariantProps } from "class-variance-authority"

export const stageItemVariants = cva(
  "flex items-start gap-4 rounded-2xl border px-4 py-4 transition-colors",
  {
    variants: {
      state: {
        complete: "border-emerald-200 bg-emerald-50/60 text-emerald-950",
        active:   "border-violet-200 bg-violet-50 text-slate-900",
        pending:  "border-slate-200 bg-white text-slate-400",
      },
    },
  }
)

export const stageTitleVariants = cva("text-sm font-medium", {
  variants: {
    active: {
      true:  "animate-pulse",
      false: "",
    },
  },
  defaultVariants: { active: false },
})

export type StageItemVariantProps = VariantProps<typeof stageItemVariants>
export type StageTitleVariantProps = VariantProps<typeof stageTitleVariants>

export const s = {
  root:         "flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-10",
  card:         "w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8",
  header:       "flex flex-col items-center gap-4 text-center",
  iconWrapper:  "flex h-16 w-16 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-600",
  title:        "text-xl font-semibold tracking-tight text-slate-900",
  subtitle:     "mt-2 text-sm leading-6 text-slate-500",
  stageList:    "mt-8 space-y-3",
  stageIconBox: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current/20 bg-white/80",
  stageContent: "min-w-0 flex-1",
  stageDesc:    "mt-1 text-xs leading-5 text-slate-500",
}
