import type { Hypothesis } from "@/schemas/hypotheses.schema"

export const mockHypotheses: Hypothesis[] = [
  { id: "H1.1", text: "Sustainability managers spend 6+ hours/week on manual data aggregation",             category: "desirability", quadrant: "q1" },
  { id: "H1.2", text: "CFOs cannot justify ESG investment ROI without automated scenario modeling",         category: "viability",    quadrant: "q1" },
  { id: "H1.3", text: "Real-time Scope 3 supplier tracking is feasible through ERP connector APIs",        category: "feasibility",  quadrant: "q1" },
  { id: "H2.1", text: "CSRD deadlines create urgent demand for automated reporting across EU",             category: "desirability", quadrant: "q2" },
  { id: "H2.2", text: "Mid-market companies will pay €12k–€36k/year for automated ESG reporting",         category: "viability",    quadrant: "q2" },
  { id: "H3.1", text: "Small ESG teams prefer no-code onboarding without professional services",          category: "desirability", quadrant: "q3" },
  { id: "H3.2", text: "API integrations with SAP & Oracle can be self-served without implementation",     category: "feasibility",  quadrant: "q3" },
]
