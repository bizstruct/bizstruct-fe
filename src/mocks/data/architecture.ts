import type { ArchitectureData } from "@/schemas/architecture.schema"

const data: ArchitectureData = {
  epicenter: {
    value:       "finance-driven",
    description: "Your model is built around an innovative monetization approach and cash flow optimization. The main focus is cost structure and revenue streams.",
  },
  pattern: {
    value:       "free",
    subtype:     "freemium",
    description: "AI applies Freemium model rules: a free first step for viral growth and paid tools for deep analytics.",
  },
}

export function getMockArchitectureData(): ArchitectureData {
  return data
}
