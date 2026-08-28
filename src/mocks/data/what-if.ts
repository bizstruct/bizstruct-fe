import type { WhatIfDataWire } from "@/schemas/what-if.schema"

// Wire shape (snake_case, single-language) — same shape services/what-if.ts
// gets from the real backend, no normalize layer in between. See
// bizstruct_domain.blocks.what_if for the source of truth.
export const mockWhatIfData: { whatIf: WhatIfDataWire } = {
  whatIf: {
    alternatives: [
      {
        id: "a1111111-1111-1111-1111-111111111111",
        title: "Pay for outcome",
        premise: "Remove the subscription, charge only for the client's confirmed outcome.",
        moves: [
          {
            action: "eliminate",
            target_section: "revenue_streams",
            target: "Monthly subscription tiers",
            rationale: "The subscription conflicts with pay-for-outcome pricing.",
          },
          {
            action: "raise",
            target_section: "value_propositions",
            target: "Automated ESG reporting",
            new_text: "Automated ESG reporting with a savings guarantee",
            rationale: "A savings guarantee strengthens the value proposition.",
          },
          {
            action: "create",
            target_section: "revenue_streams",
            target: "Success fee: % of confirmed savings",
            rationale: "New revenue stream aligning incentives.",
          },
        ],
        expected_impact: "Lower entry barrier, higher ARPU on large accounts.",
        status: "applied",
      },
      {
        id: "a2222222-2222-2222-2222-222222222222",
        title: "No-UI, AI-assistant only",
        premise: "Remove the web interface, work exclusively through an AI assistant.",
        moves: [
          {
            action: "eliminate",
            target_section: "channels",
            target: "Web dashboard",
            rationale: "A classic UI isn't needed if interaction is fully assistant-driven.",
          },
          {
            action: "reduce",
            target_section: "cost_structure",
            target: "Frontend engineering team",
            new_text: "Small frontend maintenance team",
            rationale: "Less UI means a smaller frontend team.",
          },
          {
            action: "create",
            target_section: "key_resources",
            target: "Conversational AI infrastructure",
            rationale: "New key resource for voice/chat scenarios.",
          },
        ],
        expected_impact: "Less user friction, growing AI infrastructure costs.",
        status: "draft",
      },
      {
        id: "a3333333-3333-3333-3333-333333333333",
        title: "Persona's psychological peace",
        premise: "Focus on reducing the persona's anxiety, not just functional efficiency.",
        moves: [
          {
            action: "reduce",
            target_section: "customer_relationships",
            target: "Self-serve only support",
            new_text: "Guided onboarding with proactive check-ins",
            rationale: "Proactive support reduces the persona's anxiety.",
          },
          {
            action: "raise",
            target_section: "value_propositions",
            target: "Automated ESG reporting",
            new_text: "Automated ESG reporting with plain-language explanations",
            rationale: "Plain-language explanations reduce cognitive load.",
          },
          {
            action: "create",
            target_section: "channels",
            target: "In-app calm-mode guided workflows",
            rationale: "New channel for reducing stress during work.",
          },
        ],
        expected_impact: "The product reads as a trusted partner, not just a tool.",
        status: "draft",
      },
    ],
  },
}
