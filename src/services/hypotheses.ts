import { API_ROUTES } from "@/constants/api"
import { HypothesisSchema } from "@/schemas/hypotheses.schema"
import type { Hypothesis } from "@/schemas/hypotheses.schema"
import { z } from "zod"
import { apiGet } from "./api-client"

export async function getHypotheses(projectId: string): Promise<Hypothesis[]> {
  const data = await apiGet<unknown[]>(API_ROUTES.hypotheses(projectId))
  return z.array(HypothesisSchema).parse(data)
}
