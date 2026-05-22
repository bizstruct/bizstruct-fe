import type { Project } from "@/services/projects"

export const activeProjects = [
  {
    id: "eco-sync-platform",
    translationKey: "ecoSync",
  },
  {
    id: "smart-grid-automation",
    translationKey: "smartGrid",
  },
  {
    id: "carbon-track-iot",
    translationKey: "carbonTrack",
  },
  {
    id: "bio-waste-circular",
    translationKey: "bioWaste",
  },
] as const satisfies Project[]
