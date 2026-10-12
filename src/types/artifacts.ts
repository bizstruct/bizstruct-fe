// Glue between the API's ArtifactType strings and the generated domain types (src/types/domain).
// Nothing is declared by hand here: each entry points at the type generated from the domain schema.

import type { Brief } from "./domain/brief"
import type { BusinessCase } from "./domain/business-case"
import type { Canvas } from "./domain/canvas"
import type { CustomerScenario } from "./domain/customer-scenario"
import type { EmpathyMap } from "./domain/empathy-map"
import type { EnvironmentScan } from "./domain/environment-scan"
import type { Errc } from "./domain/errc"
import type { FutureScenario } from "./domain/future-scenario"
import type { Ideation } from "./domain/ideation"
import type { Patterns } from "./domain/patterns"
import type { Pitch } from "./domain/pitch"
import type { Storytelling } from "./domain/storytelling"
import type { Swot } from "./domain/swot"
import type { TeamInfo } from "./domain/team-info"

export interface ArtifactModels {
  brief: Brief
  empathy_map: EmpathyMap
  customer_scenario: CustomerScenario
  ideation: Ideation
  patterns: Patterns
  canvas: Canvas
  swot: Swot
  errc: Errc
  storytelling: Storytelling
  future_scenario: FutureScenario
  pitch: Pitch
  business_case: BusinessCase
  environment_scan: EnvironmentScan
  team_info: TeamInfo
}

export type ArtifactKind = keyof ArtifactModels
