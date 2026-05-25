import type { Locale } from "@/constants/i18n"
import type { EmpathyData } from "@/schemas/empathy-map.schema"

const empathyMockData: Record<Locale, EmpathyData> = {
  uk: {
    says: [
      { id: 1, text: "Нам потрібно автоматизувати ESG-звітність, щоб відповідати вимогам стейкхолдерів." },
      { id: 2, text: "Поточні процеси збору даних занадто повільні." },
    ],
    thinks: [
      { id: 1, text: "Я хвилююся за точність даних перед наступним аудитом." },
      { id: 2, text: "Чи зможе новий інструмент безшовно інтегруватися з нашою SAP/Oracle ERP?" },
    ],
    does: [
      { id: 1, text: "Щомісяця вручну збирає Excel-таблиці з різних департаментів." },
      { id: 2, text: "Презентує екологічні метрики раді директорів через статичні слайди." },
    ],
    feels: [
      { id: 1, text: "Розгубленість через постійні зміни в глобальних екологічних регуляціях." },
      { id: 2, text: "Фрустрація через внутрішню закритість департаментів, що заважає збору даних." },
    ],
    pains: [
      { id: 1, text: "Ризик людського фактору — помилки введення та ручна агрегація даних." },
      { id: 2, text: "Відсутність real-time CO2 трекінгу для прийняття швидких рішень." },
      { id: 3, text: "Обмежений бюджет на аналітику і інженерні інтеграції." },
    ],
    gains: [
      { id: 1, text: "Автоматизація звітів — швидка генерація стандартизованих документів." },
      { id: 2, text: "Доведення ROI для ради директорів через фінансові сценарії." },
      { id: 3, text: "Безшовна API інтеграція для зручної синхронізації даних." },
    ],
  },
  en: {
    says: [
      { id: 1, text: "We need to automate ESG reporting to meet stakeholder requirements." },
      { id: 2, text: "Current data collection processes are too slow." },
    ],
    thinks: [
      { id: 1, text: "I'm worried about data accuracy before the next audit." },
      { id: 2, text: "Can the new tool integrate seamlessly with our SAP/Oracle ERP?" },
    ],
    does: [
      { id: 1, text: "Manually collects Excel spreadsheets from different departments every month." },
      { id: 2, text: "Presents environmental metrics to the board via static slides." },
    ],
    feels: [
      { id: 1, text: "Confusion due to constant changes in global environmental regulations." },
      { id: 2, text: "Frustration due to internal departmental silos that hinder data collection." },
    ],
    pains: [
      { id: 1, text: "Risk of human error — data entry mistakes and manual aggregation." },
      { id: 2, text: "Lack of real-time CO2 tracking for quick decision-making." },
      { id: 3, text: "Limited budget for analytics and engineering integrations." },
    ],
    gains: [
      { id: 1, text: "Report automation — fast generation of standardized documents." },
      { id: 2, text: "Proving ROI to the board via financial scenarios." },
      { id: 3, text: "Seamless API integration for convenient data synchronization." },
    ],
  },
}

export function getMockEmpathyData(locale: Locale): EmpathyData {
  return empathyMockData[locale] ?? empathyMockData.en
}
