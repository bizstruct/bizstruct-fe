import { z } from "zod"

// ── Epicenter: 4 closed values ────────────────────────────────────────────
export const EpicenterSchema = z.enum([
  "resource-driven",
  "offer-driven",
  "customer-driven",
  "finance-driven",
])

// ── Pattern: 5 closed values ──────────────────────────────────────────────
export const PatternSchema = z.enum([
  "unbundling",
  "long-tail",
  "multi-sided-platform",
  "free",
  "open-business-model",
])

// ── Subtypes (only for "free" and "open-business-model") ─────────────────
export const PatternSubtypeSchema = z.enum([
  "freemium",
  "ad-supported",
  "bait-and-hook",
  "open-source",
  "outside-in",
  "inside-out",
])

export const PATTERN_SUBTYPES: Partial<Record<PatternType, PatternSubtypeType[]>> = {
  "free":                ["freemium", "ad-supported", "bait-and-hook", "open-source"],
  "open-business-model": ["outside-in", "inside-out"],
}

// ── Flat schema matching backend response ─────────────────────────────────
export const ArchitectureDataSchema = z.object({
  epicenter: z.object({
    value:       EpicenterSchema,
    description: z.string(),
  }),
  pattern: z.object({
    value:       PatternSchema,
    subtype:     PatternSubtypeSchema.nullable(),
    description: z.string(),
  }),
})

export type EpicenterType      = z.infer<typeof EpicenterSchema>
export type PatternType        = z.infer<typeof PatternSchema>
export type PatternSubtypeType = z.infer<typeof PatternSubtypeSchema>
export type ArchitectureData   = z.infer<typeof ArchitectureDataSchema>
