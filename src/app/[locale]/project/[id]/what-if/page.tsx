"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowRight, Coins, Cpu, HeartHandshake } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type VectorId = "financial" | "technical" | "emotional" | "standard-b2b-saas"

type VectorCard = {
  id: Exclude<VectorId, "standard-b2b-saas">
  badge: string
  title: string
  prompt: string
  accent: string
  border: string
  icon: React.ReactNode
  blocks: Array<{
    label: string
    text: string
  }>
}

const vectorCards: VectorCard[] = [
  {
    id: "financial",
    badge: "💰 Фінансова інновація",
    title: "А що, як зробити сервіс повністю безкоштовним, а заробляти лише на результаті клієнта?",
    prompt: "Фокус на бар'єрі входу, швидкому масштабуванні та моделі оплати за успіх.",
    accent: "text-indigo-600 group-hover:text-indigo-700",
    border: "border-t-indigo-500",
    icon: <Coins className="h-5 w-5" />,
    blocks: [
      {
        label: "Value",
        text: "Нульовий фінансовий поріг входу, миттєва довіра та ширший ринок для залучення нових команд.",
      },
      {
        label: "Revenue",
        text: "Монетизація через success fee, частку від заощаджень або преміальні аналітичні пакети.",
      },
    ],
  },
  {
    id: "technical",
    badge: "⚙️ Технологічний прорив",
    title: "А що, як повністю відмовитися від веб-інтерфейсу (No-UI) і працювати тільки через AI-асистента?",
    prompt: "Фокус на автоматизації, голосових сценаріях і прихованій складності замість класичного UI.",
    accent: "text-teal-600 group-hover:text-teal-700",
    border: "border-t-teal-500",
    icon: <Cpu className="h-5 w-5" />,
    blocks: [
      {
        label: "Value",
        text: "Менше тертя для користувача, швидші дії та відчуття, що продукт працює автономно.",
      },
      {
        label: "Cost",
        text: "Скорочення витрат на фронтенд-команди, але зростання вимог до AI-інфраструктури та інтеграцій.",
      },
    ],
  },
  {
    id: "emotional",
    badge: "🤝 Супер-сервіс для Олени",
    title: "А що, як сфокусуватися на психологічному спокої Олени, а не лише на функціональній ефективності?",
    prompt: "Фокус на знятті тривожності, чітких підказках і високому рівні сервісної підтримки.",
    accent: "text-slate-700 group-hover:text-slate-900",
    border: "border-t-slate-600",
    icon: <HeartHandshake className="h-5 w-5" />,
    blocks: [
      {
        label: "Value",
        text: "Олена отримує відчуття контролю, ясність наступних кроків та впевненість у результаті.",
      },
      {
        label: "Relationships",
        text: "Продукт стає надійним партнером, а не просто інструментом, що зменшує опір змінам.",
      },
    ],
  },
]

export default function WhatIfPage(): JSX.Element {
  const params = useParams() as { id?: string; locale?: string }
  const router = useRouter()
  const projectId = params?.id ?? "[id]"
  const locale = params?.locale ?? "en"
  const [selectedVector, setSelectedVector] = useState<VectorId | null>(null)

  function applyVector(vectorId: VectorId) {
    setSelectedVector(vectorId)
    console.log("what-if vector selected", { projectId, vectorId })
    router.push(`/${locale}/project/${projectId}/canvas`)
  }

  return (
    <div className="min-h-full bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        <header className="max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Креативний штормінг</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[0.08em] text-slate-900 sm:text-5xl">
            Креативний штормінг: Провокації «What-If»
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            ШІ проаналізував емпатію Олени та твій сценарій. Оберіть один із стратегічних векторів інновацій, щоб зламати шаблони ринку та виділитися серед конкурентів.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8 w-full">
          {vectorCards.map((card) => {
            const isSelected = selectedVector === card.id

            return (
              <Card
                key={card.id}
                className={`group flex h-full flex-col border border-slate-200 border-t-4 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 ${card.border} ${isSelected ? "ring-2 ring-offset-2 ring-offset-slate-50 ring-slate-900/10" : ""}`}
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                    <span>{card.icon}</span>
                    <span>{card.badge}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-700">
                      {card.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className={`text-xl font-semibold leading-7 transition-colors ${card.accent}`}>
                        {card.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-slate-500">{card.prompt}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {card.blocks.map((block) => (
                    <div key={block.label} className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{block.label}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{block.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <Button
                    type="button"
                    onClick={() => applyVector(card.id)}
                    className="h-11 w-full rounded-2xl bg-slate-900 text-white shadow-none transition-colors hover:bg-slate-800"
                  >
                    Застосувати цей вектор
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => applyVector("standard-b2b-saas")}
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          Ні, йдемо стандартним шляхом B2B SaaS
        </button>
      </div>
    </div>
  )
}