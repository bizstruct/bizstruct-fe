"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getHypotheses } from "@/services/hypotheses"
import { HypothesesView } from "@/components/hypotheses/HypothesesView"
import type { Hypothesis } from "@/schemas/hypotheses.schema"

export default function HypothesesPage() {
  const params    = useParams() as { id?: string; locale?: string }
  const projectId = params?.id ?? ""

  const [hypotheses, setHypotheses] = useState<Hypothesis[] | null>(null)

  useEffect(() => {
    if (!projectId) return
    getHypotheses(projectId).then(setHypotheses).catch(() => {})
  }, [projectId])

  if (!hypotheses) return null

  return <HypothesesView initialHypotheses={hypotheses} />
}
