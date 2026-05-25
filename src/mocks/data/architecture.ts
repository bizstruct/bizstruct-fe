import type { Locale } from "@/constants/i18n"
import type { ArchitectureData } from "@/schemas/architecture.schema"

const architectureMockData: Record<Locale, ArchitectureData> = {
  uk: {
    original: {
      epicenter: {
        titleKey: "ArchitectureView.epicenter.original.title",
        description: "Ваша модель будується навколо інноваційного способу монетизації та оптимізації грошових потоків. Основний акцент — структура витрат і потоки доходів.",
      },
      pattern: {
        titleKey: "ArchitectureView.pattern.original.title",
        description: "AI застосує правила Freemium-моделей: безкоштовний перший крок для вірального росту та платні інструменти глибокого аналізу.",
      },
    },
    regenerated: {
      epicenter: {
        titleKey: "ArchitectureView.epicenter.regenerated.title",
        description: "Ваша модель фокусується на оптимізації ресурсів та управлінні запасами, де ключовими метриками є ефективність використання ресурсів та зниження витрат.",
      },
      pattern: {
        titleKey: "ArchitectureView.pattern.regenerated.title",
        description: "AI рекомендує Subscription-First: фокус на стабільному ARR через багаторівневі підписки з опціями додаткових інтеграцій.",
      },
    },
  },
  en: {
    original: {
      epicenter: {
        titleKey: "ArchitectureView.epicenter.original.title",
        description: "Your model is built around an innovative monetization approach and cash flow optimization. The main focus is cost structure and revenue streams.",
      },
      pattern: {
        titleKey: "ArchitectureView.pattern.original.title",
        description: "AI applies Freemium model rules: a free first step for viral growth and paid tools for deep analytics.",
      },
    },
    regenerated: {
      epicenter: {
        titleKey: "ArchitectureView.epicenter.regenerated.title",
        description: "Your model focuses on resource optimization and inventory management, where key metrics are resource utilization efficiency and cost reduction.",
      },
      pattern: {
        titleKey: "ArchitectureView.pattern.regenerated.title",
        description: "AI recommends Subscription-First: focus on stable ARR through tiered subscriptions with additional integration options.",
      },
    },
  },
}

export function getMockArchitectureData(locale: Locale): ArchitectureData {
  return architectureMockData[locale] ?? architectureMockData.en
}
