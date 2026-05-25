import { z } from "zod"

export const ArchitectureVariantSchema = z.enum(["original", "regenerated"])

export const ArchitectureCardSchema = z.object({
  titleKey: z.string(),
  description: z.string(),
})

export const ArchitectureDataSchema = z.object({
  original: z.object({
    epicenter: ArchitectureCardSchema,
    pattern: ArchitectureCardSchema,
  }),
  regenerated: z.object({
    epicenter: ArchitectureCardSchema,
    pattern: ArchitectureCardSchema,
  }),
})

export type ArchitectureVariant = z.infer<typeof ArchitectureVariantSchema>
export type ArchitectureCard = z.infer<typeof ArchitectureCardSchema>
export type ArchitectureData = z.infer<typeof ArchitectureDataSchema>
