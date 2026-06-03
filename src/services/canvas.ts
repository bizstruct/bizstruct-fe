import { API_ROUTES } from "@/constants/api"
import { CanvasSectionsSchema } from "@/schemas/canvas.schema"
import type { CanvasSections, CanvasCard, CanvasSectionKey } from "@/schemas/canvas.schema"
import { apiGet, apiPost, apiPatch, apiPut, apiDelete } from "./api-client"

// Backend uses snake_case section names
const SECTION_MAP: Record<string, CanvasSectionKey> = {
  key_partners:           "keyPartners",
  key_activities:         "keyActivities",
  key_resources:          "keyResources",
  value_propositions:     "valuePropositions",
  customer_relationships: "customerRelationships",
  channels:               "channels",
  customer_segments:      "customerSegments",
  cost_structure:         "costStructure",
  revenue_streams:        "revenueStreams",
}

export const SECTION_KEY_TO_API: Record<CanvasSectionKey, string> = {
  keyPartners:           "key_partners",
  keyActivities:         "key_activities",
  keyResources:          "key_resources",
  valuePropositions:     "value_propositions",
  customerRelationships: "customer_relationships",
  channels:              "channels",
  customerSegments:      "customer_segments",
  costStructure:         "cost_structure",
  revenueStreams:        "revenue_streams",
}

type RawCard = {
  id:               string
  text:             string
  is_ai_generated?: boolean
  isAiGenerated?:   boolean
  subtext?:         string
}

function normalizeCard(raw: RawCard): CanvasCard {
  return {
    id:            raw.id,
    text:          raw.text,
    isAiGenerated: raw.is_ai_generated ?? raw.isAiGenerated ?? false,
    subtext:       raw.subtext,
  }
}

function normalizeCanvas(raw: Record<string, unknown>): CanvasSections {
  const payload = (raw.canvasData ?? raw.canvas ?? raw) as Record<string, unknown>

  const result: Partial<CanvasSections> = {}

  for (const [key, cards] of Object.entries(payload)) {
    const sectionKey = SECTION_MAP[key] ?? (key as CanvasSectionKey)
    if (!Array.isArray(cards)) continue
    result[sectionKey] = (cards as RawCard[]).map(normalizeCard)
  }

  return CanvasSectionsSchema.parse(result)
}

export async function getCanvas(projectId: string): Promise<CanvasSections | null> {
  try {
    const raw = await apiGet<Record<string, unknown>>(API_ROUTES.canvas(projectId))
    return normalizeCanvas(raw)
  } catch (err) {
    console.error("[canvas] getCanvas failed:", err)
    return null
  }
}

export async function apiAddCanvasCard(
  projectId: string,
  section:   CanvasSectionKey,
  text:      string,
): Promise<CanvasCard | null> {
  const raw = await apiPost<RawCard | undefined>(
    `${API_ROUTES.canvas(projectId)}/${SECTION_KEY_TO_API[section]}`,
    { text },
  )
  if (!raw?.id) return null
  return normalizeCard(raw)
}

export async function apiUpdateCanvasCard(
  projectId: string,
  section:   CanvasSectionKey,
  cardId:    string,
  text:      string,
): Promise<void> {
  await apiPatch<void>(
    `${API_ROUTES.canvas(projectId)}/${SECTION_KEY_TO_API[section]}/${cardId}`,
    { text },
  )
}

export async function validateCanvas(projectId: string): Promise<void> {
  await apiPost<void>(`${API_ROUTES.canvas(projectId)}/validate`, {})
}

export async function regenerateCanvas(projectId: string, locale: string): Promise<CanvasSections | null> {
  await apiPost<void>(`${API_ROUTES.canvas(projectId)}/regenerate?locale=${locale}`, {})
  return getCanvas(projectId)
}

export async function apiReorderSection(
  projectId: string,
  section:   CanvasSectionKey,
  cards:     CanvasCard[],
): Promise<void> {
  const body = cards.map((c) => ({
    id:             c.id,
    text:           c.text,
    is_ai_generated: c.isAiGenerated,
  }))
  await apiPut<void>(
    `${API_ROUTES.canvas(projectId)}/${SECTION_KEY_TO_API[section]}`,
    body,
  )
}

export async function apiDeleteCanvasCard(
  projectId: string,
  section:   CanvasSectionKey,
  cardId:    string,
): Promise<void> {
  await apiDelete(
    `${API_ROUTES.canvas(projectId)}/${SECTION_KEY_TO_API[section]}/${cardId}`,
  )
}
