"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Plus, LayoutGrid, ArrowDown, Sparkles, ArrowLeft, RotateCcw } from "lucide-react"
import { useProjectStore } from "@/store/use-project-store"

export default function ArchitecturePage(): JSX.Element {
  const params = useParams() as { id?: string; locale?: string }
  const router = useRouter()
  const projectId = params?.id ?? "[id]"
  const [variant, setVariant] = useState<"original" | "regenerated">("original")
  const setStoreState = useProjectStore.setState
  const isLoading = useProjectStore((s) => s.isLoading)

  return (
    <div className="min-h-full bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push(`/project/${projectId}/what-if`)} className="-ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" /> Назад до штормінгу
            </Button>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Архітектурний профіль моделі</h1>
              <p className="mt-2 text-sm text-slate-500">Це архітектурний каркас, який AI визначив на основі ваших ввідних даних. Він слугуватиме фундаментом для генерації повної Business Model Canvas.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                // simulate regen: set global loading, wait 2s, then swap variant
                setStoreState({ isLoading: true })
                setTimeout(() => {
                  setVariant((v) => (v === "original" ? "regenerated" : "original"))
                  setStoreState({ isLoading: false })
                }, 2000)
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Змінити концепт
            </Button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 mb-8 relative">
          <Card className="flex w-full flex-col border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Епіцентр бізнес-моделі</div>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{variant === "original" ? "Епіцентр: Фінанси (Finance-Driven)" : "Епіцентр: Resource-Driven"}</h2>
                </div>
              </div>
              <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">Визначено</div>
            </div>

            <p className="mt-4 text-sm text-slate-600">{variant === "original" ? "Ваша модель будується навколо інноваційного способу монетизації та оптимізації грошових потоків. Основний акцент робиться на структурі витрат і потоках доходів." : "Ваша модель фокусується на оптимізації ресурсів та управлінні запасами, де ключовими метриками є ефективність використання ресурсів та зниження змінних витрат."}</p>
          </Card>

          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="h-full flex items-center">
              <div className="w-px h-24 border-dashed border-slate-200" />
            </div>
            <div className="-mt-8 flex items-center justify-center rounded-full bg-white p-2 shadow-sm">
              <Plus className="h-5 w-5 text-slate-400" />
            </div>
            <div className="w-px h-24 border-dashed border-slate-200 mt-2" />
          </div>

          <Card className="flex w-full flex-col border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500">Шаблон бізнес-моделі</div>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{variant === "original" ? "Шаблон: Freemium + Pay-per-use" : "Шаблон: Subscription-First"}</h2>
                </div>
              </div>
              <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">Системний підбір</div>
            </div>

            <p className="mt-4 text-sm text-slate-600">{variant === "original" ? "AI застосує структурні правила Freemium-моделей: безкоштовний перший крок для вірального росту та платні інструменти глибокого аналізу." : "AI рекомендує підхід Subscription-First: фокус на стабільному ARR через багаторівневі підписки з опціями додаткових інтеграцій."}</p>
          </Card>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-px h-12 border-dashed border-slate-200" />
          <div className="mt-4 rounded-full bg-white p-3 shadow-sm">
            <ArrowDown className="h-5 w-5 text-slate-700" />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => router.push(`/project/${projectId}/canvas`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-xl px-8 py-4"
          >
            <Sparkles className="mr-3 h-5 w-5" />
            Згенерувати повну Business Model Canvas
          </Button>
        </div>
      </div>
    </div>
  )
}
