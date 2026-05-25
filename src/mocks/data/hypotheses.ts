import type { Hypothesis } from "@/schemas/hypotheses.schema"

export const mockHypotheses: Hypothesis[] = [
  { id: "H1.1", text: "Sustainability managers spend 6+ hours/week on manual data aggregation",             category: "Desirability", quadrant: "q1" },
  { id: "H1.2", text: "CFOs cannot justify ESG investment ROI without automated scenario modeling",         category: "Viability",    quadrant: "q1" },
  { id: "H1.3", text: "Real-time Scope 3 supplier tracking is feasible through ERP connector APIs",        category: "Feasibility",  quadrant: "q1" },
  { id: "H2.1", text: "CSRD deadlines create urgent demand for automated reporting across EU",             category: "Desirability", quadrant: "q2" },
  { id: "H2.2", text: "Mid-market companies will pay €12k–€36k/year for automated ESG reporting",         category: "Viability",    quadrant: "q2" },
  { id: "H3.1", text: "Small ESG teams prefer no-code onboarding without professional services",          category: "Desirability", quadrant: "q3" },
  { id: "H3.2", text: "API integrations with SAP & Oracle can be self-served without implementation",     category: "Feasibility",  quadrant: "q3" },
]
