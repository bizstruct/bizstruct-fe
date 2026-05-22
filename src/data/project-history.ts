import type { HistoryItem } from "@/services/projects"

export const projectHistory = [
  {
    id: "eco-sync-manufacturing",
    translationKey: "ecoSync",
  },
  {
    id: "green-logistics-ua",
    translationKey: "greenLogistics",
  },
  {
    id: "carbon-track-iot",
    translationKey: "carbonTrack",
  },
  {
    id: "agro-esg-platform",
    translationKey: "agroEsg",
  },
] as const satisfies HistoryItem[]
