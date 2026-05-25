import type { WhatIfVector } from "@/schemas/what-if.schema"

export const mockWhatIfVectors: WhatIfVector[] = [
  {
    id: "financial",
    badgeKey:  "WhatIfView.vectors.financial.badge",
    titleKey:  "WhatIfView.vectors.financial.title",
    promptKey: "WhatIfView.vectors.financial.prompt",
    accentClass: "text-indigo-600 group-hover:text-indigo-700",
    borderClass: "border-t-indigo-500",
    iconKey: "coins",
    blocks: [
      { labelKey: "WhatIfView.blockLabels.value",   text: "WhatIfView.vectors.financial.blocks.value" },
      { labelKey: "WhatIfView.blockLabels.revenue", text: "WhatIfView.vectors.financial.blocks.revenue" },
    ],
  },
  {
    id: "technical",
    badgeKey:  "WhatIfView.vectors.technical.badge",
    titleKey:  "WhatIfView.vectors.technical.title",
    promptKey: "WhatIfView.vectors.technical.prompt",
    accentClass: "text-teal-600 group-hover:text-teal-700",
    borderClass: "border-t-teal-500",
    iconKey: "cpu",
    blocks: [
      { labelKey: "WhatIfView.blockLabels.value", text: "WhatIfView.vectors.technical.blocks.value" },
      { labelKey: "WhatIfView.blockLabels.cost",  text: "WhatIfView.vectors.technical.blocks.cost" },
    ],
  },
  {
    id: "emotional",
    badgeKey:  "WhatIfView.vectors.emotional.badge",
    titleKey:  "WhatIfView.vectors.emotional.title",
    promptKey: "WhatIfView.vectors.emotional.prompt",
    accentClass: "text-slate-700 group-hover:text-slate-900",
    borderClass: "border-t-slate-600",
    iconKey: "heartHandshake",
    blocks: [
      { labelKey: "WhatIfView.blockLabels.value",         text: "WhatIfView.vectors.emotional.blocks.value" },
      { labelKey: "WhatIfView.blockLabels.relationships", text: "WhatIfView.vectors.emotional.blocks.relationships" },
    ],
  },
]
