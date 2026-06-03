import { API_ROUTES } from "@/constants/api"
import { ScenarioDataSchema } from "@/schemas/scenario.schema"
import type { ScenarioData } from "@/schemas/scenario.schema"
import { apiGet, apiPut } from "./api-client"

type RawMetricBlock = Record<string, string>
type RawTimeline = { icon_key?: string; iconKey?: string; label_key?: string; labelKey?: string; text: string; highlight?: boolean }
type RawPersona  = { name: string; initials: string; role: string; pain_point?: string; painPoint?: string }
type RawScenario = { persona: RawPersona; timeline: RawTimeline[]; metrics: { before: RawMetricBlock; after: RawMetricBlock } }

function pickMetricValue(block: RawMetricBlock): string {
  return block.report_time ?? block.value ?? Object.values(block)[0] ?? ""
}

function pickMetricDescription(block: RawMetricBlock): string {
  return block.description ?? block.label ?? ""
}

function normalize(raw: RawScenario): ScenarioData {
  return {
    persona: {
      name:       raw.persona.name,
      initials:   raw.persona.initials,
      role:       raw.persona.role,
      painPoint:  raw.persona.pain_point ?? raw.persona.painPoint ?? "",
    },
    timeline: raw.timeline.map((s) => ({
      iconKey:   (s.icon_key ?? s.iconKey ?? "sparkles").toLowerCase(),
      labelKey:  (s.label_key ?? s.labelKey ?? "").toLowerCase(),
      text:      s.text,
      highlight: s.highlight ?? false,
    })),
    metrics: {
      before: { value: pickMetricValue(raw.metrics.before), description: pickMetricDescription(raw.metrics.before) },
      after:  { value: pickMetricValue(raw.metrics.after),  description: pickMetricDescription(raw.metrics.after)  },
    },
  }
}

export async function saveScenario(projectId: string, data: ScenarioData): Promise<void> {
  await apiPut(API_ROUTES.scenario(projectId), data)
}

export async function getScenario(projectId: string, locale: string): Promise<ScenarioData | null> {
  const url = `${API_ROUTES.scenario(projectId)}?locale=${locale}`
  const raw = await apiGet<{ scenario: RawScenario | null }>(url)
  if (raw.scenario == null) return null
  return ScenarioDataSchema.parse(normalize(raw.scenario))
}
