import { API_ROUTES } from "@/constants/api"
import { PitchDataSchema } from "@/schemas/pitch.schema"
import type { PitchData } from "@/schemas/pitch.schema"
import { apiGet } from "./api-client"

type RawStep = { type: string; headline: string; content: string }
type RawPitch = { investor?: RawStep[]; client?: RawStep[]; customer?: RawStep[] }

function toCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

function normalizeSteps(steps: RawStep[], storyType: string) {
  return steps.map((s, i) => ({
    id:       i + 1,
    titleKey: `${storyType}.${toCamel(s.type)}`,
    content:  s.headline ? `<strong>${s.headline}</strong><br/>${s.content}` : s.content,
  }))
}

export async function getPitch(projectId: string, locale: string): Promise<PitchData | null> {
  const url = `${API_ROUTES.pitch(projectId)}?locale=${locale}`
  const envelope = await apiGet<{ pitch: RawPitch | null }>(url)
  if (envelope.pitch == null) return null
  const raw = envelope.pitch
  return PitchDataSchema.parse({
    investor: normalizeSteps(raw.investor ?? [], "investor"),
    customer: normalizeSteps(raw.client ?? raw.customer ?? [], "customer"),
  })
}
