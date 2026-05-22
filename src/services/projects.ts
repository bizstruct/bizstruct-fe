import { activeProjects } from "@/data/active-projects"
import { projectHistory } from "@/data/project-history"

export interface Project {
  id: string
  translationKey: "ecoSync" | "smartGrid" | "carbonTrack" | "bioWaste"
}

export interface HistoryItem {
  id: string
  title: string
  translationKey?: "ecoSync" | "greenLogistics" | "carbonTrack" | "agroEsg"
  empathy?: {
    pains: string[]
    gains: string[]
  }
}

const NETWORK_DELAY_MS = 500

async function simulateNetworkDelay() {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS))
}

export async function getActiveProjects(): Promise<Project[]> {
  await simulateNetworkDelay()

  return [...activeProjects]
}

export async function getProjectHistory(): Promise<HistoryItem[]> {
  await simulateNetworkDelay()

  return [...projectHistory]
}
