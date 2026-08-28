import { API_ROUTES } from "@/constants/api"
import type { ScenarioData } from "@/schemas/scenario.schema"
import { apiGet, apiPut } from "./api-client"

// Scenario is single-language per project (part E — no more text_uk/text_en
// pairs); language is a project-level setting, not a `locale` query param.
// The backend validates every write against bizstruct_domain's Scenario
// model, so this layer no longer normalizes/fuzzy-matches values the way
// it used to when the old schema was locale-nested and inconsistently
// cased.

export async function getScenario(projectId: string): Promise<ScenarioData | null> {
  const raw = await apiGet<{ scenario: ScenarioData | null }>(API_ROUTES.scenario(projectId))
  return raw?.scenario ?? null
}

export async function saveScenario(projectId: string, data: ScenarioData): Promise<ScenarioData> {
  const raw = await apiPut<{ scenario: ScenarioData }>(API_ROUTES.scenario(projectId), data)
  return raw.scenario
}
