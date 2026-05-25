import { z } from "zod"

export const WhatIfVectorIdSchema = z.enum(["financial", "technical", "emotional"])

export const WhatIfBlockSchema = z.object({
  labelKey: z.string(),
  text: z.string(),
})

export const WhatIfVectorSchema = z.object({
  id: WhatIfVectorIdSchema,
  badgeKey: z.string(),
  titleKey: z.string(),
  promptKey: z.string(),
  accentClass: z.string(),
  borderClass: z.string(),
  iconKey: z.enum(["coins", "cpu", "heartHandshake"]),
  blocks: z.array(WhatIfBlockSchema),
})

export type WhatIfVectorId = z.infer<typeof WhatIfVectorIdSchema>
export type WhatIfBlock = z.infer<typeof WhatIfBlockSchema>
export type WhatIfVector = z.infer<typeof WhatIfVectorSchema>
