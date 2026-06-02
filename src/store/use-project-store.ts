'use client'

import { create } from "zustand"
import { createProjectFromIdea, fetchProjectById } from "@/app/actions"
import { getActiveProjects } from "@/services/projects"
import { mockDefaultCanvas } from "@/mocks/data/canvas"
import { createCard, moveCard } from "@/utils/mappers/canvas"
import type { HistoryItem } from "@/schemas/project.schema"
import type { CanvasSections, CanvasSectionKey, CanvasCard } from "@/schemas/canvas.schema"
import type { RawModelOption } from "@/app/actions"

export type { CanvasSectionKey, CanvasCard, CanvasSections }

export type GenerationStep = "idle" | "analyzing" | "structuring" | "generating_models" | "completed"

export const GENERATING_STEPS: GenerationStep[] = ["analyzing", "structuring", "generating_models"]

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

function normalizeModel(raw: RawModelOption): GeneratedBusinessModel {
  return {
    id:               raw.id,
    title:            raw.title,
    audience:         raw.audience,
    valueProposition: raw.value_proposition ?? raw.valueProposition ?? "",
    description:      raw.description,
  }
}

const POLL_INTERVAL_MS = 3000
const POLL_MAX_ATTEMPTS = 3 // DEV: low limit — increase to 40 when backend /api/projects/{id} is ready

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  history: [],
  isLoading: false,
  canvasSections: mockDefaultCanvas,
  generationStep: "idle",
  generatedProject: null,
  currentTempHistoryId: null,

  fetchHistory: async () => {
    try {
      const fetched = await getActiveProjects()
      set((state) => ({ history: mergeHistory(state.history, fetched) }))
    } catch (err) {
      console.error("[fetchHistory] failed:", err)
    }
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
      // Step 1: create project (returns immediately with status: "generating")
      const initial = await createProjectFromIdea(idea)
      if (!initial?.id) throw new Error("Не вдалося створити проєкт")

      set({ generationStep: "structuring" })

      // Step 2: poll until modelsOptions is populated
      let models: GeneratedBusinessModel[] | null = null
      let projectTitle = initial.title

      if (initial.modelsOptions?.length) {
        models = initial.modelsOptions.map(normalizeModel)
      } else {
        set({ generationStep: "generating_models" })
        for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
          await delay(POLL_INTERVAL_MS)
          const data = await fetchProjectById(initial.id)
          if (data?.modelsOptions?.length) {
            models = data.modelsOptions.map(normalizeModel)
            projectTitle = data.title ?? initial.title
            break
          }
        }
      }

      if (!models?.length) {
        // DEV fallback: endpoint not ready yet — use placeholder models
        models = [
          { id: "model-1", title: `B2B SaaS · ${ideaSnippet || "Project"}`,       audience: "SMB teams",        valueProposition: "Automates core workflow",       description: "Subscription model with fast onboarding." },
          { id: "model-2", title: `Marketplace · ${ideaSnippet || "Project"}`,    audience: "Enterprise buyers", valueProposition: "Connects supply and demand",     description: "Transaction-based monetization." },
          { id: "model-3", title: `Advisory Platform · ${ideaSnippet || "Project"}`, audience: "Founders & analysts", valueProposition: "AI-assisted strategy artifacts", description: "Premium packages with expert support." },
        ]
      }

      set({
        generatedProject: { id: initial.id, title: projectTitle, idea, models },
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
      id:    generatedProject.id,
      title: selectedModel.title,
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
