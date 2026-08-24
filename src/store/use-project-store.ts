'use client'

import { create } from "zustand"
import { createProjectFromIdea, fetchProjectById, selectProjectModel, saveModelsEdits, triggerRegenerateModels } from "@/app/actions"
import type { RawModelOption, RawProjectResponse } from "@/app/actions"
import { waitForProjectGeneration } from "@/services/pubsub"
import { getActiveProjects, deleteProjectById } from "@/services/projects"
import { apiAddCanvasCard, apiUpdateCanvasCard, apiDeleteCanvasCard } from "@/services/canvas"
import { mockDefaultCanvas } from "@/mocks/data/canvas"
import { createCard, moveCard } from "@/utils/mappers/canvas"
import type { HistoryItem } from "@/schemas/project.schema"
import type { CanvasSections, CanvasSectionKey, CanvasCard } from "@/schemas/canvas.schema"

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
  rawModelsOptions: { models: RawModelOption[]; selected_id: string | null } | null
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
  deleteProject: (id: string) => Promise<void>
  renameProject: (id: string, title: string) => void
  updateGeneratedModel: (modelId: string, field: keyof GeneratedBusinessModel, value: string) => Promise<void>
  regenerateModels: () => Promise<void>
  activeProjectId: string | null
  setActiveProjectId: (id: string) => void
  canvasSections: CanvasSections
  setCanvasSections: (sections: CanvasSections) => void
  addCanvasCard: (section: CanvasSectionKey, text: string, isAiGenerated?: boolean) => Promise<string>
  updateCanvasCard: (section: CanvasSectionKey, cardId: string, text: string) => Promise<void>
  deleteCanvasCard: (section: CanvasSectionKey, cardId: string) => Promise<void>
  moveCanvasCard: (from: { section: CanvasSectionKey; cardId: string }, to: { section: CanvasSectionKey; index: number }) => void
}

function mergeHistory(existing: HistoryItem[], fetched: HistoryItem[]): HistoryItem[] {
  const existingIds = new Set(existing.map((item) => item.id))
  return [...existing, ...fetched.filter((item) => !existingIds.has(item.id))]
}

const POLL_INTERVAL_MS  = 3000
const POLL_MAX_ATTEMPTS = 40

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeModel(raw: RawModelOption): GeneratedBusinessModel {
  return {
    id:               raw.id,
    title:            raw.name ?? raw.title ?? raw.id,
    audience:         raw.target_segment ?? raw.audience ?? "",
    valueProposition: raw.tagline ?? raw.value_proposition ?? raw.valueProposition ?? "",
    description:      raw.description,
  }
}

function extractModels(modelsOptions: RawProjectResponse["modelsOptions"]): RawModelOption[] {
  if (!modelsOptions) return []
  if (Array.isArray(modelsOptions)) return modelsOptions
  return modelsOptions.models ?? []
}


