'use client'

import { create } from "zustand"
import { createProjectFromIdea } from "@/app/actions"
import { getProjectHistory } from "@/services/projects"
import { mockDefaultCanvas } from "@/mocks/data/canvas"
import { buildMockModels } from "@/mocks/data/generation"
import { createCard, moveCard } from "@/utils/mappers/canvas"
import type { HistoryItem } from "@/schemas/project.schema"
import type { CanvasSections, CanvasSectionKey, CanvasCard } from "@/schemas/canvas.schema"

export type { CanvasSectionKey, CanvasCard, CanvasSections }

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
  currentTempHistoryId: string | null
  fetchHistory: () => Promise<void>
  addProjectFromIdea: (idea: string) => Promise<void>
  finalizeGeneratedProject: (modelId: string) => Promise<string>
  resetGenerationFlow: () => void
  canvasSections: CanvasSections
  addCanvasCard: (section: CanvasSectionKey, text: string, isAiGenerated?: boolean) => string
  updateCanvasCard: (section: CanvasSectionKey, cardId: string, text: string) => void
  deleteCanvasCard: (section: CanvasSectionKey, cardId: string) => void
  moveCanvasCard: (from: { section: CanvasSectionKey; cardId: string }, to: { section: CanvasSectionKey; index: number }) => void
}

function mergeHistory(existing: HistoryItem[], fetched: HistoryItem[]): HistoryItem[] {
  const existingIds = new Set(existing.map((item) => item.id))
  return [...existing, ...fetched.filter((item) => !existingIds.has(item.id))]
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  history: [],
  isLoading: false,
  canvasSections: mockDefaultCanvas,
  generationStep: "idle",
  generatedProject: null,
  currentTempHistoryId: null,

  fetchHistory: async () => {
    const fetched = await getProjectHistory()
    set((state) => ({ history: mergeHistory(state.history, fetched) }))
  },

  addProjectFromIdea: async (idea: string) => {
    const tempId      = `temp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
    const ideaSnippet = idea.trim().split(/\s+/).slice(0, 8).join(" ")
    const provisional: HistoryItem = { id: tempId, title: ideaSnippet ? `${ideaSnippet}...` : "Новий проєкт" }

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
        set((state) => ({
          history: state.history.filter((h) => h.id !== tempId),
          generationStep: "idle",
          generatedProject: null,
          currentTempHistoryId: null,
        }))
        throw new Error(result.error)
      }

      await delay(800); set({ generationStep: "structuring" })
      await delay(800); set({ generationStep: "generating_models" })
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
      set((state) => ({
        history: state.history.filter((h) => h.id !== tempId),
        generationStep: "idle",
        generatedProject: null,
        currentTempHistoryId: null,
      }))
      throw error instanceof Error ? error : new Error("Сталася непередбачувана помилка")
    } finally {
      set({ isLoading: false })
    }
  },

  finalizeGeneratedProject: async (modelId: string) => {
    const { generatedProject, currentTempHistoryId } = get()
    if (!generatedProject) throw new Error("Немає згенерованого проєкту для збереження")

    const selectedModel = generatedProject.models.find((m) => m.id === modelId)
    if (!selectedModel) throw new Error("Не вдалося знайти вибрану модель")

    const historyItem: HistoryItem = {
      id: generatedProject.id,
      title: selectedModel.title,
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

    set((state) => ({
      history: [historyItem, ...state.history.filter((h) => h.id !== currentTempHistoryId)],
      generationStep: "idle",
      generatedProject: null,
      isLoading: false,
      currentTempHistoryId: null,
    }))

    return generatedProject.id
  },

  resetGenerationFlow: () => set({ generationStep: "idle", generatedProject: null, isLoading: false }),

  addCanvasCard: (section, text, isAiGenerated = false) => {
    const sections = get().canvasSections
    const card     = createCard(sections, section, text, isAiGenerated)
    set((state) => ({
      canvasSections: { ...state.canvasSections, [section]: [card, ...state.canvasSections[section]] },
    }))
    return card.id
  },

  updateCanvasCard: (section, cardId, text) => {
    set((state) => ({
      canvasSections: {
        ...state.canvasSections,
        [section]: state.canvasSections[section].map((c) => (c.id === cardId ? { ...c, text } : c)),
      },
    }))
  },

  deleteCanvasCard: (section, cardId) => {
    set((state) => ({
      canvasSections: {
        ...state.canvasSections,
        [section]: state.canvasSections[section].filter((c) => c.id !== cardId),
      },
    }))
  },

  moveCanvasCard: (from, to) => {
    set((state) => ({
      canvasSections: moveCard(state.canvasSections, from, to),
    }))
  },
}))
