"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getArchitecture } from "@/services/architecture"
import { getCanvas } from "@/services/canvas"
import { ArchitectureView } from "@/components/architecture/ArchitectureView"
import { ROUTES } from "@/constants/routes"
import type { Architecture } from "@/schemas/architecture.schema"
import type { CanvasSections } from "@/schemas/canvas.schema"

export default function ArchitecturePage() {
  const params    = useParams() as { id?: string; locale?: string }
  const router    = useRouter()
  const projectId = params?.id ?? ""
  const locale    = params?.locale ?? "en"

  const [architecture, setArchitecture] = useState<Architecture | null>(null)
  const [canvasData,   setCanvasData]   = useState<CanvasSections | null>(null)

  useEffect(() => {
    if (!projectId) return
    getArchitecture(projectId).then(setArchitecture).catch(console.error)
    getCanvas(projectId).then(setCanvasData).catch(() => {})
  }, [projectId])

  if (!architecture) return null

  return (
    <ArchitectureView
      projectId={projectId}
      locale={locale}
      architecture={architecture}
      hasCanvas={canvasData !== null}
      onGoToCanvas={() => router.push(`/${locale}${ROUTES.canvas(projectId)}`)}
    />
  )
}
