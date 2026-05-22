import type { HistoryItem } from "@/services/projects"

export const projectHistory = [
  {
    id: "eco-sync-manufacturing",
    title: "EcoSync Manufacturing",
    translationKey: "ecoSync",
  },
  {
    id: "green-logistics-ua",
    title: "GreenLogistics UA",
    translationKey: "greenLogistics",
  },
  {
    id: "carbon-track-iot",
    title: "CarbonTrack IoT",
    translationKey: "carbonTrack",
  },
  {
    id: "agro-esg-platform",
    title: "AgroESG Platform",
    translationKey: "agroEsg",
  },
] as const satisfies HistoryItem[]
