import { API_ROUTES } from "@/constants/api"
import type { PitchData, StoryType } from "@/schemas/pitch.schema"
import type { Pitch as DomainPitch, InvestorSlide, CustomerSlide } from "@/types/domain/pitch"
import { apiGet, apiPatch } from "./api-client"

// Pitch stores both languages inline per slide (headline_uk/headline_en,
// content_uk/content_en) — like architecture/empathy_map/scenario, not as
// a {uk:..., en:...} wrapper. The backend validates every write against
// bizstruct_domain's Pitch model. The audience field is `customer`, not
// `client` (see schemas/pitch.schema.ts).

function toCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

function toSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
}

type FieldLocale = "uk" | "en"

function toFieldLocale(locale: string): FieldLocale {
  return locale === "uk" ? "uk" : "en"
}

function headlineField(locale: string): "headline_uk" | "headline_en" {
  return `headline_${toFieldLocale(locale)}`
}

function contentField(locale: string): "content_uk" | "content_en" {
  return `content_${toFieldLocale(locale)}`
}

function toPitchSteps(slides: (InvestorSlide | CustomerSlide)[], storyType: string, locale: string) {
  const hField = headlineField(locale)
  const cField = contentField(locale)
  return slides.map((s, i) => ({
    id: i + 1,
    titleKey: `${storyType}.${toCamel(s.type)}`,
    content: s[hField] ? `<strong>${s[hField]}</strong><br/>${s[cField]}` : s[cField],
  }))
}

export async function getPitch(projectId: string, locale: string): Promise<PitchData | null> {
  const raw = await apiGet<{ pitch: DomainPitch | null }>(API_ROUTES.pitch(projectId))
  if (!raw?.pitch) return null
  return {
    investor: toPitchSteps(raw.pitch.investor, "investor", locale),
    customer: toPitchSteps(raw.pitch.customer, "customer", locale),
  }
}

export async function savePitchStep(
  projectId: string,
  locale: string,
  storyType: StoryType,
  titleKey: string,
  headline: string,
  content: string,
): Promise<void> {
  const slideType = toSnake(titleKey.split(".").pop() ?? "")
  const url = `${API_ROUTES.pitch(projectId)}/${storyType}/${slideType}`
  const body: Record<string, string> = { [contentField(locale)]: content }
  if (headline) body[headlineField(locale)] = headline
  await apiPatch<void>(url, body)
}
