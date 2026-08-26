import type { EmpathyMap } from "@/schemas/empathy-map.schema"

const data: EmpathyMap = {
  says: [
    { id: 1, text_uk: "Нам потрібно автоматизувати ESG-звітність, щоб відповідати вимогам стейкхолдерів.", text_en: "We need to automate ESG reporting to meet stakeholder requirements." },
    { id: 2, text_uk: "Поточні процеси збору даних занадто повільні.", text_en: "Current data collection processes are too slow." },
    { id: 3, text_uk: "Аудитори щоразу питають дані, яких у нас немає під рукою.", text_en: "Auditors keep asking for data we don't have on hand." },
  ],
  thinks: [
    { id: 1, text_uk: "Я хвилююся за точність даних перед наступним аудитом.", text_en: "I'm worried about data accuracy before the next audit." },
    { id: 2, text_uk: "Чи зможе новий інструмент безшовно інтегруватися з нашою SAP/Oracle ERP?", text_en: "Can the new tool integrate seamlessly with our SAP/Oracle ERP?" },
    { id: 3, text_uk: "Скільки часу піде на впровадження без зупинки поточних процесів?", text_en: "How long will rollout take without stopping current processes?" },
  ],
  does: [
    { id: 1, text_uk: "Щомісяця вручну збирає Excel-таблиці з різних департаментів.", text_en: "Manually collects Excel spreadsheets from different departments every month." },
    { id: 2, text_uk: "Презентує екологічні метрики раді директорів через статичні слайди.", text_en: "Presents environmental metrics to the board via static slides." },
    { id: 3, text_uk: "Звіряє цифри вручну перед кожним поданням звіту.", text_en: "Manually reconciles figures before every report submission." },
  ],
  feels: [
    { id: 1, text_uk: "Розгубленість через постійні зміни в глобальних екологічних регуляціях.", text_en: "Confusion due to constant changes in global environmental regulations." },
    { id: 2, text_uk: "Фрустрація через внутрішню закритість департаментів, що заважає збору даних.", text_en: "Frustration due to internal departmental silos that hinder data collection." },
    { id: 3, text_uk: "Тривога перед кожним аудитом через непевність у якості даних.", text_en: "Anxiety before every audit due to uncertainty about data quality." },
  ],
  pains: [
    { id: 1, text_uk: "Ризик людського фактору — помилки введення та ручна агрегація даних.", text_en: "Risk of human error — data entry mistakes and manual aggregation." },
    { id: 2, text_uk: "Відсутність real-time CO2 трекінгу для прийняття швидких рішень.", text_en: "Lack of real-time CO2 tracking for quick decision-making." },
    { id: 3, text_uk: "Обмежений бюджет на аналітику і інженерні інтеграції.", text_en: "Limited budget for analytics and engineering integrations." },
  ],
  gains: [
    { id: 1, text_uk: "Автоматизація звітів — швидка генерація стандартизованих документів.", text_en: "Report automation — fast generation of standardized documents." },
    { id: 2, text_uk: "Доведення ROI для ради директорів через фінансові сценарії.", text_en: "Proving ROI to the board via financial scenarios." },
    { id: 3, text_uk: "Безшовна API інтеграція для зручної синхронізації даних.", text_en: "Seamless API integration for convenient data synchronization." },
  ],
}

export function getMockEmpathyData(): EmpathyMap {
  return data
}
