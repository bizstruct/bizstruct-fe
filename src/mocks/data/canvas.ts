import type { CanvasSections } from "@/schemas/canvas.schema"

export const mockDefaultCanvas: CanvasSections = {
  keyPartners:           [{ id: "kp-1",   text: "Local data integrators and ERP vendors",              isAiGenerated: true }],
  keyActivities:         [{ id: "ka-1",   text: "Automated data ingestion and normalization",           isAiGenerated: true }],
  keyResources:          [{ id: "kr-1",   text: "Sensor & IoT connectors",                             isAiGenerated: false }],
  valuePropositions:     [{ id: "vp-1",   text: "Real-time carbon footprint monitoring for assets",    isAiGenerated: true }],
  customerRelationships: [{ id: "cr-1",   text: "Dedicated onboarding and monthly check-ins",          isAiGenerated: false }],
  channels:              [{ id: "ch-1",   text: "API integrations and one-click export",               isAiGenerated: true }],
  customerSegments:      [{ id: "cs-1",   text: "Mid-market corporate sustainability teams",           isAiGenerated: true }],
  costStructure:         [{ id: "cost-1", text: "Cloud compute for model training and inference",      isAiGenerated: true }],
  revenueStreams:        [{ id: "rev-1",  text: "Subscription tiers (Core, Pro, Enterprise)",          isAiGenerated: true }],
}
