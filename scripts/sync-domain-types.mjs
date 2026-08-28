#!/usr/bin/env node
// Pulls JSON Schema / data from bizstruct-domain (at a pinned tag — never
// `main`) and generates TypeScript, committed under src/types/domain/.
//
// Run: npm run sync:domain
//
// The pinned tag comes from package.json's "bizstructDomainVersion" field,
// not a constant in this file — one place to bump when the domain package
// releases a new version.
//
// schemas/architecture.json and schemas/empathy_map.json are actual JSON
// Schemas (from each model's .model_json_schema()) — compiled with
// json-schema-to-typescript into types, plus a runtime const array of
// values per enum (pulled from the same schema's `enum` lists) so UI code
// has something to iterate over: a generated .d.ts can only carry types,
// not values, and the option lists for selectors are exactly the kind of
// "hardcoded old values" this sync exists to keep from drifting.
//
// schemas/chain.json is NOT a JSON Schema — it's the serialized STAGES data
// itself (bizstruct_domain.chain.STAGES dumped to JSON), by design: the
// frontend needs the actual stage list (ids, depends_on, mode, gate...) to
// build navigation, not just a type for it. So this script writes it as a
// .ts module: a Stage interface + StageId/StageMode unions derived from the
// fetched data, plus the literal STAGES array as a typed const.

import { compile } from "json-schema-to-typescript"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const OUT_DIR = path.join(ROOT, "src", "types", "domain")

const pkg = JSON.parse(await readFile(path.join(ROOT, "package.json"), "utf-8"))
const TAG = pkg.bizstructDomainVersion
if (!TAG) {
  throw new Error('package.json is missing "bizstructDomainVersion" — refusing to sync against a floating ref')
}
if (TAG === "main" || TAG === "master") {
  throw new Error(`bizstructDomainVersion must be a pinned tag, not a branch ("${TAG}")`)
}

const REPO_RAW_BASE = `https://raw.githubusercontent.com/bizstruct/bizstruct-domain/${TAG}/schemas`

function header(schemaFile) {
  return `// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: ${REPO_RAW_BASE}/${schemaFile}.json (bizstruct-domain@${TAG})
`
}

async function fetchJson(name) {
  const url = `${REPO_RAW_BASE}/${name}.json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

async function syncBlockSchema(schemaFile, outFile, title) {
  const schema = await fetchJson(schemaFile)
  const ts = await compile(schema, schema.title ?? title, {
    bannerComment: "",
    style: { semi: false },
  })

  // Runtime companion arrays for every enum $def, e.g. EPICENTER_VALUES,
  // PATTERN_VALUES, PATTERN_SUBTYPE_VALUES — for selector options etc.
  const defs = schema.$defs ?? {}
  const enumConsts = Object.entries(defs)
    .filter(([, def]) => Array.isArray(def.enum))
    .map(([name, def]) => {
      const constName = name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase() + "_VALUES"
      const values = def.enum.map((v) => JSON.stringify(v)).join(", ")
      return `export const ${constName} = [${values}] as const`
    })
    .join("\n")

  const outPath = path.join(OUT_DIR, `${outFile}.ts`)
  await writeFile(outPath, header(schemaFile) + "\n" + ts + "\n" + enumConsts + "\n", "utf-8")
  console.log(`wrote src/types/domain/${outFile}.ts (bizstruct-domain@${TAG})`)
}

async function syncChain() {
  const stages = await fetchJson("chain")

  const stageIdUnion = stages.map((s) => JSON.stringify(s.id)).join(" | ")
  const stageModeUnion = [...new Set(stages.map((s) => s.mode))].map((m) => JSON.stringify(m)).join(" | ")

  const body = `export type StageMode = ${stageModeUnion}

export type StageId = ${stageIdUnion}

export interface Stage {
  id: StageId
  title_uk: string
  depends_on: readonly StageId[]
  mode: StageMode
  requires_user_gate: boolean
  source: string
}

export const STAGES: readonly Stage[] = ${JSON.stringify(stages, null, 2)} as const
`
  const outPath = path.join(OUT_DIR, "chain.ts")
  await writeFile(outPath, header("chain") + "\n" + body, "utf-8")
  console.log(`wrote src/types/domain/chain.ts (bizstruct-domain@${TAG})`)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  await syncBlockSchema("architecture", "architecture", "Architecture")
  await syncBlockSchema("empathy_map", "empathy-map", "EmpathyMap")
  await syncBlockSchema("scenario", "scenario", "Scenario")
  await syncBlockSchema("pitch", "pitch", "Pitch")
  await syncBlockSchema("hypotheses", "hypotheses", "Hypotheses")
  await syncBlockSchema("models_options", "models-options", "ModelsOptions")
  await syncBlockSchema("canvas", "canvas", "Canvas")
  await syncBlockSchema("what_if", "what-if", "WhatIf")
  // validate_model is a side-channel task result, not a chain block (see
  // bizstruct-domain's NON_BLOCK_MODELS) — synced the same way regardless,
  // it's still just a JSON Schema.
  await syncBlockSchema("validate_model", "validate-model", "ValidateModelResult")
  await syncChain()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
