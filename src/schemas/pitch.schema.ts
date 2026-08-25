// Domain types come from bizstruct-domain (via `npm run sync:domain`) — see
// src/types/domain/pitch.ts. The backend validates every Pitch payload
// before it's ever stored (bizstruct-be's /api/internal/hook and
// /api/pitch/* endpoints).
//
// The audience is `customer`, not `client` — bizstruct-be previously used
// `client` here while this schema (and bizstruct_domain.enums.PitchAudience)
// already used `customer`; the backend has since been renamed to match.
export type { Pitch, InvestorSlide, CustomerSlide } from "@/types/domain/pitch"

export const STORY_TYPES = ["investor", "customer"] as const
export type StoryType = (typeof STORY_TYPES)[number]

// PitchStep/PitchData are a presentation-layer shape, not the domain
// model: `titleKey` (an i18n lookup key derived from the slide's `type`)
// and a single HTML `content` string (bilingual headline/content collapsed
// to the active next-intl locale) are UI concerns, built in services/pitch.ts.
export interface PitchStep {
  id: number
  titleKey: string
  content: string
}

export interface PitchData {
  investor: PitchStep[]
  customer: PitchStep[]
}
