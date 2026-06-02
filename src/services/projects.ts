import { API_ROUTES } from "@/constants/api"
import { ProjectSchema } from "@/schemas/project.schema"
import type { Project, HistoryItem } from "@/schemas/project.schema"
import { z } from "zod"
import { apiGet, apiDelete, parseOrLog } from "./api-client"

export type { Project, HistoryItem }

export async function getActiveProjects(): Promise<Project[]> {
  const data = await apiGet<unknown[]>(API_ROUTES.projects)
  return parseOrLog(z.array(ProjectSchema), data, "projects")
}

export async function deleteProjectById(id: string): Promise<void> {
  await apiDelete(`${API_ROUTES.projects}/${id}`)
}
