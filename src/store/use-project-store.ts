'use client'

import { create } from "zustand"
import { createProjectFromIdea } from "@/app/actions"
import { getProjectHistory, type HistoryItem } from "@/services/projects"

export type GenerationStep = "idle" | "analyzing" | "structuring" | "generating_models" | "completed"

export interface GeneratedBusinessModel {
  id: string
  title: string
  audience: string
  valueProposition: string
  description: string
}

interface GeneratedProject {
  id: string
  title: string
  idea: string
  models: GeneratedBusinessModel[]
}

interface ProjectStoreState {
  history: HistoryItem[]
  isLoading: boolean
  generationStep: GenerationStep
  generatedProject: GeneratedProject | null
  currentTempHistoryId?: string | null
  fetchHistory: () => Promise<void>
  addProjectFromIdea: (idea: string) => Promise<void>
  finalizeGeneratedProject: (modelId: string) => Promise<string>
  resetGenerationFlow: () => void
}

function mergeHistory(existingHistory: HistoryItem[], fetchedHistory: HistoryItem[]): HistoryItem[] {
  const mergedHistory = [...existingHistory]
  const existingIds = new Set(existingHistory.map((item) => item.id))

  for (const item of fetchedHistory) {
    if (!existingIds.has(item.id)) {
      mergedHistory.push(item)
    }
  }

  return mergedHistory
}

function buildMockModels(projectTitle: string, idea: string): GeneratedBusinessModel[] {
  const ideaSnippet = idea.trim().split(/\s+/).slice(0, 4).join(" ")
  const baseName = projectTitle.replace(/^Проєкт:\s*/, "").replace(/\.\.\.$/, "") || ideaSnippet || "Project"

  return [
    {
      id: "model-b2b-saas",
      title: `B2B SaaS · ${baseName}`,
      audience: "Функціональні команди середнього бізнесу",
      valueProposition: "Швидка автоматизація базових ESG та операційних процесів",
      description:
        "Продукт із підпискою, стандартним onboarding та високою повторюваністю виручки для команди.",
    },
    {
      id: "model-marketplace",
      title: `Marketplace · ${baseName}`,
      audience: "Постачальники та enterprise-клієнти з потребою в інтеграціях",
      valueProposition: "Зіставлення попиту й пропозиції через спільну платформу та каталоги",
      description:
        "Гнучка модель з транзакційною монетизацією, каталогом рішень і ширшим охопленням ринку.",
    },
    {
      id: "model-advisory",
      title: `Advisory Platform · ${baseName}`,
      audience: "Фаундери, аналітики та інноваційні команди",
      valueProposition: "Гібрид AI-консалтингу та автоматизованих артефактів для запуску",
      description:
        "Модель із premium-пакетами, експертною підтримкою та швидкою генерацією ринкових матеріалів.",
    },
  ]
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  history: [],
  isLoading: false,
  generationStep: "idle",
  generatedProject: null,
  currentTempHistoryId: null,
  fetchHistory: async () => {
    const fetchedHistory = await getProjectHistory()

    set((state) => ({
      history: mergeHistory(state.history, fetchedHistory),
    }))
  },
  addProjectFromIdea: async (idea: string) => {
    const tempId = `temp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`
    const ideaSnippet = idea.trim().split(/\s+/).slice(0,8).join(" ")
    const provisional: HistoryItem = {
      id: tempId,
      title: ideaSnippet ? `${ideaSnippet}...` : "Новий проєкт",
    }

    // add provisional entry immediately so the sidebar shows the generating project
    set((state) => ({
      history: [provisional, ...state.history],
      isLoading: true,
      generationStep: "analyzing",
      generatedProject: null,
      currentTempHistoryId: tempId,
    }))

    try {
      const result = await createProjectFromIdea(idea)

      if (!result.success) {
        // remove provisional entry on error
        set((state) => ({
          history: state.history.filter((h) => h.id !== tempId),
          generationStep: "idle",
          generatedProject: null,
          currentTempHistoryId: null,
        }))

        throw new Error(result.error)
      }

      await delay(800)
      set({ generationStep: "structuring" })

      await delay(800)
      set({ generationStep: "generating_models" })

      await delay(800)
      set({
        generatedProject: {
          id: result.data.id,
          title: result.data.title,
          idea,
          models: buildMockModels(result.data.title, idea),
        },
        generationStep: "completed",
      })
    } catch (error) {
      // ensure provisional is removed and state reset
      set((state) => ({
        history: state.history.filter((h) => h.id !== tempId),
        generationStep: "idle",
        generatedProject: null,
        currentTempHistoryId: null,
      }))

      if (error instanceof Error) {
        throw error
      }

      throw new Error("Сталася непередбачувана помилка")
    } finally {
      set({ isLoading: false })
    }
  },
  finalizeGeneratedProject: async (modelId: string) => {
    const generatedProject = get().generatedProject
    const tempHistoryId = get().currentTempHistoryId

    if (!generatedProject) {
      throw new Error("Немає згенерованого проєкту для збереження")
    }

    const selectedModel = generatedProject.models.find((model) => model.id === modelId)

    if (!selectedModel) {
      throw new Error("Не вдалося знайти вибрану модель")
    }


    const historyItem: HistoryItem = {
      id: generatedProject.id,
      title: `${selectedModel.title}`,
      empathy: {
        pains: [
          "Ризик людського фактору — помилки введення та ручна агрегація даних.",
          "Відсутність real-time CO2 трекінгу для прийняття швидких рішень.",
          "Обмежений бюджет на аналітику і інженерні інтеграції.",
        ],
        gains: [
          "Автоматизація звітів — швидка генерація стандартизованих документів.",
          "Доведення ROI для ради директорів через фінансові сценарії.",
          "Безшовна API інтеграція для зручної синхронізації даних.",
        ],
      },
    }

    set((state) => {
      // if there's a provisional entry for this generation, replace it with the real item
      let newHistory = state.history.filter((h) => h.id !== tempHistoryId)
      newHistory = [historyItem, ...newHistory]

      return {
        history: newHistory,
        generationStep: "idle",
        generatedProject: null,
        isLoading: false,
        currentTempHistoryId: null,
      }
    })

    return generatedProject.id
  },
  resetGenerationFlow: () => {
    set({
      generationStep: "idle",
      generatedProject: null,
      isLoading: false,
    })
  },
}))