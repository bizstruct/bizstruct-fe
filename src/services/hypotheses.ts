import { API_ROUTES } from "@/constants/api"
import { HypothesisSchema } from "@/schemas/hypotheses.schema"
import type { Hypothesis } from "@/schemas/hypotheses.schema"
import { z } from "zod"
import { apiGet, apiPatch, parseOrLog } from "./api-client"

export async function getHypotheses(projectId: string): Promise<Hypothesis[]> {
  const raw = await apiGet<{ hypotheses: unknown }>(API_ROUTES.hypotheses(projectId))
  if (raw?.hypotheses == null) return []
  // ML stores {hypotheses:[...]}, frontend save stores [...] directly
  const items = Array.isArray(raw.hypotheses)
    ? raw.hypotheses
    : (raw.hypotheses as { hypotheses?: unknown[] }).hypotheses ?? []
  return parseOrLog(z.array(HypothesisSchema), items, "hypotheses")
}

export async function saveHypotheses(projectId: string, hypotheses: Hypothesis[]): Promise<void> {
  await apiPatch(API_ROUTES.hypotheses(projectId), { hypotheses })
}
