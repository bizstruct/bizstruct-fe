import { API_ROUTES } from "@/constants/api"
import { PitchDataSchema } from "@/schemas/pitch.schema"
import type { PitchData, StoryType } from "@/schemas/pitch.schema"
import { apiGet, apiPatch, apiPost } from "./api-client"

type RawStep  = { type: string; headline?: string; content: string }
type RawPitch = { investor?: RawStep[]; client?: RawStep[]; customer?: RawStep[] }
type ApiResponse = PitchData | { pitch: RawPitch | null }

function toCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

function toSnake(s: string): string {
  return s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
}

export async function validatePitch(projectId: string, locale: string): Promise<void> {
  await apiPost<void>(`${API_ROUTES.pitch(projectId)}/validate?locale=${locale}`, {})
}

export async function savePitchStep(
  projectId: string,
  locale: string,
  storyType: StoryType,
  titleKey: string,
  headline: string,
  content: string,
): Promise<void> {
  const pitchType = storyType === "investor" ? "investor" : "client"
  const slideType = toSnake(titleKey.split(".").pop() ?? "")
  const url = `${API_ROUTES.pitch(projectId)}/${pitchType}/${slideType}?locale=${locale}`
  await apiPatch<void>(url, { headline: headline || undefined, content })
}

function normalizeSteps(steps: RawStep[], storyType: string) {
  return steps.map((s, i) => ({
    id:       i + 1,
    titleKey: `${storyType}.${toCamel(s.type)}`,
    content:  s.headline ? `<strong>${s.headline}</strong><br/>${s.content}` : s.content,
  }))
}

export async function getPitch(projectId: string, locale: string): Promise<PitchData | null> {
  const url  = `${API_ROUTES.pitch(projectId)}?locale=${locale}`
  const body = await apiGet<ApiResponse>(url)
  if (!body) return null

  // Already-normalized PitchData (investor/customer arrays of PitchStep)
  if ("investor" in body || "customer" in body) {
    return PitchDataSchema.parse({
      investor: (body as PitchData).investor ?? [],
      customer: (body as PitchData).customer ?? [],
    })
  }

  // Raw backend envelope: { pitch: RawPitch | null }
  const raw = (body as { pitch: RawPitch | null }).pitch
  if (!raw) return null
  return PitchDataSchema.parse({
    investor: normalizeSteps(raw.investor ?? [], "investor"),
    customer: normalizeSteps(raw.client ?? raw.customer ?? [], "customer"),
  })
}
