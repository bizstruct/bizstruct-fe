import type { Locale } from "@/constants/i18n"
import type { PitchData } from "@/schemas/pitch.schema"

const pitchMockData: Record<Locale, PitchData> = {
  uk: {
    investor: [
      { id: 1, titleKey: "PitchView.investor.hook",        content: "<strong>$1.2 трлн</strong> у штрафах та невідповідностях ESG — лише цього року. Кожна корпоративна команда зі сталого розвитку тоне в таблицях, поки регулятори затягують петлю." },
      { id: 2, titleKey: "PitchView.investor.problem",     content: "Менеджери зі сталого розвитку витрачають <strong>6+ годин на тиждень</strong> на ручну агрегацію даних. Фінансові директори не можуть обґрунтувати ROI ESG-інвестицій перед радою. Дедлайни CSRD маячать по всьому ЄС." },
      { id: 3, titleKey: "PitchView.investor.solution",    content: "<strong>EcoSync</strong> автоматизує збір ESG-даних, забезпечує моніторинг вуглецевого сліду в реальному часі та генерує звіти для ради директорів за <strong>15 хвилин</strong> замість 3 днів." },
      { id: 4, titleKey: "PitchView.investor.traction",    content: "<ul><li>3 корпоративних пілоти підписано (€2.1М ARR pipeline)</li><li>Запущено CSRD-сертифікований модуль звітності</li><li>NPS 72 серед бета-когорти</li></ul>" },
      { id: 5, titleKey: "PitchView.investor.ask",         content: "Залучаємо <strong>€4М Series A</strong> для розширення продажів у ЄС та побудови мережі Scope 3 постачальників. Ціль — €8М ARR до кінця 2-го року." },
    ],
    customer: [
      { id: 1, titleKey: "PitchView.customer.opening",     content: "Ви — Олена. Кінець кварталу. Рада хоче звіт ESG <strong>до п'ятниці</strong>. Ваша поштова скринька — цвинтар Excel-файлів із 3 регіональних офісів." },
      { id: 2, titleKey: "PitchView.customer.empathy",     content: "Ви вже бували тут — копіювали цифри опівночі, сподіваючись, що ніхто не змінив формулу. Одна неправильна клітинка — і весь звіт <strong>марний</strong>." },
      { id: 3, titleKey: "PitchView.customer.transformation", content: "З EcoSync ви входите в систему, одноразово підключаєте джерела даних і натискаєте <strong>Згенерувати звіт</strong>. За п'ятнадцять хвилин CSRD-сумісний документ у вашій скринці." },
      { id: 4, titleKey: "PitchView.customer.socialProof", content: "<blockquote>EcoSync скоротив наш цикл звітності з 3 днів до менш ніж години. Наш фінансовий директор нарешті довіряє цифрам.</blockquote><cite>— ESG Lead, Fortune 500 виробник</cite>" },
      { id: 5, titleKey: "PitchView.customer.invitation",  content: "Готові повернути свої п'ятниці? <strong>Почніть безкоштовне 14-денне пробне використання</strong> — без картки, без впровадження, без таблиць." },
    ],
  },
  en: {
    investor: [
      { id: 1, titleKey: "PitchView.investor.hook",        content: "<strong>$1.2 trillion</strong> in ESG fines and compliance failures — this year alone. Every corporate sustainability team is drowning in spreadsheets while regulators tighten the noose." },
      { id: 2, titleKey: "PitchView.investor.problem",     content: "Corporate sustainability managers spend <strong>6+ hours weekly</strong> on manual data aggregation. CFOs can't justify ESG investment ROI to their boards. CSRD deadlines loom large across the EU." },
      { id: 3, titleKey: "PitchView.investor.solution",    content: "<strong>EcoSync</strong> automates ESG data collection, delivers real-time carbon monitoring, and generates board-ready reports in <strong>15 minutes</strong> instead of 3 days." },
      { id: 4, titleKey: "PitchView.investor.traction",    content: "<ul><li>3 enterprise pilots signed (€2.1M ARR pipeline)</li><li>CSRD-certified reporting module launched</li><li>NPS of 72 across beta cohort</li></ul>" },
      { id: 5, titleKey: "PitchView.investor.ask",         content: "Raising <strong>€4M Series A</strong> to expand EU sales motion and build Scope 3 supplier network. Targeting €8M ARR by end of Year 2." },
    ],
    customer: [
      { id: 1, titleKey: "PitchView.customer.opening",     content: "You're Olena. End of quarter. The board wants the ESG report <strong>by Friday</strong>. Your inbox is a graveyard of Excel files from 3 regional offices." },
      { id: 2, titleKey: "PitchView.customer.empathy",     content: "You've been here before — copy-pasting figures at midnight, praying no one changed a formula. One wrong cell and the whole report is <strong>meaningless</strong>." },
      { id: 3, titleKey: "PitchView.customer.transformation", content: "With EcoSync, you log in, connect your data sources once, and click <strong>Generate Report</strong>. Fifteen minutes later, a CSRD-compliant document lands in your inbox." },
      { id: 4, titleKey: "PitchView.customer.socialProof", content: "<blockquote>EcoSync cut our reporting cycle from 3 days to under an hour. Our CFO finally trusts the numbers.</blockquote><cite>— ESG Lead, Fortune 500 manufacturer</cite>" },
      { id: 5, titleKey: "PitchView.customer.invitation",  content: "Ready to reclaim your Fridays? <strong>Start your free 14-day trial</strong> — no credit card, no implementation fees, no spreadsheets." },
    ],
  },
}

export function getMockPitchData(locale: Locale): PitchData {
  return pitchMockData[locale] ?? pitchMockData.en
}
