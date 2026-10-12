// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/stages.json (bizstruct-domain@v0.17.0)

export type StageId = "brief" | "empathy_map" | "customer_scenario" | "ideation" | "patterns" | "canvas" | "environment_scan" | "swot_errc_cycle" | "storytelling" | "future_scenario" | "team_info" | "business_case" | "pitch"

export interface StageDefinition {
  id: StageId
  depends_on: readonly StageId[]
  optional_depends_on: readonly StageId[]
  allows_multiple_instances: boolean
  is_optional: boolean
}

export const STAGES: readonly StageDefinition[] = [
  {
    "allows_multiple_instances": false,
    "depends_on": [],
    "id": "brief",
    "is_optional": false,
    "optional_depends_on": []
  },
  {
    "allows_multiple_instances": true,
    "depends_on": [
      "brief"
    ],
    "id": "empathy_map",
    "is_optional": false,
    "optional_depends_on": []
  },
  {
    "allows_multiple_instances": true,
    "depends_on": [
      "empathy_map"
    ],
    "id": "customer_scenario",
    "is_optional": false,
    "optional_depends_on": []
  },
  {
    "allows_multiple_instances": true,
    "depends_on": [
      "empathy_map"
    ],
    "id": "ideation",
    "is_optional": false,
    "optional_depends_on": []
  },
  {
    "allows_multiple_instances": false,
    "depends_on": [
      "customer_scenario",
      "ideation"
    ],
    "id": "patterns",
    "is_optional": false,
    "optional_depends_on": []
  },
  {
    "allows_multiple_instances": true,
    "depends_on": [
      "brief",
      "empathy_map",
      "customer_scenario",
      "ideation",
      "patterns"
    ],
    "id": "canvas",
    "is_optional": false,
    "optional_depends_on": []
  },
  {
    "allows_multiple_instances": false,
    "depends_on": [
      "brief"
    ],
    "id": "environment_scan",
    "is_optional": true,
    "optional_depends_on": []
  },
  {
    "allows_multiple_instances": true,
    "depends_on": [
      "canvas"
    ],
    "id": "swot_errc_cycle",
    "is_optional": false,
    "optional_depends_on": [
      "environment_scan"
    ]
  },
  {
    "allows_multiple_instances": true,
    "depends_on": [
      "swot_errc_cycle"
    ],
    "id": "storytelling",
    "is_optional": false,
    "optional_depends_on": []
  },
  {
    "allows_multiple_instances": true,
    "depends_on": [
      "swot_errc_cycle"
    ],
    "id": "future_scenario",
    "is_optional": false,
    "optional_depends_on": []
  },
  {
    "allows_multiple_instances": false,
    "depends_on": [],
    "id": "team_info",
    "is_optional": true,
    "optional_depends_on": []
  },
  {
    "allows_multiple_instances": false,
    "depends_on": [
      "brief"
    ],
    "id": "business_case",
    "is_optional": true,
    "optional_depends_on": []
  },
  {
    "allows_multiple_instances": true,
    "depends_on": [
      "storytelling",
      "swot_errc_cycle"
    ],
    "id": "pitch",
    "is_optional": false,
    "optional_depends_on": [
      "team_info",
      "business_case"
    ]
  }
] as const
