"use client"

import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { useGenerationFlow } from "@/hooks/use-generation-flow"
import { IdeaForm } from "@/components/home/IdeaForm"
import { GenerationScreen } from "@/components/home/GenerationScreen"
import { ModelSelectionScreen } from "@/components/home/ModelSelectionScreen"
import { PageRoot, Hero, HeroTitle, HeroSubtitle } from "@/components/home/primitives"
import { ROUTES } from "@/constants/routes"
import type { ProjectLanguage } from "@/schemas/project.schema"

export default function HomePage() {
  const t      = useTranslations("HomePage")
  const router = useRouter()
  const locale = useLocale()
  // Generation language, fixed at project creation from the user's UI
  // locale — not re-derived later, and not tied to the viewer's locale on
  // subsequent visits (see B1/B3 of the follow-up brief). routing.ts's
  // locales are exactly ["uk", "en"], so this ternary should never hit its
  // fallback in practice, but an explicit default beats silently sending
  // an unsupported value.
  const language: ProjectLanguage = locale === "uk" ? "uk" : "en"

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
        <IdeaForm isLoading={isLoading} onSubmit={(idea) => addProjectFromIdea(idea, language)} />
      )}
    </PageRoot>
  )
}
