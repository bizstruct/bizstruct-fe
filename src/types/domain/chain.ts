// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.7.0/schemas/chain.json (bizstruct-domain@v0.7.0)

export type StageMode = "both" | "pro"

export type StageId = "brief" | "empathy_map" | "environment_scan" | "value_map" | "models_options" | "canvas" | "architecture" | "assessment" | "what_if" | "hypotheses" | "scenario" | "pitch"

export interface Stage {
  id: StageId
  title_uk: string
  depends_on: readonly StageId[]
  mode: StageMode
  requires_user_gate: boolean
  source: string
}

export const STAGES: readonly Stage[] = [
  {
    "depends_on": [],
    "id": "brief",
    "mode": "both",
    "requires_user_gate": false,
    "source": "-",
    "title_uk": "Нормалізація ідеї"
  },
  {
    "depends_on": [
      "brief"
    ],
    "id": "empathy_map",
    "mode": "both",
    "requires_user_gate": false,
    "source": "BMG, Customer Insights",
    "title_uk": "Карта емпатії"
  },
  {
    "depends_on": [
      "brief",
      "empathy_map"
    ],
    "id": "environment_scan",
    "mode": "pro",
    "requires_user_gate": false,
    "source": "BMG, Business Model Environment",
    "title_uk": "Аналіз середовища (4 сили)"
  },
  {
    "depends_on": [
      "empathy_map"
    ],
    "id": "value_map",
    "mode": "both",
    "requires_user_gate": false,
    "source": "Value Proposition Design",
    "title_uk": "Ціннісна пропозиція"
  },
  {
    "depends_on": [
      "empathy_map",
      "value_map"
    ],
    "id": "models_options",
    "mode": "both",
    "requires_user_gate": true,
    "source": "BMG, Ideation",
    "title_uk": "Варіанти монетизації"
  },
  {
    "depends_on": [
      "empathy_map",
      "value_map",
      "models_options"
    ],
    "id": "canvas",
    "mode": "both",
    "requires_user_gate": false,
    "source": "BMG, ядро",
    "title_uk": "Business Model Canvas"
  },
  {
    "depends_on": [
      "canvas"
    ],
    "id": "architecture",
    "mode": "both",
    "requires_user_gate": false,
    "source": "BMG, Patterns",
    "title_uk": "Епіцентр і патерн"
  },
  {
    "depends_on": [
      "canvas",
      "architecture"
    ],
    "id": "assessment",
    "mode": "pro",
    "requires_user_gate": false,
    "source": "BMG, Evaluating Business Models",
    "title_uk": "SWOT-оцінка блоків"
  },
  {
    "depends_on": [
      "canvas",
      "architecture"
    ],
    "id": "what_if",
    "mode": "both",
    "requires_user_gate": true,
    "source": "Blue Ocean Strategy",
    "title_uk": "ERRC-альтернативи"
  },
  {
    "depends_on": [
      "canvas",
      "what_if"
    ],
    "id": "hypotheses",
    "mode": "both",
    "requires_user_gate": false,
    "source": "Testing Business Ideas",
    "title_uk": "Гіпотези D/V/F"
  },
  {
    "depends_on": [
      "empathy_map",
      "value_map",
      "models_options"
    ],
    "id": "scenario",
    "mode": "both",
    "requires_user_gate": false,
    "source": "BMG, Scenarios",
    "title_uk": "Сценарій до/після"
  },
  {
    "depends_on": [
      "brief",
      "empathy_map",
      "value_map",
      "models_options",
      "canvas",
      "architecture",
      "what_if",
      "hypotheses",
      "scenario"
    ],
    "id": "pitch",
    "mode": "both",
    "requires_user_gate": false,
    "source": "BMG, Storytelling",
    "title_uk": "Пітч-презентації"
  }
] as const
