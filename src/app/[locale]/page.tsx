"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { useGenerationFlow } from "@/hooks/use-generation-flow"
import { IdeaForm } from "@/components/home/IdeaForm"
import { GenerationScreen } from "@/components/home/GenerationScreen"
import { ModelSelectionScreen } from "@/components/home/ModelSelectionScreen"
import { PageRoot, Hero, HeroTitle, HeroSubtitle } from "@/components/home/primitives"
import { ROUTES } from "@/constants/routes"

export default function HomePage() {
  const t      = useTranslations("HomePage")
  const router = useRouter()

  const {
    addProjectFromIdea,
    finalizeGeneratedProject,
    isLoading,
    isGenerating,
    isGenerated,
    generationStep,
    generatedProject,
  } = useGenerationFlow()

  async function handleSelectModel(modelId: string) {
    try {
      const projectId = await finalizeGeneratedProject(modelId)
      router.push(ROUTES.project(projectId))
    } catch {
      // A failed save sets the store's modelActionError, which
      // ModelSelectionScreen reads directly and renders with a retry
      // button — nothing else to do here but avoid an unhandled rejection.
    }
  }

  return (
    <PageRoot>
      {generationStep === "idle" && (
        <Hero>
          <HeroTitle>{t("hero.title")}</HeroTitle>
          <HeroSubtitle>{t("hero.subtitle")}</HeroSubtitle>
        </Hero>
      )}

      {isGenerated && generatedProject ? (
        <ModelSelectionScreen
          generatedProject={generatedProject}
          onSelectModel={(id) => void handleSelectModel(id)}
        />
      ) : isGenerating ? (
        <GenerationScreen generationStep={generationStep} />
      ) : (
        <IdeaForm isLoading={isLoading} onSubmit={addProjectFromIdea} />
      )}
    </PageRoot>
  )
}
