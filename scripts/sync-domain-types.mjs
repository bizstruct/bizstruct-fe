#!/usr/bin/env node
// Pulls the persisted artifact JSON Schemas and stages.json from bizstruct-domain at a
// PINNED tag (never `main`) and generates TypeScript under src/types/domain/.
//
// Run: pnpm sync:domain
//
// The tag comes from package.json's "bizstructDomainVersion", the one place to bump when the
// domain package releases. CI re-runs this and fails if the committed files drift.
//
// Artifacts: brief, empathy_map, customer_scenario, ideation, patterns, canvas, swot, errc,
// storytelling, future_scenario, pitch, business_case, environment_scan, team_info. Each schema is
// the persisted model (`Model.model_json_schema()`), compiled with json-schema-to-typescript.
//
// stages.json is data, not a JSON Schema: the stage graph (depends_on, optional_depends_on,
// allows_multiple_instances, is_optional). It is written as a typed const so the progress view
// draws the graph from the domain instead of a copy.

import { compile } from "json-schema-to-typescript"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const OUT_DIR = path.join(ROOT, "src", "types", "domain")

const pkg = JSON.parse(await readFile(path.join(ROOT, "package.json"), "utf-8"))
const TAG = pkg.bizstructDomainVersion
if (!TAG) throw new Error('package.json is missing "bizstructDomainVersion": refusing to sync against a floating ref')
if (TAG === "main" || TAG === "master") throw new Error(`bizstructDomainVersion must be a pinned tag, not a branch ("${TAG}")`)

const RAW_BASE = `https://raw.githubusercontent.com/bizstruct/bizstruct-domain/${TAG}/schemas`

// [schema file, output file, root type name]
const ARTIFACTS = [
  ["brief", "brief", "Brief"],
  ["empathy_map", "empathy-map", "EmpathyMap"],
  ["customer_scenario", "customer-scenario", "CustomerScenario"],
  ["ideation", "ideation", "Ideation"],
  ["patterns", "patterns", "Patterns"],
  ["canvas", "canvas", "Canvas"],
  ["swot", "swot", "Swot"],
  ["errc", "errc", "Errc"],
  ["storytelling", "storytelling", "Storytelling"],
  ["future_scenario", "future-scenario", "FutureScenario"],
  ["pitch", "pitch", "Pitch"],
  ["business_case", "business-case", "BusinessCase"],
  ["environment_scan", "environment-scan", "EnvironmentScan"],
  ["team_info", "team-info", "TeamInfo"],
]

const header = (file) => `// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: ${RAW_BASE}/${file}.json (bizstruct-domain@${TAG})
`

async function fetchJson(name) {
  const url = `${RAW_BASE}/${name}.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  return res.json()
}

async function syncArtifact(file, out, title) {
  const schema = await fetchJson(file)
  const ts = await compile(schema, schema.title ?? title, { bannerComment: "", style: { semi: false } })
  await writeFile(path.join(OUT_DIR, `${out}.ts`), header(file) + "\n" + ts, "utf-8")
  console.log(`wrote src/types/domain/${out}.ts (bizstruct-domain@${TAG})`)
}

async function syncStages() {
  const stages = await fetchJson("stages")
  const union = stages.map((s) => JSON.stringify(s.id)).join(" | ")
  const body = `export type StageId = ${union}

export interface StageDefinition {
  id: StageId
  depends_on: readonly StageId[]
  optional_depends_on: readonly StageId[]
  allows_multiple_instances: boolean
  is_optional: boolean
}

export const STAGES: readonly StageDefinition[] = ${JSON.stringify(stages, null, 2)} as const
`
  await writeFile(path.join(OUT_DIR, "stages.ts"), header("stages") + "\n" + body, "utf-8")
  console.log(`wrote src/types/domain/stages.ts (bizstruct-domain@${TAG})`)
}

await mkdir(OUT_DIR, { recursive: true })
for (const [file, out, title] of ARTIFACTS) await syncArtifact(file, out, title)
await syncStages()
