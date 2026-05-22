"use client"

import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

// Фейкові картки активних проєктів для каруселі
const activeProjects = [
  { title: "EcoSync platform", desc: "AI-native ESG автоматизація для виробництва", status: "Q3 MVP" },
  { title: "SmartGrid Automation", desc: "Оптимізація енергомереж через ШІ", status: "Бетта" },
  { title: "CarbonTrack IoT", desc: "Пряма інтеграція з датчиками викидів", status: "Планування" },
  { title: "BioWaste Circular", desc: "Управління відходами агрокомплексів", status: "Дослідження" },
]

export default function HomePage() {
  return (
    <div className="flex flex-col justify-between h-full max-w-4xl mx-auto px-6 py-10">
      
      {/* 1. Верхній блок: Привітання */}
      <div className="text-center mt-12 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Створіть структуру вашого наступного проєкту
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Опишіть ідею, а штучний інтелект сформує бізнес-модель, архітектуру та PRD.
        </p>
      </div>

      {/* 2. Центральний блок: Поле вводу ідеї (AI Chat Input style) */}
      <div className="w-full max-w-2xl mx-auto mb-auto flex flex-col justify-center h-full">
        <div className="relative border border-slate-200 rounded-2xl bg-white p-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
          <textarea
            rows={3}
            placeholder="Введіть вашу бізнес-ідею тут (наприклад: сервіс для автоматичного трекінгу CO2 для заводів...)"
            className="w-full resize-none border-0 bg-transparent p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none min-h-[70px]"
          />
          <div className="flex justify-end pt-2">
            <Button 
              size="icon" 
              className="h-8 w-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Нижній блок: Карусель проєктів */}
      <div className="w-full mt-12 border-t border-slate-100 pt-8">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-sm font-medium text-slate-500">Ваші активні проєкти</h2>
        </div>

        <div className="px-10 relative">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {activeProjects.map((project, index) => (
                <CarouselItem key={index} className="md:col-span-1 md:basis-1/2 lg:basis-1/3">
                  <Card className="rounded-xl border-slate-200 bg-white shadow-none hover:border-slate-300 transition-colors cursor-pointer h-32 flex flex-col justify-between p-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 truncate">{project.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{project.desc}</p>
                    </div>
                    <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded self-start">
                      {project.status}
                    </span>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-2 border-slate-200 hover:bg-slate-50" />
            <CarouselNext className="absolute -right-2 border-slate-200 hover:bg-slate-50" />
          </Carousel>
        </div>
      </div>

    </div>
  )
}