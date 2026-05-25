import type { GeneratedBusinessModel } from "@/schemas/project.schema"

export function buildMockModels(projectTitle: string, idea: string): GeneratedBusinessModel[] {
  const ideaSnippet = idea.trim().split(/\s+/).slice(0, 4).join(" ")
  const baseName = projectTitle.replace(/^Проєкт:\s*/, "").replace(/\.\.\.$/, "") || ideaSnippet || "Project"

  return [
    {
      id: "model-b2b-saas",
      title: `B2B SaaS · ${baseName}`,
      audience: "Функціональні команди середнього бізнесу",
      valueProposition: "Швидка автоматизація базових ESG та операційних процесів",
      description: "Продукт із підпискою, стандартним onboarding та високою повторюваністю виручки для команди.",
    },
    {
      id: "model-marketplace",
      title: `Marketplace · ${baseName}`,
      audience: "Постачальники та enterprise-клієнти з потребою в інтеграціях",
      valueProposition: "Зіставлення попиту й пропозиції через спільну платформу та каталоги",
      description: "Гнучка модель з транзакційною монетизацією, каталогом рішень і ширшим охопленням ринку.",
    },
    {
      id: "model-advisory",
      title: `Advisory Platform · ${baseName}`,
      audience: "Фаундери, аналітики та інноваційні команди",
      valueProposition: "Гібрид AI-консалтингу та автоматизованих артефактів для запуску",
      description: "Модель із premium-пакетами, експертною підтримкою та швидкою генерацією ринкових матеріалів.",
    },
  ]
}
