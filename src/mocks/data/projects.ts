import type { Project, HistoryItem } from "@/schemas/project.schema"

export const mockActiveProjects: Project[] = [
  { id: "eco-sync-platform",     title: "EcoSync Platform" },
  { id: "smart-grid-automation", title: "Smart Grid Automation" },
  { id: "carbon-track-iot",      title: "CarbonTrack IoT" },
  { id: "bio-waste-circular",    title: "BioWaste Circular" },
]

export const mockProjectHistory: HistoryItem[] = [
  { id: "eco-sync-manufacturing", title: "EcoSync Manufacturing" },
  { id: "green-logistics-ua",     title: "GreenLogistics UA" },
  { id: "carbon-track-iot",       title: "CarbonTrack IoT" },
  { id: "agro-esg-platform",      title: "AgroESG Platform" },
]
