import { API_ROUTES } from "@/constants/api"
import { WhatIfVectorSchema } from "@/schemas/what-if.schema"
import type { WhatIfVector, WhatIfVectorId } from "@/schemas/what-if.schema"
import { z } from "zod"
import { apiGet } from "./api-client"

type RawVector = { id: string; icon: string; color: string; vector: string }

const COLOR_CLASSES: Record<string, { accentClass: string; borderClass: string }> = {
  indigo: { accentClass: "text-indigo-600 group-hover:text-indigo-700", borderClass: "border-t-indigo-500" },
  teal:   { accentClass: "text-teal-600 group-hover:text-teal-700",     borderClass: "border-t-teal-500"   },
  slate:  { accentClass: "text-slate-700 group-hover:text-slate-900",   borderClass: "border-t-slate-600"  },
}

const VECTOR_BLOCKS: Record<string, WhatIfVector["blocks"]> = {
  financial: [
    { labelKey: "blockLabels.value",   text: "vectors.financial.blocks.value"   },
    { labelKey: "blockLabels.revenue", text: "vectors.financial.blocks.revenue" },
  ],
  technical: [
    { labelKey: "blockLabels.value", text: "vectors.technical.blocks.value" },
    { labelKey: "blockLabels.cost",  text: "vectors.technical.blocks.cost"  },
  ],
  emotional: [
    { labelKey: "blockLabels.value",         text: "vectors.emotional.blocks.value"         },
    { labelKey: "blockLabels.relationships", text: "vectors.emotional.blocks.relationships" },
  ],
}

function normalizeVector(raw: RawVector): WhatIfVector {
  const vectorId = raw.vector.toLowerCase() as WhatIfVectorId
  const colors   = COLOR_CLASSES[raw.color] ?? COLOR_CLASSES.slate
  return {
    id:          vectorId,
    iconKey:     raw.icon,
    badgeKey:    `vectors.${vectorId}.badge`,
    titleKey:    `vectors.${vectorId}.title`,
    promptKey:   `vectors.${vectorId}.prompt`,
    accentClass: colors.accentClass,
    borderClass: colors.borderClass,
    blocks:      VECTOR_BLOCKS[vectorId] ?? [],
  }
}

export async function getWhatIfVectors(projectId: string): Promise<WhatIfVector[]> {
  const envelope = await apiGet<{ whatIf: { scenarios: RawVector[] } | null }>(API_ROUTES.whatIf(projectId))
  if (envelope.whatIf == null) return []
  return z.array(WhatIfVectorSchema).parse(envelope.whatIf.scenarios.map(normalizeVector))
}
