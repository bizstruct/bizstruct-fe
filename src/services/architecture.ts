import { API_ROUTES } from "@/constants/api"
import { ArchitectureDataSchema, EpicenterSchema, PatternSchema, PatternSubtypeSchema } from "@/schemas/architecture.schema"
import type { ArchitectureData, EpicenterType, PatternType, PatternSubtypeType } from "@/schemas/architecture.schema"
import { apiGet, apiPatch, apiPost } from "./api-client"

type RawCard = {
  value:       string
  subtype?:    string | null
  description: string
  status?:     string
}

type RawLocaleData = {
  epicenter: RawCard
  pattern:   RawCard
}

function toEpicenter(raw: string): EpicenterType {
  return EpicenterSchema.catch("finance-driven").parse(
    raw.toLowerCase().replace(/\s+/g, "-"),
  )
}

function toPattern(raw: string): PatternType {
  return PatternSchema.catch("unbundling").parse(
    raw.toLowerCase().replace(/[\s+]/g, "-"),
  )
}

function toSubtype(raw: string | null | undefined): PatternSubtypeType | null {
  if (!raw) return null
  return PatternSubtypeSchema.catch(null as never).parse(
    raw.toLowerCase().replace(/[\s&]+/g, "-"),
  )
}

function normalizeLocale(d: RawLocaleData): ArchitectureData {
  return ArchitectureDataSchema.parse({
    epicenter: {
      value:       toEpicenter(d.epicenter.value),
      description: d.epicenter.description,
    },
    pattern: {
      value:       toPattern(d.pattern.value),
      subtype:     toSubtype(d.pattern.subtype),
      description: d.pattern.description,
    },
  })
}

export async function getArchitecture(projectId: string, locale: string): Promise<ArchitectureData | null> {
  const url = `${API_ROUTES.architecture(projectId)}?locale=${locale}`
  const raw = await apiGet<{ architecture: RawLocaleData | null }>(url)

  if (!raw?.architecture) return null

  try {
    return normalizeLocale(raw.architecture)
  } catch (err) {
    console.error("[architecture] normalizeLocale failed:", err)
    return null
  }
}

export async function patchArchitectureEpicenter(
  projectId: string,
  locale: string,
  payload: { value: string; description?: string },
): Promise<void> {
  await apiPatch<void>(
    `${API_ROUTES.architecture(projectId)}/epicenter?locale=${locale}`,
    payload,
  )
}

export async function validateArchitecture(
  projectId: string,
  locale: string,
  payload: {
    epicenter:   EpicenterType
    pattern:     PatternType
    subtype?:    PatternSubtypeType | null
    epicenterDescription: string
    patternDescription:   string
  },
): Promise<void> {
  await apiPost<void>(
    `${API_ROUTES.architecture(projectId)}/validate?locale=${locale}`,
    payload,
  )
}

export async function patchArchitecturePattern(
  projectId: string,
  locale: string,
  payload: { value: string; subtype?: string | null; description?: string },
): Promise<void> {
  await apiPatch<void>(
    `${API_ROUTES.architecture(projectId)}/pattern?locale=${locale}`,
    payload,
  )
}
