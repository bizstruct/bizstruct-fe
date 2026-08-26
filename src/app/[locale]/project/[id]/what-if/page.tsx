"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { WhatIfView } from "@/components/what-if/WhatIfView"
import { ROUTES } from "@/constants/routes"

export default function WhatIfPage() {
  const params    = useParams() as { id?: string; locale?: string }
  const router    = useRouter()
  const projectId = params?.id ?? ""
  const locale    = params?.locale ?? "en"

  if (!projectId) return null

  return (
    <WhatIfView
      projectId={projectId}
      locale={locale}
      onApplied={() => router.push(`/${locale}${ROUTES.architecture(projectId)}`)}
    />
  )
}
