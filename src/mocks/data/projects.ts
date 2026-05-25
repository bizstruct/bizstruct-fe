import type { Project, HistoryItem } from "@/schemas/project.schema"

export const mockActiveProjects: Project[] = [
  { id: "eco-sync-platform",    translationKey: "ecoSync" },
  { id: "smart-grid-automation", translationKey: "smartGrid" },
  { id: "carbon-track-iot",     translationKey: "carbonTrack" },
  { id: "bio-waste-circular",   translationKey: "bioWaste" },
]

export const mockProjectHistory: HistoryItem[] = [
  { id: "eco-sync-manufacturing", title: "EcoSync Manufacturing",  translationKey: "ecoSync" },
  { id: "green-logistics-ua",     title: "GreenLogistics UA",      translationKey: "greenLogistics" },
  { id: "carbon-track-iot",       title: "CarbonTrack IoT",        translationKey: "carbonTrack" },
  { id: "agro-esg-platform",      title: "AgroESG Platform",       translationKey: "agroEsg" },
]
