"use client"

import { useState, type FormEvent } from "react"
import { ArrowUp, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { activeProjects } from "@/data/active-projects"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useProjectStore } from "@/store/use-project-store"

export default function HomePage() {
  const t = useTranslations("HomePage")
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const addProjectFromIdea = useProjectStore((state) => state.addProjectFromIdea)
  const isLoading = useProjectStore((state) => state.isLoading)

  async function handleProjectIdeaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    try {
      await addProjectFromIdea(text)
      setText("")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Сталася непередбачувана помилка"
      setError(message)
    }
  }

  return (
    <div className="flex flex-col justify-between h-full max-w-4xl mx-auto px-6 py-10">
      <div className="text-center mt-12 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {t("hero.title")}
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          {t("hero.subtitle")}
        </p>
      </div>

      <form onSubmit={handleProjectIdeaSubmit} className="w-full max-w-2xl mx-auto mb-auto flex flex-col justify-center h-full">
        <div className="relative border border-slate-200 rounded-2xl bg-white p-2 shadow-sm focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={3}
            placeholder={t("input.placeholder")}
            disabled={isLoading}
            className="w-full resize-none border-0 bg-transparent p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none min-h-[70px] disabled:cursor-not-allowed disabled:opacity-70"
          />
          {error && <p className="px-3 text-xs text-rose-500 font-medium mt-1.5">{error}</p>}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="icon"
              aria-label={t("input.submit")}
              disabled={isLoading}
              className="h-8 w-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </form>

      <div className="w-full mt-12 border-t border-slate-100 pt-8">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-sm font-medium text-slate-500">{t("projects.title")}</h2>
        </div>

        <div className="px-10 relative">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {activeProjects.map((project) => (
                <CarouselItem key={project.id} className="md:col-span-1 md:basis-1/2 lg:basis-1/3">
                  <Card className="rounded-xl border-slate-200 bg-white shadow-none hover:border-slate-300 transition-colors cursor-pointer h-32 flex flex-col justify-between p-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 truncate">
                        {t(`projects.items.${project.translationKey}.title`)}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {t(`projects.items.${project.translationKey}.description`)}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded self-start">
                      {t(`projects.items.${project.translationKey}.status`)}
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
