import type { Architecture } from "@/schemas/architecture.schema"

const data: Architecture = {
  epicenter: "finance_driven",
  epicenter_rationale: "The model is built around an innovative monetization approach and cash flow optimization. The main focus is cost structure and revenue streams.",
  pattern: "free",
  pattern_subtype: "freemium",
  pattern_rationale: "AI applies Freemium model rules: a free first step for viral growth and paid tools for deep analytics.",
}

export function getMockArchitectureData(): Architecture {
  return data
}
