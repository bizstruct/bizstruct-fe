import type { Pitch } from "@/types/domain/pitch"

const data: Pitch = {
  investor: [
    { type: "hook", headline: "$1.2 trillion in ESG fines — this year alone", content: "Every corporate sustainability team is drowning in spreadsheets while regulators tighten the noose." },
    { type: "problem", headline: "Managers spend 6+ hours weekly on manual aggregation", content: "CFOs can't justify ESG investment ROI to their boards. CSRD deadlines loom large across the EU." },
    { type: "solution", headline: "EcoSync: a report in 15 minutes instead of 3 days", content: "Automates ESG data collection, delivers real-time carbon monitoring, and generates board-ready reports." },
    { type: "traction", headline: "3 pilots. €2.1M ARR pipeline. NPS 72.", content: "CSRD-certified reporting module launched across the beta cohort." },
    { type: "ask", headline: "Raising €4M Series A", content: "To expand EU sales motion and build a Scope 3 supplier network. Targeting €8M ARR by end of Year 2." },
  ],
  customer: [
    { type: "opening", headline: "Olena, the board wants the ESG report by Friday", content: "Your inbox is a graveyard of Excel files from 3 regional offices." },
    { type: "empathy", headline: "We know: copy-pasting figures at midnight isn't your job", content: "One wrong cell and the whole report is meaningless. It happens every quarter." },
    { type: "transformation", headline: "One click instead of three days of manual work", content: "With EcoSync you connect your data sources once and click Generate Report. Fifteen minutes later, a CSRD-compliant document is ready." },
    { type: "social_proof", headline: '"Cut our reporting cycle from 3 days to under an hour"', content: "— ESG Lead, Fortune 500 manufacturer. Our CFO finally trusts the numbers." },
    { type: "invitation", headline: "Start your free 14-day trial", content: "No credit card, no implementation fees, no spreadsheets." },
  ],
}

export function getMockPitchData(): Pitch {
  return data
}
