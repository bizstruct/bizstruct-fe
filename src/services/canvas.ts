import { API_ROUTES } from "@/constants/api"
import { CanvasSectionsSchema } from "@/schemas/canvas.schema"
import type { CanvasSections, CanvasCard, CanvasSectionKey } from "@/schemas/canvas.schema"
import type { CanvasCard as RawCard } from "@/types/domain/canvas"
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

function normalizeCard(raw: RawCard): CanvasCard {
  return {
    id:            raw.id,
    text:          raw.text,
    isAiGenerated: raw.is_ai_generated ?? false,
  }
}

function normalizeCanvas(payload: Record<string, unknown>): CanvasSections {
  const result: Partial<CanvasSections> = {}

  for (const [key, cards] of Object.entries(payload)) {
    const sectionKey = SECTION_MAP[key] ?? (key as CanvasSectionKey)
    if (!Array.isArray(cards)) continue
    result[sectionKey] = (cards as RawCard[]).map(normalizeCard)
  }

  return CanvasSectionsSchema.parse(result)
}

// No internal try/catch — a backend error propagates to the caller instead
// of being swallowed into a null that's indistinguishable from "not
// generated yet". See CanvasView.tsx for how the caller surfaces it.
export async function getCanvas(projectId: string): Promise<CanvasSections | null> {
  const raw = await apiGet<{ canvas: Record<string, unknown> | null }>(API_ROUTES.canvas(projectId))
  if (!raw?.canvas) return null
  return normalizeCanvas(raw.canvas)
}

export async function apiAddCanvasCard(
  projectId: string,
  section:   CanvasSectionKey,
  text:      string,
): Promise<CanvasCard | null> {
  // The response is {projectId, section, item: {...}} — the card itself is
  // nested under `item`, not the top-level response.
  const raw = await apiPost<{ item?: RawCard } | undefined>(
    `${API_ROUTES.canvas(projectId)}/${SECTION_KEY_TO_API[section]}`,
    { text },
  )
  if (!raw?.item?.id) return null
  return normalizeCard(raw.item)
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

export async function apiMoveCanvasCard(
  projectId:  string,
  fromSection: CanvasSectionKey,
  cardId:      string,
  toSection:   CanvasSectionKey,
  toIndex?:    number,
): Promise<void> {
  await apiPatch<void>(
    `${API_ROUTES.canvas(projectId)}/${SECTION_KEY_TO_API[fromSection]}/${cardId}/move`,
    { toSection: SECTION_KEY_TO_API[toSection], toIndex },
  )
}
