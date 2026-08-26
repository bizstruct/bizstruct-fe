import type { WhatIfDataWire } from "@/schemas/what-if.schema"

// Wire shape (snake_case, bilingual inline) — same shape services/what-if.ts
// gets from the real backend, no normalize layer in between. See
// bizstruct_domain.blocks.what_if for the source of truth.
export const mockWhatIfData: { whatIf: WhatIfDataWire } = {
  whatIf: {
    alternatives: [
      {
        id: "a1111111-1111-1111-1111-111111111111",
        title_uk: "Оплата за результат",
        title_en: "Pay for outcome",
        premise_uk: "Прибрати підписку, стягувати лише за підтверджений результат клієнта.",
        premise_en: "Remove the subscription, charge only for the client's confirmed outcome.",
        moves: [
          {
            action: "eliminate",
            target_section: "revenue_streams",
            target: "Monthly subscription tiers",
            rationale_uk: "Підписка суперечить моделі оплати за результат.",
            rationale_en: "The subscription conflicts with pay-for-outcome pricing.",
          },
          {
            action: "raise",
            target_section: "value_propositions",
            target: "Automated ESG reporting",
            new_text: "Automated ESG reporting with a savings guarantee",
            rationale_uk: "Гарантія економії підсилює ціннісну пропозицію.",
            rationale_en: "A savings guarantee strengthens the value proposition.",
          },
          {
            action: "create",
            target_section: "revenue_streams",
            target: "Success fee: % of confirmed savings",
            rationale_uk: "Новий потік доходу, що вирівнює інтереси.",
            rationale_en: "New revenue stream aligning incentives.",
          },
        ],
        expected_impact_uk: "Нижчий поріг входу, вищий ARPU на великих клієнтах.",
        expected_impact_en: "Lower entry barrier, higher ARPU on large accounts.",
        status: "applied",
      },
      {
        id: "a2222222-2222-2222-2222-222222222222",
        title_uk: "No-UI, тільки AI-асистент",
        title_en: "No-UI, AI-assistant only",
        premise_uk: "Прибрати веб-інтерфейс, працювати виключно через AI-асистента.",
        premise_en: "Remove the web interface, work exclusively through an AI assistant.",
        moves: [
          {
            action: "eliminate",
            target_section: "channels",
            target: "Web dashboard",
            rationale_uk: "Класичний UI не потрібен, якщо взаємодія повністю через асистента.",
            rationale_en: "A classic UI isn't needed if interaction is fully assistant-driven.",
          },
          {
            action: "reduce",
            target_section: "cost_structure",
            target: "Frontend engineering team",
            new_text: "Small frontend maintenance team",
            rationale_uk: "Менше UI — менша команда фронтенду.",
            rationale_en: "Less UI means a smaller frontend team.",
          },
          {
            action: "create",
            target_section: "key_resources",
            target: "Conversational AI infrastructure",
            rationale_uk: "Новий ключовий ресурс для голосових/чат-сценаріїв.",
            rationale_en: "New key resource for voice/chat scenarios.",
          },
        ],
        expected_impact_uk: "Менше тертя для користувача, зростання витрат на AI-інфраструктуру.",
        expected_impact_en: "Less user friction, growing AI infrastructure costs.",
        status: "draft",
      },
      {
        id: "a3333333-3333-3333-3333-333333333333",
        title_uk: "Психологічний спокій персони",
        title_en: "Persona's psychological peace",
        premise_uk: "Фокус на зниженні тривоги персони, а не лише на функціональній ефективності.",
        premise_en: "Focus on reducing the persona's anxiety, not just functional efficiency.",
        moves: [
          {
            action: "reduce",
            target_section: "customer_relationships",
            target: "Self-serve only support",
            new_text: "Guided onboarding with proactive check-ins",
            rationale_uk: "Проактивна підтримка знижує тривогу персони.",
            rationale_en: "Proactive support reduces the persona's anxiety.",
          },
          {
            action: "raise",
            target_section: "value_propositions",
            target: "Automated ESG reporting",
            new_text: "Automated ESG reporting with plain-language explanations",
            rationale_uk: "Зрозумілі пояснення знижують когнітивне навантаження.",
            rationale_en: "Plain-language explanations reduce cognitive load.",
          },
          {
            action: "create",
            target_section: "channels",
            target: "In-app calm-mode guided workflows",
            rationale_uk: "Новий канал для зниження стресу під час роботи.",
            rationale_en: "New channel for reducing stress during work.",
          },
        ],
        expected_impact_uk: "Продукт сприймається як довірений партнер, а не інструмент.",
        expected_impact_en: "The product reads as a trusted partner, not just a tool.",
        status: "draft",
      },
    ],
  },
}
