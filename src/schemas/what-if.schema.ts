import { z } from "zod"

export const WhatIfVectorIdSchema = z.enum(["financial", "technical", "emotional"])

export const WhatIfBlockSchema = z.object({
  labelKey: z.string(), // i18n key for the label chip ("VALUE", "REVENUE"…)
  field:    z.string(), // backend field name ("value", "revenue", "cost", "relationships")
  text:     z.string(), // direct text content from the backend
})

export const WhatIfVectorSchema = z.object({
  scenarioId:  z.string(),
  id:          WhatIfVectorIdSchema,
  badge:       z.string(),
  accentClass: z.string(),
  borderClass: z.string(),
  iconKey:     z.enum(["coins", "cpu", "heartHandshake"]),
  title:       z.string(),
  description: z.string(),
  blocks:      z.array(WhatIfBlockSchema),
  status:      z.enum(["applied", "pending"]).nullable(),
})

export type WhatIfVectorId = z.infer<typeof WhatIfVectorIdSchema>
export type WhatIfBlock    = z.infer<typeof WhatIfBlockSchema>
export type WhatIfVector   = z.infer<typeof WhatIfVectorSchema>
