"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getScenario } from "@/services/scenario"
import { ScenarioView } from "@/components/scenario/ScenarioView"
import type { ScenarioData } from "@/schemas/scenario.schema"

export default function ScenarioPage() {
  const params    = useParams() as { id?: string }
  const projectId = params?.id ?? ""

  const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null)

  useEffect(() => {
    if (!projectId) return
    getScenario(projectId).then(setScenarioData).catch(() => {})
  }, [projectId])

  if (!scenarioData) return null

  return <ScenarioView projectId={projectId} scenarioData={scenarioData} />
}
