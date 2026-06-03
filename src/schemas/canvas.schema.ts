import { z } from "zod"

export const CanvasCardSchema = z.object({
  id: z.string(),
  text: z.string(),
  isAiGenerated: z.boolean(),
  subtext: z.string().optional(),
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
