// Types come from bizstruct-domain (via `npm run sync:domain`), not from a
// hand-maintained zod schema — see src/types/domain/what-if.ts. The backend
// validates every WhatIf payload before it's ever stored (bizstruct-be's
// /api/internal/hook and /api/what-if/* endpoints).
//
// No color/icon fields on the domain model (see bizstruct-domain's
// what_if module docstring — the old Financial/Technical/Emotional-vector
// design hardcoded these, the last known case of presentation leaking into
// this domain). ERRC_ACTION_STYLE below is the client-side
// ERRCAction -> styling map that replaces it.
export type {
  WhatIf as WhatIfData,
  WhatIfAlternative,
  ERRCMove,
  ERRCAction,
  CanvasSection,
  WhatIfStatus,
} from "@/types/domain/what-if"

import type { ERRCAction, WhatIfAlternative } from "@/types/domain/what-if"
import type { Canvas } from "@/types/domain/canvas"

// `canvas_snapshot_before` is a bizstruct-be persistence/rollback detail
// (see blocks.py's What-If section docstring), deliberately NOT part of
// the bizstruct-domain WhatIfAlternative model — so it doesn't come
// through sync-domain-types. The wire response still carries it on an
// applied alternative (raw JSONB, unvalidated on the read path), and the
// frontend needs it only to know whether "revert" is currently possible.
export interface WhatIfAlternativeWire extends WhatIfAlternative {
  canvas_snapshot_before?: Canvas | null
}

export interface WhatIfDataWire {
  alternatives: [WhatIfAlternativeWire, WhatIfAlternativeWire, WhatIfAlternativeWire]
}

export const ERRC_ACTION_ORDER: readonly ERRCAction[] = ["eliminate", "reduce", "raise", "create"]

export const ERRC_ACTION_STYLE: Record<ERRCAction, { badgeClass: string; labelKey: string }> = {
  eliminate: { badgeClass: "bg-red-50 text-red-600 border-red-200", labelKey: "action.eliminate" },
  reduce: { badgeClass: "bg-amber-50 text-amber-600 border-amber-200", labelKey: "action.reduce" },
  raise: { badgeClass: "bg-sky-50 text-sky-600 border-sky-200", labelKey: "action.raise" },
  create: { badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-200", labelKey: "action.create" },
}
