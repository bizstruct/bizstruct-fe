// what_if is the one block this task migrated onto the unified HTTP client
// (see docs/adr/0001-frontend-backend-transport.md) directly at the point
// of its ERRC rewrite — apiRequest()/ApiResult<T>, not the legacy
// apiGet/apiPatch wrappers services/canvas.ts and its siblings still use.
// No normalize layer either: like scenario/architecture, the wire shape is
// the domain-typed snake_case object as-is (bizstruct-be validates every
// write against bizstruct_domain.blocks.what_if.WhatIf), so this file is
// a thin, typed pass-through.
//
// No regenerate function here: the old WhatIfView had a "regenerate"
// button that was a client-side TODO stub, never wired to a real endpoint
// (bizstruct-be has no /api/what-if/{id}/regenerate route — canvas's own
// regenerate button has the same gap, calling a route that 404s server-
// side; pre-existing, not introduced here). Adding a real one is a
// separate, unscoped change; not fabricated here just to fill the gap.
import { API_ROUTES } from "@/constants/api"
import { apiRequest } from "./api-client"
import type { ApiResult } from "@/lib/api-result"
import type { WhatIfAlternativeWire, WhatIfDataWire } from "@/schemas/what-if.schema"
import type { Canvas } from "@/types/domain/canvas"

interface WhatIfEnvelope {
  whatIf: WhatIfDataWire | null
}

interface ApplyRevertResponse {
  projectId: string
  whatIf: WhatIfDataWire
  canvas: Canvas
}

export async function getWhatIf(projectId: string): Promise<ApiResult<WhatIfEnvelope>> {
  return apiRequest<WhatIfEnvelope>(API_ROUTES.whatIf(projectId), { cache: "no-store" })
}

// Only the fields a user may edit on a draft alternative — never `status`,
// `id`, or `moves` (moves are LLM-authored; there's no manual move editor,
// see WhatIfView.tsx).
export type WhatIfAlternativeEdit = Pick<
  WhatIfAlternativeWire,
  "title_uk" | "title_en" | "premise_uk" | "premise_en" | "expected_impact_uk" | "expected_impact_en"
>

export async function updateWhatIfAlternative(
  projectId: string,
  alternativeId: string,
  fields: Partial<WhatIfAlternativeEdit>,
): Promise<ApiResult<WhatIfEnvelope>> {
  return apiRequest<WhatIfEnvelope>(API_ROUTES.whatIfAlternative(projectId, alternativeId), {
    method: "PATCH",
    body: JSON.stringify(fields),
  })
}

// Backend rejects the whole apply with 422 + { message, unresolvedMoves }
// when a move's target can't be matched against the current canvas — never
// a silent partial apply. See bizstruct-be's blocks.py What-If section.
export interface UnresolvedMovesDetail {
  message: string
  unresolvedMoves: Array<{ action: string; target_section: string; target: string }>
}

export async function applyWhatIfAlternative(
  projectId: string,
  alternativeId: string,
): Promise<ApiResult<ApplyRevertResponse>> {
  return apiRequest<ApplyRevertResponse>(API_ROUTES.whatIfApply(projectId, alternativeId), { method: "POST" })
}

export async function revertWhatIfAlternative(
  projectId: string,
  alternativeId: string,
): Promise<ApiResult<ApplyRevertResponse>> {
  return apiRequest<ApplyRevertResponse>(API_ROUTES.whatIfRevert(projectId, alternativeId), { method: "POST" })
}
