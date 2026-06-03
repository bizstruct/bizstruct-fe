import { API_ROUTES } from "@/constants/api"
import { WhatIfVectorSchema } from "@/schemas/what-if.schema"
import type { WhatIfVector, WhatIfVectorId } from "@/schemas/what-if.schema"
import { z } from "zod"
import { apiGet, apiPatch } from "./api-client"

type RawVector = {
  id:             string
  vector:         string
  color:          string
  icon:           string
  badge?:         string
  title:          string
  description:    string
  value?:         string
  revenue?:       string
  cost?:          string
  relationships?: string
  status?:        string | null
}

const DEFAULT_BADGES: Record<string, string> = {
  financial: "💰 Financial Innovation",
  technical: "⚙️ Technology Breakthrough",
  emotional: "🤝 Super-service for the Persona",
}

const COLOR_CLASSES: Record<string, { accentClass: string; borderClass: string }> = {
  indigo: { accentClass: "text-indigo-600 group-hover:text-indigo-700", borderClass: "border-t-indigo-500" },
  teal:   { accentClass: "text-teal-600 group-hover:text-teal-700",     borderClass: "border-t-teal-500"   },
  slate:  { accentClass: "text-slate-700 group-hover:text-slate-900",   borderClass: "border-t-slate-600"  },
}

const BLOCK_FIELDS: Record<string, Array<{ labelKey: string; field: string }>> = {
  financial: [
    { labelKey: "blockLabels.value",   field: "value"   },
    { labelKey: "blockLabels.revenue", field: "revenue" },
  ],
  technical: [
    { labelKey: "blockLabels.value", field: "value" },
    { labelKey: "blockLabels.cost",  field: "cost"  },
  ],
  emotional: [
    { labelKey: "blockLabels.value",         field: "value"         },
    { labelKey: "blockLabels.relationships", field: "relationships" },
  ],
}

function normalizeVector(raw: RawVector): WhatIfVector {
  const vectorId = raw.vector.toLowerCase() as WhatIfVectorId
  const colors   = COLOR_CLASSES[raw.color] ?? COLOR_CLASSES.slate
  const blocks   = (BLOCK_FIELDS[vectorId] ?? []).map(({ labelKey, field }) => ({
    labelKey,
    field,
    text: (raw as Record<string, string>)[field] ?? "",
  }))

  return {
    scenarioId:  raw.id,
    id:          vectorId,
    iconKey:     raw.icon as WhatIfVector["iconKey"],
    badge:       raw.badge ?? DEFAULT_BADGES[vectorId] ?? raw.vector,
    accentClass: colors.accentClass,
    borderClass: colors.borderClass,
    title:       raw.title,
    description: raw.description,
    blocks,
    status:      raw.status === "applied" ? "applied" : null,
  }
}

export async function getWhatIfVectors(projectId: string): Promise<WhatIfVector[]> {
  const envelope = await apiGet<{ whatIf: { scenarios: RawVector[] } | null }>(API_ROUTES.whatIf(projectId))
  if (envelope.whatIf == null) return []
  return z.array(WhatIfVectorSchema).parse(envelope.whatIf.scenarios.map(normalizeVector))
}

export type PatchWhatIfPayload = {
  status:         "applied"
  badge?:         string
  title?:         string
  description?:   string
  value?:         string
  revenue?:       string
  cost?:          string
  relationships?: string
}

export async function patchWhatIfVector(
  projectId: string,
  scenarioId: string,
  payload: PatchWhatIfPayload,
): Promise<void> {
  await apiPatch<void>(`${API_ROUTES.whatIf(projectId)}/${scenarioId}`, payload)
}
