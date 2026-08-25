import type { Architecture } from "@/schemas/architecture.schema"

const data: Architecture = {
  epicenter: "finance_driven",
  epicenter_rationale_uk:
    "Модель побудована навколо інноваційної монетизації та оптимізації грошових потоків. Основний фокус — структура витрат і потоки доходів.",
  epicenter_rationale_en:
    "The model is built around an innovative monetization approach and cash flow optimization. The main focus is cost structure and revenue streams.",
  pattern: "free",
  pattern_subtype: "freemium",
  pattern_rationale_uk:
    "AI застосовує правила Freemium: безкоштовний перший крок для вірусного росту та платні інструменти для глибокої аналітики.",
  pattern_rationale_en:
    "AI applies Freemium model rules: a free first step for viral growth and paid tools for deep analytics.",
}

export function getMockArchitectureData(): Architecture {
  return data
}
