#!/usr/bin/env node
// Generates TypeScript for bizstruct-be's PUBLIC DTOs from its OpenAPI document.
//
//   pnpm sync:api                                   regenerate src/types/api.ts from the committed snapshot
//   pnpm sync:api -- --from http://localhost:8000/openapi.json   refresh the snapshot from a running be
//   pnpm sync:api -- --from ../bizstruct-be/openapi.json         ...or from a file
//
// The snapshot (api/openapi.json) is committed, so CI and offline work need no running backend.
// /api/internal/* (worker-only) is removed from the snapshot: the viewer never calls it.
// Types come from components.schemas, compiled with json-schema-to-typescript (already a dev
// dependency); the HTTP layer in src/lib/api is typed with them, so there are no hand-written DTOs.

import { compile } from "json-schema-to-typescript"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const SNAPSHOT = path.join(ROOT, "api", "openapi.json")
const OUT = path.join(ROOT, "src", "types", "api.ts")

const fromIndex = process.argv.indexOf("--from")
const source = fromIndex === -1 ? null : process.argv[fromIndex + 1]

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys)
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((k) => [k, sortKeys(value[k])]))
  return value
}

async function load() {
  if (!source) return JSON.parse(await readFile(SNAPSHOT, "utf-8"))
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source)
    if (!res.ok) throw new Error(`Failed to fetch ${source}: ${res.status}`)
    return res.json()
  }
  return JSON.parse(await readFile(path.resolve(source), "utf-8"))
}

const spec = await load()
spec.paths = Object.fromEntries(Object.entries(spec.paths).filter(([p]) => !p.startsWith("/api/internal")))

if (source) {
  await mkdir(path.dirname(SNAPSHOT), { recursive: true })
  await writeFile(SNAPSHOT, JSON.stringify(sortKeys(spec), null, 2) + "\n", "utf-8")
  console.log(`wrote api/openapi.json (${Object.keys(spec.paths).length} paths)`)
}

const rewriteRefs = (value) => {
  if (Array.isArray(value)) return value.map(rewriteRefs)
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === "$ref" ? v.replace("#/components/schemas/", "#/definitions/") : rewriteRefs(v)]))
  }
  return value
}

const definitions = rewriteRefs(spec.components.schemas)
const root = {
  title: "ApiSchemas",
  type: "object",
  additionalProperties: false,
  properties: Object.fromEntries(Object.keys(definitions).map((name) => [name, { $ref: `#/definitions/${name}` }])),
  definitions,
}
const ts = await compile(root, "ApiSchemas", { bannerComment: "", style: { semi: false }, additionalProperties: false })
const header = `// GENERATED FILE: do not edit. Run: pnpm sync:api
// Source: api/openapi.json (${spec.info?.title ?? "bizstruct-be"} ${spec.info?.version ?? ""})
`
await writeFile(OUT, header + "\n" + ts, "utf-8")
console.log("wrote src/types/api.ts")
