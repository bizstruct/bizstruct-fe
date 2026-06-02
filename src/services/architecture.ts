import { API_ROUTES } from "@/constants/api"
import { ArchitectureDataSchema } from "@/schemas/architecture.schema"
import type { ArchitectureData } from "@/schemas/architecture.schema"
import { apiGet } from "./api-client"

type RawVariant = { epicenter: string; pattern: string; description: string }
type RawArchitecture = { original: RawVariant; regenerated: RawVariant }

function normalizeVariant(raw: RawVariant) {
  return {
    epicenter: { title: raw.epicenter, description: raw.description },
    pattern:   { title: raw.pattern,   description: raw.description },
  }
}

export async function getArchitecture(projectId: string, locale: string): Promise<ArchitectureData | null> {
  const url = `${API_ROUTES.architecture(projectId)}?locale=${locale}`
  const envelope = await apiGet<{ architecture: RawArchitecture | null }>(url)
  if (envelope.architecture == null) return null
  const raw = envelope.architecture
  return ArchitectureDataSchema.parse({
    original:    normalizeVariant(raw.original),
    regenerated: normalizeVariant(raw.regenerated),
  })
}
