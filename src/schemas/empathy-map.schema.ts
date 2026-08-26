// Types come from bizstruct-domain (via `npm run sync:domain`), not from a
// hand-maintained zod schema — see src/types/domain/empathy-map.ts. The
// backend validates every EmpathyMap payload before it's ever stored
// (bizstruct-be's /api/internal/hook and /api/empathy-map/* endpoints), so
// the frontend no longer needs to defensively re-parse/normalize API
// responses the way the old locale-nested schema did.
export type { EmpathyMap, EmpathyItem } from "@/types/domain/empathy-map"

export const EMPATHY_CATEGORIES = ["says", "thinks", "does", "feels", "pains", "gains"] as const
export type EmpathyCategory = (typeof EMPATHY_CATEGORIES)[number]
