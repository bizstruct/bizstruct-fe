import { z } from "zod"

// UI-shape types: camelCase section keys and card fields, matching the
// convention already used throughout the canvas components (CanvasView,
// CanvasSectionCard, the drag&drop mappers). The wire/domain shape is
// snake_case (see src/types/domain/canvas.ts, synced from bizstruct-domain)
// — services/canvas.ts's normalizeCanvas()/normalizeCard() are the one
// place that translates between the two, the same pattern
// SECTION_MAP/SECTION_KEY_TO_API already used for section names.
export const CanvasCardSchema = z.object({
  id: z.string(),
  text: z.string(),
  isAiGenerated: z.boolean(),
})

const cardArray = z.array(CanvasCardSchema).default([])

export const CanvasSectionsSchema = z.object({
  keyPartners:           cardArray,
  keyActivities:         cardArray,
  keyResources:          cardArray,
  valuePropositions:     cardArray,
  customerRelationships: cardArray,
  channels:              cardArray,
  customerSegments:      cardArray,
  costStructure:         cardArray,
  revenueStreams:        cardArray,
})

export type CanvasCard = z.infer<typeof CanvasCardSchema>
export type CanvasSections = z.infer<typeof CanvasSectionsSchema>
export type CanvasSectionKey = keyof CanvasSections
