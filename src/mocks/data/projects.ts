import type { Project, HistoryItem } from "@/schemas/project.schema"

export const mockActiveProjects: Project[] = [
  { id: "eco-sync-platform",     title: "EcoSync Platform",      language: "en" },
  { id: "smart-grid-automation", title: "Smart Grid Automation", language: "en" },
  { id: "carbon-track-iot",      title: "CarbonTrack IoT",       language: "en" },
  { id: "bio-waste-circular",    title: "BioWaste Circular",     language: "en" },
]

export const mockProjectHistory: HistoryItem[] = [
  { id: "eco-sync-manufacturing", title: "EcoSync Manufacturing", language: "en" },
  { id: "green-logistics-ua",     title: "GreenLogistics UA",     language: "en" },
  { id: "carbon-track-iot",       title: "CarbonTrack IoT",       language: "en" },
  { id: "agro-esg-platform",      title: "AgroESG Platform",      language: "en" },
]
