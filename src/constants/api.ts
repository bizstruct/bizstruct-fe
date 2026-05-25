const BASE = "/api"

export const API_ROUTES = {
  projects: `${BASE}/projects`,
  projectsHistory: `${BASE}/projects/history`,
  canvas: (projectId: string) => `${BASE}/canvas/${projectId}`,
  empathyMap: (projectId: string) => `${BASE}/empathy-map/${projectId}`,
  hypotheses: (projectId: string) => `${BASE}/hypotheses/${projectId}`,
  pitch: (projectId: string) => `${BASE}/pitch/${projectId}`,
  scenario: (projectId: string) => `${BASE}/scenario/${projectId}`,
  whatIf: (projectId: string) => `${BASE}/what-if/${projectId}`,
  architecture: (projectId: string) => `${BASE}/architecture/${projectId}`,
  generation: `${BASE}/generation`,
} as const
