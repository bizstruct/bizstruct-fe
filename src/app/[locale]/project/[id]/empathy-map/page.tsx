"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useProjectStore } from "@/store/use-project-store"
import { getEmpathyMap } from "@/services/empathy-map"
import { EmpathyView } from "@/components/empathy-map/EmpathyView"
import type { EmpathyData } from "@/schemas/empathy-map.schema"

export default function EmpathyMapPage() {
  const params    = useParams() as { id?: string; locale?: string }
  const projectId = params?.id ?? ""
  const locale    = params?.locale ?? "en"
  const history   = useProjectStore((s) => s.history)
  const project   = history.find((h) => h.id === projectId)

  const [empathyData, setEmpathyData] = useState<EmpathyData | null>(null)

  useEffect(() => {
    if (!projectId) return
    getEmpathyMap(projectId, locale).then(setEmpathyData).catch(() => {})
  }, [projectId, locale])

  if (!empathyData) return null

  return (
    <EmpathyView
      projectId={projectId}
      projectName={project?.title ?? projectId}
      initialData={empathyData}
    />
  )
}
