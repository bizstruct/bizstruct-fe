import type { Pitch } from "@/types/domain/pitch"

const data: Pitch = {
  investor: [
    { type: "hook", headline_uk: "$1.2 трлн у штрафах ESG — лише цього року", headline_en: "$1.2 trillion in ESG fines — this year alone", content_uk: "Кожна корпоративна команда зі сталого розвитку тоне в таблицях, поки регулятори затягують петлю.", content_en: "Every corporate sustainability team is drowning in spreadsheets while regulators tighten the noose." },
    { type: "problem", headline_uk: "Менеджери витрачають 6+ годин на тиждень на ручну агрегацію", headline_en: "Managers spend 6+ hours weekly on manual aggregation", content_uk: "Фінансові директори не можуть обґрунтувати ROI ESG-інвестицій перед радою. Дедлайни CSRD маячать по всьому ЄС.", content_en: "CFOs can't justify ESG investment ROI to their boards. CSRD deadlines loom large across the EU." },
    { type: "solution", headline_uk: "EcoSync: звіт за 15 хвилин замість 3 днів", headline_en: "EcoSync: a report in 15 minutes instead of 3 days", content_uk: "Автоматизує збір ESG-даних, забезпечує моніторинг вуглецевого сліду в реальному часі та генерує звіти для ради директорів.", content_en: "Automates ESG data collection, delivers real-time carbon monitoring, and generates board-ready reports." },
    { type: "traction", headline_uk: "3 пілоти. €2.1М ARR pipeline. NPS 72.", headline_en: "3 pilots. €2.1M ARR pipeline. NPS 72.", content_uk: "CSRD-сертифікований модуль звітності запущено серед бета-когорти.", content_en: "CSRD-certified reporting module launched across the beta cohort." },
    { type: "ask", headline_uk: "Залучаємо €4М Series A", headline_en: "Raising €4M Series A", content_uk: "Для розширення продажів у ЄС та побудови мережі Scope 3 постачальників. Ціль — €8М ARR до кінця 2-го року.", content_en: "To expand EU sales motion and build a Scope 3 supplier network. Targeting €8M ARR by end of Year 2." },
  ],
  customer: [
    { type: "opening", headline_uk: "Олено, рада хоче ESG-звіт до п'ятниці", headline_en: "Olena, the board wants the ESG report by Friday", content_uk: "Ваша поштова скринька — цвинтар Excel-файлів із 3 регіональних офісів.", content_en: "Your inbox is a graveyard of Excel files from 3 regional offices." },
    { type: "empathy", headline_uk: "Ми знаємо: копіювати цифри опівночі — це не ваша робота", headline_en: "We know: copy-pasting figures at midnight isn't your job", content_uk: "Одна неправильна клітинка — і весь звіт марний. Це відбувається щоквартально.", content_en: "One wrong cell and the whole report is meaningless. It happens every quarter." },
    { type: "transformation", headline_uk: "Один клік замість трьох днів ручної роботи", headline_en: "One click instead of three days of manual work", content_uk: "З EcoSync ви підключаєте джерела даних один раз і натискаєте «Згенерувати звіт». За 15 хвилин CSRD-сумісний документ готовий.", content_en: "With EcoSync you connect your data sources once and click Generate Report. Fifteen minutes later, a CSRD-compliant document is ready." },
    { type: "social_proof", headline_uk: "«Скоротили цикл звітності з 3 днів до менш ніж години»", headline_en: '"Cut our reporting cycle from 3 days to under an hour"', content_uk: "— ESG Lead, виробник зі списку Fortune 500. Фінансовий директор нарешті довіряє цифрам.", content_en: "— ESG Lead, Fortune 500 manufacturer. Our CFO finally trusts the numbers." },
    { type: "invitation", headline_uk: "Почніть безкоштовне 14-денне пробне використання", headline_en: "Start your free 14-day trial", content_uk: "Без картки, без впровадження, без таблиць.", content_en: "No credit card, no implementation fees, no spreadsheets." },
  ],
}

export function getMockPitchData(): Pitch {
  return data
}
