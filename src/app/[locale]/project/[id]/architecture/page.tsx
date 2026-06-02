"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getArchitecture } from "@/services/architecture"
import { ArchitectureView } from "@/components/architecture/ArchitectureView"
import { ROUTES } from "@/constants/routes"
import type { ArchitectureData } from "@/schemas/architecture.schema"

export default function ArchitecturePage() {
  const params    = useParams() as { id?: string; locale?: string }
  const router    = useRouter()
  const projectId = params?.id ?? ""
  const locale    = params?.locale ?? "en"

  const [architectureData, setArchitectureData] = useState<ArchitectureData | null>(null)

  useEffect(() => {
    if (!projectId) return
    getArchitecture(projectId, locale).then(setArchitectureData).catch(console.error)
  }, [projectId, locale])

  if (!architectureData) return null

  return (
    <ArchitectureView
      architectureData={architectureData}
      onGoToCanvas={() => router.push(`/${locale}${ROUTES.canvas(projectId)}`)}
    />
  )
}
