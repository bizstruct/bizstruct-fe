import type { EmpathyMap } from "@/schemas/empathy-map.schema"

const data: EmpathyMap = {
  says: [
    { id: 1, text: "We need to automate ESG reporting to meet stakeholder requirements." },
    { id: 2, text: "Current data collection processes are too slow." },
    { id: 3, text: "Auditors keep asking for data we don't have on hand." },
  ],
  thinks: [
    { id: 1, text: "I'm worried about data accuracy before the next audit." },
    { id: 2, text: "Can the new tool integrate seamlessly with our SAP/Oracle ERP?" },
    { id: 3, text: "How long will rollout take without stopping current processes?" },
  ],
  does: [
    { id: 1, text: "Manually collects Excel spreadsheets from different departments every month." },
    { id: 2, text: "Presents environmental metrics to the board via static slides." },
    { id: 3, text: "Manually reconciles figures before every report submission." },
  ],
  feels: [
    { id: 1, text: "Confusion due to constant changes in global environmental regulations." },
    { id: 2, text: "Frustration due to internal departmental silos that hinder data collection." },
    { id: 3, text: "Anxiety before every audit due to uncertainty about data quality." },
  ],
  pains: [
    { id: 1, text: "Risk of human error — data entry mistakes and manual aggregation." },
    { id: 2, text: "Lack of real-time CO2 tracking for quick decision-making." },
    { id: 3, text: "Limited budget for analytics and engineering integrations." },
  ],
  gains: [
    { id: 1, text: "Report automation — fast generation of standardized documents." },
    { id: 2, text: "Proving ROI to the board via financial scenarios." },
    { id: 3, text: "Seamless API integration for convenient data synchronization." },
  ],
}

export function getMockEmpathyData(): EmpathyMap {
  return data
}
