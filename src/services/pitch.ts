import { API_ROUTES } from "@/constants/api"
import type { PitchData, StoryType } from "@/schemas/pitch.schema"
import type { Pitch as DomainPitch, InvestorSlide, CustomerSlide } from "@/types/domain/pitch"
import { apiGet, apiPatch } from "./api-client"

// Pitch is single-language per project (part E — no more headline_uk/
// headline_en, content_uk/content_en pairs); language is a project-level
// setting, not a viewer locale. The backend validates every write against
// bizstruct_domain's Pitch model. The audience field is `customer`, not
// `client` (see schemas/pitch.schema.ts).

function toCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

function toSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
}

function toPitchSteps(slides: (InvestorSlide | CustomerSlide)[], storyType: string) {
  return slides.map((s, i) => ({
    id: i + 1,
    titleKey: `${storyType}.${toCamel(s.type)}`,
    content: s.headline ? `<strong>${s.headline}</strong><br/>${s.content}` : s.content,
  }))
}

export async function getPitch(projectId: string): Promise<PitchData | null> {
  const raw = await apiGet<{ pitch: DomainPitch | null }>(API_ROUTES.pitch(projectId))
  if (!raw?.pitch) return null
  return {
    investor: toPitchSteps(raw.pitch.investor, "investor"),
    customer: toPitchSteps(raw.pitch.customer, "customer"),
  }
}

export async function savePitchStep(
  projectId: string,
  storyType: StoryType,
  titleKey: string,
  headline: string,
  content: string,
): Promise<void> {
  const slideType = toSnake(titleKey.split(".").pop() ?? "")
  const url = `${API_ROUTES.pitch(projectId)}/${storyType}/${slideType}`
  const body: Record<string, string> = { content }
  if (headline) body.headline = headline
  await apiPatch<void>(url, body)
}
