import type { ScenarioData } from "@/schemas/scenario.schema"

const data: ScenarioData = {
  persona: {
    name_uk: "Олена Коваль",
    name_en: "Olena Koval",
    role_uk: "Корпоративний менеджер з екології",
    role_en: "Corporate Sustainability Manager",
    pain_point_uk: "Розрізнені Excel-таблиці, помилки введення",
    pain_point_en: "Fragmented Excel files, data entry errors",
  },
  timeline: [
    { step_type: "context", icon_key: "calendar", text_uk: "Кінець кварталу — Олена має терміново підготувати звіт", text_en: "End of quarter — Olena must urgently prepare a report" },
    { step_type: "goal", icon_key: "target", text_uk: "Консолідувати викиди із 3 регіональних офісів", text_en: "Consolidate emissions from 3 regional offices" },
    { step_type: "action", icon_key: "zap", text_uk: "Логін → Один клік → Автогенерація звіту та AI-інсайти", text_en: "Login → One Click → Auto-generate report and AI insights" },
    { step_type: "result", icon_key: "check-circle", text_uk: "Повний звіт готовий за 15 хвилин, дані з усіх офісів звірені", text_en: "Full report ready in 15 minutes, data from all offices reconciled" },
    { step_type: "impact", icon_key: "trending-up", text_uk: "Вивільнені дні Олена витрачає на нові ESG-ініціативи", text_en: "Olena spends the freed-up days on new ESG initiatives" },
  ],
  metrics: {
    before: { value_uk: "3 дні", value_en: "3 days", label_uk: "Ручний збір даних з Excel", label_en: "Manual Excel data collection" },
    after: { value_uk: "15 хв", value_en: "15 min", label_uk: "Готовий звіт з AI-аналітикою", label_en: "Ready report with AI analytics" },
  },
}

export function getMockScenarioData(): ScenarioData {
  return data
}
