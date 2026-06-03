"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getWhatIfVectors } from "@/services/what-if"
import { WhatIfView } from "@/components/what-if/WhatIfView"
import { ROUTES } from "@/constants/routes"
import type { WhatIfVector } from "@/schemas/what-if.schema"

export default function WhatIfPage() {
  const params    = useParams() as { id?: string; locale?: string }
  const router    = useRouter()
  const projectId = params?.id ?? ""
  const locale    = params?.locale ?? "en"

  const [vectors, setVectors] = useState<WhatIfVector[] | null>(null)

  useEffect(() => {
    if (!projectId) return
    getWhatIfVectors(projectId).then(setVectors).catch(console.error)
  }, [projectId])

  if (!vectors) return null

  return (
    <WhatIfView
      projectId={projectId}
      vectors={vectors}
      onApplied={(_scenarioId) => router.push(`/${locale}${ROUTES.architecture(projectId)}`)}
    />
  )
}
