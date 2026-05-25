import { z } from "zod"

export const CanvasCardSchema = z.object({
  id: z.string(),
  text: z.string(),
  isAiGenerated: z.boolean(),
  subtext: z.string().optional(),
})

export const CanvasSectionsSchema = z.object({
  keyPartners: z.array(CanvasCardSchema),
  keyActivities: z.array(CanvasCardSchema),
  keyResources: z.array(CanvasCardSchema),
  valuePropositions: z.array(CanvasCardSchema),
  customerRelationships: z.array(CanvasCardSchema),
  channels: z.array(CanvasCardSchema),
  customerSegments: z.array(CanvasCardSchema),
  costStructure: z.array(CanvasCardSchema),
  revenueStreams: z.array(CanvasCardSchema),
})

export type CanvasCard = z.infer<typeof CanvasCardSchema>
export type CanvasSections = z.infer<typeof CanvasSectionsSchema>
export type CanvasSectionKey = keyof CanvasSections
