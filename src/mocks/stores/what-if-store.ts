// Shared in-memory store for What-If mock routes.
// globalThis keeps it alive across hot-reloads in the dev server.

type ScenarioOverride = {
  status?: string | null
  title?: string
  description?: string
}

const g = globalThis as typeof globalThis & {
  __whatIfStore?: Map<string, ScenarioOverride>
}

if (!g.__whatIfStore) g.__whatIfStore = new Map()

export const whatIfStore = g.__whatIfStore
