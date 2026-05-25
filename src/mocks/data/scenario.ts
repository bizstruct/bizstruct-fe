import type { Locale } from "@/constants/i18n"
import type { ScenarioData } from "@/schemas/scenario.schema"

const scenarioMockData: Record<Locale, ScenarioData> = {
  uk: {
    persona: {
      name: "Олена",
      initials: "О",
      role: "Корпоративний менеджер з екології",
      painPoint: "Розрізнені Excel-таблиці, помилки введення",
    },
    timeline: [
      { iconKey: "clock",    labelKey: "ScenarioView.timeline.context",   text: "Кінець кварталу — Олена має терміново підготувати звіт",                   highlight: false },
      { iconKey: "target",   labelKey: "ScenarioView.timeline.goal",      text: "Консолідувати викиди із 3 регіональних офісів",                            highlight: false },
      { iconKey: "sparkles", labelKey: "ScenarioView.timeline.action",    text: "Логін → Один клік → Автогенерація звіту та AI-інсайти",                   highlight: true },
    ],
    metrics: {
      before: { value: "3 дні",  descriptionKey: "ScenarioView.metrics.before" },
      after:  { value: "15 хв",  descriptionKey: "ScenarioView.metrics.after" },
    },
  },
  en: {
    persona: {
      name: "Olena",
      initials: "O",
      role: "Corporate Sustainability Manager",
      painPoint: "Fragmented Excel files, data entry errors",
    },
    timeline: [
      { iconKey: "clock",    labelKey: "ScenarioView.timeline.context", text: "End of quarter — Olena must urgently prepare a report",                    highlight: false },
      { iconKey: "target",   labelKey: "ScenarioView.timeline.goal",    text: "Consolidate emissions from 3 regional offices",                            highlight: false },
      { iconKey: "sparkles", labelKey: "ScenarioView.timeline.action",  text: "Login → One Click → Auto-generate report and AI insights",                 highlight: true },
    ],
    metrics: {
      before: { value: "3 days", descriptionKey: "ScenarioView.metrics.before" },
      after:  { value: "15 min", descriptionKey: "ScenarioView.metrics.after" },
    },
  },
}

export function getMockScenarioData(locale: Locale): ScenarioData {
  return scenarioMockData[locale] ?? scenarioMockData.en
}
