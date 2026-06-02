import { API_ROUTES } from "@/constants/api"
import { HypothesisSchema } from "@/schemas/hypotheses.schema"
import type { Hypothesis } from "@/schemas/hypotheses.schema"
import { z } from "zod"
import { apiGet, parseOrLog } from "./api-client"

export async function getHypotheses(projectId: string): Promise<Hypothesis[]> {
  const raw = await apiGet<{ hypotheses: unknown[] | null }>(API_ROUTES.hypotheses(projectId))
  if (raw.hypotheses == null) return []
  return parseOrLog(z.array(HypothesisSchema), raw.hypotheses, "hypotheses")
}
