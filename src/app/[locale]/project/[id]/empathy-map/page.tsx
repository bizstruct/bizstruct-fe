"use client"

import React from "react"
import { MessageSquare, School, Activity, Heart, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { useProjectStore } from "@/store/use-project-store"

type Quote = { id: number; text: string }

export default function EmpathyMapPage(): JSX.Element {
  const params = useParams() as { id?: string }
  const router = useRouter()
  const projectId = params?.id ?? "[id]"

  const says: Quote[] = [
    { id: 1, text: "Нам потрібно автоматизувати ESG-звітність, щоб відповідати вимогам стейкхолдерів." },
    { id: 2, text: "Поточні процеси збору даних занадто повільні." },
  ]

  const thinks: Quote[] = [
    { id: 1, text: "Я хвилююся за точність даних перед наступним аудитом." },
    { id: 2, text: "Чи зможе новий інструмент безшовно інтегруватися з нашою SAP/Oracle ERP?" },
  ]

  const does: Quote[] = [
    { id: 1, text: "Щомісяця вручну збирає Excel-таблиці з різних департаментів." },
    { id: 2, text: "Презентує екологічні метрики раді директорів через статичні слайди." },
  ]

  const feels: Quote[] = [
    { id: 1, text: "Розгубленість через постійні зміни в глобальних екологічних регуляціях." },
    { id: 2, text: "Фрустрація через внутрішню закритість (silos) департаментів, що заважає збору даних." },
  ]

  const history = useProjectStore((s) => s.history)

  const defaultPains: string[] = [
    "Ризик людського фактору — помилки введення та ручна агрегація даних.",
    "Відсутність real-time CO2 трекінгу для прийняття швидких рішень.",
    "Обмежений бюджет на аналітику і інженерні інтеграції.",
  ]

  const defaultGains: string[] = [
    "Автоматизація звітів — швидка генерація стандартизованих документів.",
    "Доведення ROI для ради директорів через фінансові сценарії.",
    "Безшовна API інтеграція для зручної синхронізації даних.",
  ]

  const projectHistoryItem = history.find((h) => h.id === projectId)

  const pains: Quote[] = (projectHistoryItem?.empathy?.pains ?? defaultPains).map((text, i) => ({ id: i + 1, text }))
  const gains: Quote[] = (projectHistoryItem?.empathy?.gains ?? defaultGains).map((text, i) => ({ id: i + 1, text }))

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-geist text-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">Проєкти &gt; {projectId} &gt; <span className="text-slate-900">Карта емпатії</span></div>
          <h1 className="mt-3 text-3xl font-semibold">Карта емпатії користувача</h1>
          <p className="mt-2 text-sm text-slate-500">Цільова аудиторія: Середній бізнес, екологічні ініціативи | Роль: Corporate Env Manager</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => { /* TODO: regen */ }} className="text-sm">Перегенерувати</Button>
          <Button onClick={() => router.push(`/project/${projectId}/value-prop`)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Продовжити</Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Що говорить (Says)</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {says.map((q) => (
                <li key={q.id} className="rounded-md bg-slate-50 px-3 py-2">
                  <p className="text-sm text-slate-900">{q.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <School className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Що думає (Thinks)</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {thinks.map((q) => (
                <li key={q.id} className="rounded-md bg-slate-50 px-3 py-2">
                  <p className="text-sm text-slate-900">{q.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Що робить (Does)</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {does.map((q) => (
                <li key={q.id} className="rounded-md bg-slate-50 px-3 py-2">
                  <p className="text-sm text-slate-900">{q.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Що відчуває (Feels)</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {feels.map((q) => (
                <li key={q.id} className="rounded-md bg-slate-50 px-3 py-2">
                  <p className="text-sm text-slate-900">{q.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Summary: Pains & Gains */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Болі</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {pains.map((p) => (
                <li key={p.id} className="rounded-md bg-slate-50 px-3 py-2">
                  <p className="text-sm text-slate-900">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Вигоди</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {gains.map((g) => (
                <li key={g.id} className="rounded-md bg-slate-50 px-3 py-2">
                  <p className="text-sm text-slate-900">{g.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
