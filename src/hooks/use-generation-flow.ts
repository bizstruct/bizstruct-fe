"use client"

import { useProjectStore, GENERATING_STEPS } from "@/store/use-project-store"

export function useGenerationFlow() {
  const addProjectFromIdea       = useProjectStore((s) => s.addProjectFromIdea)
  const finalizeGeneratedProject = useProjectStore((s) => s.finalizeGeneratedProject)
  const isLoading                = useProjectStore((s) => s.isLoading)
  const generationStep           = useProjectStore((s) => s.generationStep)
  const generatedProject         = useProjectStore((s) => s.generatedProject)

  const isGenerating = isLoading || GENERATING_STEPS.includes(generationStep)
  const isGenerated  = generationStep === "completed" && generatedProject !== null

  return {
    addProjectFromIdea,
    finalizeGeneratedProject,
    isLoading,
    isGenerating,
    isGenerated,
    generationStep,
    generatedProject,
  }
}
