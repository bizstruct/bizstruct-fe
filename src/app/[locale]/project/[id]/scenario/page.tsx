"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Target, Sparkles, Zap } from "lucide-react"

export default function ScenarioPage(): JSX.Element {
  const params = useParams() as { id?: string; locale?: string }
  const router = useRouter()
  const projectId = params?.id ?? "[id]"
  const locale = params?.locale ?? "en"

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-geist">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-sm text-slate-500">Проєкти &gt; {projectId} &gt; <span className="text-slate-900">Сценарій користувача</span></div>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Сценарій користувача: EcoSync</h1>
          <p className="mt-2 text-sm text-slate-500">Візуалізація шляху користувача та цінності продукту для корпоративного сегменту</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-sm">Перегенерувати</Button>
          <Button
            onClick={() => router.push(`/${locale}/project/${projectId}/what-if`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
          >
            Продовжити до Креативного штормінгу
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left: Persona */}
        <div className="col-span-1 lg:col-span-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold">О</div>
              <div>
                <div className="text-lg font-medium text-slate-900">Олена</div>
                <div className="text-sm text-slate-500">Корпоративний менеджер з екології</div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Роль</div>
                <div className="mt-2 inline-block rounded-full px-3 py-1 text-sm bg-slate-100 text-slate-700">Відповідальна за ESG-звітність, збір даних</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Больова точка</div>
                <div className="mt-2 inline-block rounded-full px-3 py-1 text-sm bg-rose-50 text-rose-700">Розрізнені Excel-таблиці, помилки введення</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Timeline */}
        <div className="col-span-1 lg:col-span-8">
          <Card className="p-6">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />

              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex items-start gap-6">
                  <div className="w-12 flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Контекст</div>
                    <div className="mt-1 text-slate-900 font-medium">Кінець кварталу — Олена має терміново підготувати звіт</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-6">
                  <div className="w-12 flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                      <Target className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Ціль</div>
                    <div className="mt-1 text-slate-900 font-medium">Збір даних — консолідувати викиди із 3 регіональних офісів</div>
                  </div>
                </div>

                {/* Step 3 (Product) */}
                <div className="flex items-start gap-6">
                  <div className="w-12 flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="text-sm text-slate-500">Дія в BuzStruct</div>
                    <div className="mt-1 rounded-lg border border-indigo-150 bg-indigo-50/30 p-4">
                      <div className="text-slate-900 font-medium">Автоматизація</div>
                      <div className="mt-2 text-sm text-slate-500">Логін → Один клік → Автогенерація звіту та AI-інсайти</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom: Metrics */}
      <Card className="p-6">
        <h2 className="text-xl text-slate-900 font-medium text-center">Результат впровадження — Економія часу та підвищення якості аналітики</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-6">
          <Card className="p-6 border border-dashed">
            <div className="text-6xl font-semibold text-slate-400 text-center">3 Дні</div>
            <div className="mt-3 text-center text-sm text-slate-500">Ручний збір даних з Excel — багато ручної праці</div>
          </Card>

          <Card className="p-6 border border-indigo-200">
            <div className="text-6xl font-semibold text-indigo-600 text-center">15 Хвилин</div>
            <div className="mt-3 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-indigo-600" />
              <span>Готовий звіт з AI-аналітикою — мінімум ручної праці</span>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  )
}
