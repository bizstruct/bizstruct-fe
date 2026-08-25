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
      monetization: "subscription",
      keyMetric: "MRR / NRR",
      timeToValue: "30 хвилин до першого звіту",
      score: 78,
      scoreRationale: "Підписка напряму монетизує повторювану проблему, а self-serve onboarding знижує вартість залучення.",
    },
    {
      id: "model-marketplace",
      title: `Marketplace · ${baseName}`,
      audience: "Постачальники та enterprise-клієнти з потребою в інтеграціях",
      valueProposition: "Зіставлення попиту й пропозиції через спільну платформу та каталоги",
      description: "Гнучка модель з транзакційною монетизацією, каталогом рішень і ширшим охопленням ринку.",
      monetization: "transaction_fee",
      keyMetric: "GMV / Take rate",
      timeToValue: "Перша транзакція за 1–2 тижні",
      score: 65,
      scoreRationale: "Більший потенціал доходу на транзакцію, але довший цикл продажу через потребу в мережевому ефекті.",
    },
    {
      id: "model-advisory",
      title: `Advisory Platform · ${baseName}`,
      audience: "Фаундери, аналітики та інноваційні команди",
      valueProposition: "Гібрид AI-консалтингу та автоматизованих артефактів для запуску",
      description: "Модель із premium-пакетами, експертною підтримкою та швидкою генерацією ринкових матеріалів.",
      monetization: "retainer_plus_saas",
      keyMetric: "ACV / CSAT",
      timeToValue: "Перший advisory session за 48 годин",
      score: 55,
      scoreRationale: "Висока цінність на клієнта, але обмежена масштабованість через залежність від людських консультантів.",
    },
  ]
}
