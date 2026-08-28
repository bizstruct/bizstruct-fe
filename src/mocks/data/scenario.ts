import type { ScenarioData } from "@/schemas/scenario.schema"

const data: ScenarioData = {
  persona: {
    name: "Olena Koval",
    role: "Corporate Sustainability Manager",
    pain_point: "Fragmented Excel files, data entry errors",
  },
  timeline: [
    { step_type: "context", text: "End of quarter — Olena must urgently prepare a report" },
    { step_type: "goal", text: "Consolidate emissions from 3 regional offices" },
    { step_type: "action", text: "Login → One Click → Auto-generate report and AI insights" },
    { step_type: "result", text: "Full report ready in 15 minutes, data from all offices reconciled" },
    { step_type: "impact", text: "Olena spends the freed-up days on new ESG initiatives" },
  ],
  metrics: {
    before: { value: "3 days", label: "Manual Excel data collection" },
    after: { value: "15 min", label: "Ready report with AI analytics" },
  },
}

export function getMockScenarioData(): ScenarioData {
  return data
}
