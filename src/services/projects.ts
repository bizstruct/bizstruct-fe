import { API_ROUTES } from "@/constants/api"
import { ProjectSchema, HistoryItemSchema } from "@/schemas/project.schema"
import type { Project, HistoryItem } from "@/schemas/project.schema"
import { z } from "zod"
import { apiGet } from "./api-client"

export type { Project, HistoryItem }

export async function getActiveProjects(): Promise<Project[]> {
  const data = await apiGet<unknown[]>(API_ROUTES.projects)
  return z.array(ProjectSchema).parse(data)
}

export async function getProjectHistory(): Promise<HistoryItem[]> {
  const data = await apiGet<unknown[]>(API_ROUTES.projectsHistory)
  return z.array(HistoryItemSchema).parse(data)
}
