"use client"

import React, { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
  BarChart3,
  FolderKanban,
  LibraryBig,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { activeProjects } from "@/data/active-projects"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useProjectStore } from "@/store/use-project-store"
import { type CarouselApi } from "@/components/ui/carousel"

type GenerationStageId = "analyzing" | "structuring" | "generating_models"

type GenerationStage = {
  id: GenerationStageId
  title: string
  description: string
}

const generationStages = [
  {
    id: "analyzing",
    title: "Аналіз вхідної ідеї...",
    description: "Оцінюємо контекст, сигнали ринку та потенційні ризики.",
  },
  {
    id: "structuring",
    title: "Аналіз ринку та конкурентів...",
    description: "Структуруємо логіку бізнесу, аудиторію та канали монетизації.",
  },
  {
    id: "generating_models",
    title: "Генерація архітектури бізнес-моделей...",
    description: "Формуємо декілька варіантів із різними сильними сторонами.",
  },
] as const satisfies readonly GenerationStage[]

export default function HomePage() {
  const t = useTranslations("HomePage")
  const router = useRouter()
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [activeModelIndex, setActiveModelIndex] = useState(0)
  const addProjectFromIdea = useProjectStore((state) => state.addProjectFromIdea)
  const finalizeGeneratedProject = useProjectStore((state) => state.finalizeGeneratedProject)
  const isLoading = useProjectStore((state) => state.isLoading)
  const generationStep = useProjectStore((state) => state.generationStep)
  const generatedProject = useProjectStore((state) => state.generatedProject)

  const isGenerating = isLoading || generationStep === "analyzing" || generationStep === "structuring" || generationStep === "generating_models"
  const isGenerated = generationStep === "completed" && generatedProject !== null

  const activeStageIndex = useMemo(() => {
    switch (generationStep) {
      case "analyzing":
        return 0
      case "structuring":
        return 1
      case "generating_models":
        return 2
      case "completed":
        return 2
      default:
        return -1
    }
  }, [generationStep])

  useEffect(() => {
    if (!carouselApi) return

    const updateIndex = () => setActiveModelIndex(carouselApi.selectedScrollSnap())

    updateIndex()
    carouselApi.on("select", updateIndex)
    carouselApi.on("reInit", updateIndex)

    return () => {
      carouselApi.off("select", updateIndex)
      carouselApi.off("reInit", updateIndex)
    }
  }, [carouselApi])

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

  async function handleSelectModel(modelId: string) {
    if (!generatedProject) {
      return
    }

    const projectId = await finalizeGeneratedProject(modelId)
    router.push(`/project/${projectId}/empathy-map`)
  }

  function renderGenerationScreen() {
    return (
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-600">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">Генерація бізнес-моделей</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Штучний інтелект послідовно аналізує ідею та формує декілька стратегічних варіантів.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {generationStages.map((stage, index) => {
              const isComplete = index < activeStageIndex
              const isActive = index === activeStageIndex

              return (
                <div
                  key={stage.id}
                  className={`flex items-start gap-4 rounded-2xl border px-4 py-4 transition-colors ${
                    isComplete
                      ? "border-emerald-200 bg-emerald-50/60 text-emerald-950"
                      : isActive
                        ? "border-violet-200 bg-violet-50 text-slate-900"
                        : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current/20 bg-white/80">
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isActive ? "animate-pulse" : ""}`}>{stage.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{stage.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  function renderModelSelectionScreen() {
    if (!generatedProject) {
      return null
    }
    return (
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
          <div className="mb-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Варіанти бізнес-моделей</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Оберіть найбільш сильну концепцію</h2>
          </div>

          <div className="relative mx-auto max-w-3xl">
            <Carousel
              setApi={setCarouselApi}
              opts={{ align: "start" }}
              className="w-full"
            >
              <CarouselContent>
                {generatedProject.models.map((model) => (
                  <CarouselItem key={model.id} className="basis-full">
                    <Card className="mx-auto w-full max-w-2xl rounded-[2rem] border-slate-200 bg-white shadow-none">
                      <div className="border-b border-slate-200 px-6 py-5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-500">Business Model</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{model.title}</h3>
                      </div>
                      <div className="space-y-5 px-6 py-6">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Цільова аудиторія</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{model.audience}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Ціннісна пропозиція</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{model.valueProposition}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Опис</p>
                          <p className="mt-2 text-sm leading-6 text-slate-500">{model.description}</p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => void handleSelectModel(model.id)}
                          className="mt-4 h-12 w-full rounded-2xl bg-violet-600 text-white shadow-none hover:bg-violet-700"
                        >
                          Вибрати цю модель
                        </Button>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => carouselApi?.scrollPrev()}
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                aria-label="Вліво"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => carouselApi?.scrollNext()}
                className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                aria-label="Вправо"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Carousel>

            <div className="mt-6 flex items-center justify-center gap-2">
              {generatedProject.models.map((model, index) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeModelIndex === index ? "w-8 bg-violet-600" : "w-2.5 bg-slate-300"
                  }`}
                  aria-label={`Перейти до моделі ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-between h-full max-w-4xl mx-auto px-6 py-10">
      {generationStep === "idle" && (
        <div className="text-center mt-12 mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {t("hero.title")}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {t("hero.subtitle")}
          </p>
        </div>
      )}

      {error && generationStep === "idle" && <p className="mx-auto mb-4 max-w-2xl text-center text-xs font-medium text-rose-500">{error}</p>}

      {isGenerated ? (
        renderModelSelectionScreen()
      ) : isGenerating ? (
        renderGenerationScreen()
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
