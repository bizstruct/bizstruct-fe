"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getPitch } from "@/services/pitch"
import { PitchView } from "@/components/pitch/PitchView"
import type { PitchData } from "@/schemas/pitch.schema"

export default function PitchPage() {
  const params    = useParams() as { id?: string }
  const projectId = params?.id ?? ""

  const [pitchData, setPitchData] = useState<PitchData | null>(null)

  useEffect(() => {
    if (!projectId) return
    getPitch(projectId).then(setPitchData).catch(() => {})
  }, [projectId])

  if (!pitchData) return null

  return <PitchView pitchData={pitchData} projectId={projectId} />
}
