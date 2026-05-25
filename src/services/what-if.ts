import { API_ROUTES } from "@/constants/api"
import { WhatIfVectorSchema } from "@/schemas/what-if.schema"
import type { WhatIfVector } from "@/schemas/what-if.schema"
import { z } from "zod"
import { apiGet } from "./api-client"

export async function getWhatIfVectors(projectId: string): Promise<WhatIfVector[]> {
  const data = await apiGet<unknown[]>(API_ROUTES.whatIf(projectId))
  return z.array(WhatIfVectorSchema).parse(data)
}
