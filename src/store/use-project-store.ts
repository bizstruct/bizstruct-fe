'use client'

import { create } from "zustand"
import { createProjectFromIdea } from "@/app/actions"
import { getProjectHistory, type HistoryItem } from "@/services/projects"

interface ProjectStoreState {
  history: HistoryItem[]
  isLoading: boolean
  fetchHistory: () => Promise<void>
  addProjectFromIdea: (idea: string) => Promise<string>
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

export const useProjectStore = create<ProjectStoreState>((set) => ({
  history: [],
  isLoading: false,
  fetchHistory: async () => {
    const fetchedHistory = await getProjectHistory()

    set((state) => ({
      history: mergeHistory(state.history, fetchedHistory),
    }))
  },
  addProjectFromIdea: async (idea: string) => {
    set({ isLoading: true })

    try {
      const result = await createProjectFromIdea(idea)

      if (!result.success) {
        throw new Error(result.error)
      }

      set((state) => ({
        history: [result.data, ...state.history],
      }))

      return result.data.id
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }

      throw new Error("Сталася непередбачувана помилка")
    } finally {
      set({ isLoading: false })
    }
  },
}))