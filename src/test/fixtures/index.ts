// Every *.json in this folder is a real GET /api/projects/{id} dump (see README.md here).
// Dropping a new dump in is all it takes for the shape tests to cover it: no code changes.

import type { Project } from "@/lib/api/projects"

// vitest (vite) provides import.meta.glob; vite is not a direct dependency, so declare the one call used.
declare global {
  interface ImportMeta {
    glob<T>(pattern: string, options: { eager: true; import: "default" }): Record<string, T>
  }
}

const modules = import.meta.glob<unknown>("./*.json", { eager: true, import: "default" })

export interface Fixture {
  name: string
  project: Project
}

export const FIXTURES: Fixture[] = Object.entries(modules)
  .map(([file, project]) => ({ name: file.replace(/^\.\//, "").replace(/\.json$/, ""), project: project as Project }))
  .sort((a, b) => a.name.localeCompare(b.name))

export function fixture(name: string): Project {
  const found = FIXTURES.find((f) => f.name === name)
  if (!found) throw new Error(`no fixture named ${name}`)
  return found.project
}

export const FARM = "farm-1-segment"
export const MUSIC = "music-3-segments"
