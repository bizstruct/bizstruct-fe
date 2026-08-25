'use client'

import { create } from "zustand"
import { createProjectFromIdea, fetchProjectById, selectProjectModel, saveModelsEdits, triggerRegenerateModels } from "@/app/actions"
import type { ModelsOptionsPayload, RawProjectResponse } from "@/app/actions"
import type { BusinessModelOption } from "@/types/domain/models-options"
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
  monetization: string
  keyMetric: string
  timeToValue: string
  score: number
  scoreRationale: string
}

interface GeneratedProject {
  id: string
  title: string
  idea: string
  models: GeneratedBusinessModel[]
  rawModelsOptions: ModelsOptionsPayload | null
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

function normalizeModel(raw: BusinessModelOption): GeneratedBusinessModel {
  return {
    id:               raw.id,
    title:            raw.title,
    audience:         raw.audience,
    valueProposition: raw.value_proposition,
    description:      raw.description,
    monetization:     raw.monetization,
    keyMetric:        raw.key_metric,
    timeToValue:      raw.time_to_value,
    score:            raw.score,
    scoreRationale:   raw.score_rationale,
  }
}

function extractModels(modelsOptions: RawProjectResponse["modelsOptions"]): BusinessModelOption[] {
  return modelsOptions?.options ?? []
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
      let rawModelsOptions: ModelsOptionsPayload | null = null

      const initialModels = extractModels(initial.modelsOptions)
      if (initialModels.length) {
        models = initialModels.map(normalizeModel)
        rawModelsOptions = initial.modelsOptions
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
              rawModelsOptions = data?.modelsOptions ?? null
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
              rawModelsOptions = data?.modelsOptions ?? null
              break
            }
          }
        }
      }

      if (!models?.length) {
        // DEV fallback: endpoint not ready yet — use placeholder models
        models = [
          { id: "model-1", title: `B2B SaaS · ${ideaSnippet || "Project"}`,       audience: "SMB teams",        valueProposition: "Automates core workflow",       description: "Subscription model with fast onboarding.", monetization: "subscription",      keyMetric: "MRR / NRR",        timeToValue: "30 minutes to first report",  score: 78, scoreRationale: "Placeholder — subscription directly monetizes a recurring pain." },
          { id: "model-2", title: `Marketplace · ${ideaSnippet || "Project"}`,    audience: "Enterprise buyers", valueProposition: "Connects supply and demand",     description: "Transaction-based monetization.",           monetization: "transaction_fee",   keyMetric: "GMV / Take rate",  timeToValue: "First transaction in 1–2 weeks", score: 65, scoreRationale: "Placeholder — higher upside per transaction, longer sales cycle." },
          { id: "model-3", title: `Advisory Platform · ${ideaSnippet || "Project"}`, audience: "Founders & analysts", valueProposition: "AI-assisted strategy artifacts", description: "Premium packages with expert support.",    monetization: "retainer_plus_saas", keyMetric: "ACV / CSAT",       timeToValue: "First session in 48 hours",   score: 55, scoreRationale: "Placeholder — high value per client, limited scalability." },
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

    // Only the free-text fields sourced from BusinessModelOption's
    // user-facing fields are user-editable (see ModelSelectionScreen's
    // EditableField). monetization/key_metric/time_to_value/score/
    // score_rationale are generated, display-only — not part of this map.
    const RAW_FIELD_BY_UI_FIELD: Partial<Record<keyof GeneratedBusinessModel, keyof BusinessModelOption>> = {
      title: "title",
      audience: "audience",
      valueProposition: "value_proposition",
      description: "description",
    }
    const rawField = RAW_FIELD_BY_UI_FIELD[field]

    const updatedRaw = generatedProject.rawModelsOptions && rawField
      ? {
          ...generatedProject.rawModelsOptions,
          options: generatedProject.rawModelsOptions.options.map((r) =>
            r.id === modelId ? { ...r, [rawField]: value } : r
          ),
        }
      : generatedProject.rawModelsOptions

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
          const rawModelsOptions = data?.modelsOptions ?? null
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
          const rawModelsOptions = data?.modelsOptions ?? null
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