export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  history: [],
  isLoading: false,
  activeProjectId: null,
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

      let models: GeneratedBusinessModel[] | null = null
      let projectTitle = initial.title
      let rawModelsOptions: { models: RawModelOption[]; selected_id: string | null } | null = null

      const initialModels = extractModels(initial.modelsOptions)
      if (initialModels.length) {
        models = initialModels.map(normalizeModel)
        rawModelsOptions = Array.isArray(initial.modelsOptions)
          ? { models: initial.modelsOptions, selected_id: null }
          : (initial.modelsOptions as { models: RawModelOption[]; selected_id: string | null })
      } else {
        set({ generationStep: "generating_models" })
        try {
          const result = await waitForProjectGeneration(initial.id)
          if (result.status === "completed") {
            const data = await fetchProjectById(initial.id)
            const fetchedModels = extractModels(data?.modelsOptions ?? null)
            if (fetchedModels.length) {
              models = fetchedModels.map(normalizeModel)
              projectTitle = data?.title ?? initial.title
              const opts = data?.modelsOptions ?? null
              rawModelsOptions = opts
                ? Array.isArray(opts) ? { models: opts, selected_id: null } : opts as { models: RawModelOption[]; selected_id: string | null }
                : null
            }
          }
        } catch {
          // PubSub unavailable — fall back to polling
          for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
            await delay(POLL_INTERVAL_MS)
            const data = await fetchProjectById(initial.id)
            const fetchedModels = extractModels(data?.modelsOptions ?? null)
            if (fetchedModels.length) {
              models = fetchedModels.map(normalizeModel)
              projectTitle = data?.title ?? initial.title
              const opts = data?.modelsOptions ?? null
              rawModelsOptions = opts
                ? Array.isArray(opts) ? { models: opts, selected_id: null } : opts as { models: RawModelOption[]; selected_id: string | null }
                : null
              break
            }
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
        generatedProject: { id: initial.id, title: projectTitle, idea, models, rawModelsOptions },
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

    if (generatedProject.rawModelsOptions) {
      await selectProjectModel(generatedProject.id, generatedProject.rawModelsOptions, modelId).catch(() => {})
    }

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

  deleteProject: async (id) => {
    if (!id.startsWith("temp-")) {
      await deleteProjectById(id)
    }
    set((state) => ({ history: state.history.filter((h) => h.id !== id) }))
  },

  renameProject: (id, title) => set((state) => ({
    history: state.history.map((h) => h.id === id ? { ...h, title } : h),
  })),

  updateGeneratedModel: async (modelId, field, value) => {
    const { generatedProject } = get()
    if (!generatedProject) return

    const updatedModels = generatedProject.models.map((m) =>
      m.id === modelId ? { ...m, [field]: value } : m
    )

    const updatedRaw = generatedProject.rawModelsOptions
      ? {
          ...generatedProject.rawModelsOptions,
          models: generatedProject.rawModelsOptions.models.map((r) => {
            if (r.id !== modelId) return r
            return {
              ...r,
              name: field === "title" ? value : r.name,
              title: field === "title" ? value : r.title,
              target_segment: field === "audience" ? value : r.target_segment,
              audience: field === "audience" ? value : r.audience,
              tagline: field === "valueProposition" ? value : r.tagline,
              value_proposition: field === "valueProposition" ? value : r.value_proposition,
              description: field === "description" ? value : r.description,
            }
          }),
        }
      : null

    set((state) => ({
      generatedProject: state.generatedProject
        ? { ...state.generatedProject, models: updatedModels, rawModelsOptions: updatedRaw }
        : null,
    }))

    if (updatedRaw && generatedProject.id) {
      await saveModelsEdits(generatedProject.id, updatedRaw).catch(() => {})
    }
  },

  regenerateModels: async () => {
    const { generatedProject } = get()
    if (!generatedProject) return

    set({ generationStep: "generating_models" })

    try {
      await triggerRegenerateModels(generatedProject.id)

      const result = await waitForProjectGeneration(generatedProject.id)
      if (result.status === "completed") {
        const data = await fetchProjectById(generatedProject.id)
        const fetchedModels = extractModels(data?.modelsOptions ?? null)
        if (fetchedModels.length) {
          const models = fetchedModels.map(normalizeModel)
          const opts = data?.modelsOptions ?? null
          const rawModelsOptions = opts
            ? Array.isArray(opts) ? { models: opts, selected_id: null } : opts as { models: RawModelOption[]; selected_id: string | null }
            : null
          set((state) => ({
            generatedProject: state.generatedProject
              ? { ...state.generatedProject, models, rawModelsOptions }
              : null,
            generationStep: "completed",
          }))
          return
        }
      }
    } catch {
      // PubSub unavailable — fall back to polling
      for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
        await delay(POLL_INTERVAL_MS)
        const data = await fetchProjectById(generatedProject.id)
        const fetchedModels = extractModels(data?.modelsOptions ?? null)
        if (fetchedModels.length) {
          const models = fetchedModels.map(normalizeModel)
          const opts = data?.modelsOptions ?? null
          const rawModelsOptions = opts
            ? Array.isArray(opts) ? { models: opts, selected_id: null } : opts as { models: RawModelOption[]; selected_id: string | null }
            : null
          set((state) => ({
            generatedProject: state.generatedProject
              ? { ...state.generatedProject, models, rawModelsOptions }
              : null,
            generationStep: "completed",
          }))
          return
        }
      }
    }

    set({ generationStep: "completed" })
  },

  setCanvasSections: (sections) => set({ canvasSections: sections }),

  setActiveProjectId: (id) => set({ activeProjectId: id }),

  addCanvasCard: async (section, text, isAiGenerated = false) => {
    const { activeProjectId, canvasSections } = get()
    // Optimistic update with a temp id
    const tempCard = createCard(canvasSections, section, text, isAiGenerated)
    set((state) => ({
      canvasSections: { ...state.canvasSections, [section]: [tempCard, ...state.canvasSections[section]] },
    }))
    if (activeProjectId) {
      try {
        const saved = await apiAddCanvasCard(activeProjectId, section, text)
        if (saved) {
          set((state) => ({
            canvasSections: {
              ...state.canvasSections,
              [section]: state.canvasSections[section].map((c) => c.id === tempCard.id ? saved : c),
            },
          }))
          return saved.id
        }
      } catch {
        // Keep optimistic card on failure
      }
    }
    return tempCard.id
  },

  updateCanvasCard: async (section, cardId, text) => {
    set((state) => ({
      canvasSections: {
        ...state.canvasSections,
        [section]: state.canvasSections[section].map((c) => (c.id === cardId ? { ...c, text } : c)),
      },
    }))
    const { activeProjectId } = get()
    if (activeProjectId) {
      await apiUpdateCanvasCard(activeProjectId, section, cardId, text).catch(() => {})
    }
  },

  deleteCanvasCard: async (section, cardId) => {
    set((state) => ({
      canvasSections: {
        ...state.canvasSections,
        [section]: state.canvasSections[section].filter((c) => c.id !== cardId),
      },
    }))
    const { activeProjectId } = get()
    if (activeProjectId) {
      await apiDeleteCanvasCard(activeProjectId, section, cardId).catch(() => {})
    }
  },

  moveCanvasCard: (from, to) => {
    set((state) => ({
      canvasSections: moveCard(state.canvasSections, from, to),
    }))
  },
}))
