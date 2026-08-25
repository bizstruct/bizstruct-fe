import { API_ROUTES } from "@/constants/api"
import type { Hypothesis } from "@/schemas/hypotheses.schema"
import { apiGet, apiPatch } from "./api-client"

// bizstruct-be's _block_response wraps every block under its own key, and
// the stored value here is itself the domain model's {hypotheses: [...]}
// wrapper — so a GET response is double-nested: {hypotheses: {hypotheses:
// [...]}}. This isn't defensive guesswork the way the old unwrap was
// (before the backend consistently stored the wrapped shape, the outer
// value could be either a bare array or {hypotheses: [...]}) — it's now a
// fixed, known shape.
interface HypothesesResponse {
  hypotheses: { hypotheses: Hypothesis[] } | null
}

export async function getHypotheses(projectId: string): Promise<Hypothesis[]> {
  const raw = await apiGet<HypothesesResponse>(API_ROUTES.hypotheses(projectId))
  return raw?.hypotheses?.hypotheses ?? []
}

export async function saveHypotheses(projectId: string, hypotheses: Hypothesis[]): Promise<Hypothesis[]> {
  const raw = await apiPatch<HypothesesResponse>(API_ROUTES.hypotheses(projectId), { hypotheses })
  return raw?.hypotheses?.hypotheses ?? []
}
