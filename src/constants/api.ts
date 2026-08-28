const BASE = "/api"

export const API_ROUTES = {
  projects: `${BASE}/projects`,
  project: (projectId: string) => `${BASE}/projects/${projectId}`,
  canvas: (projectId: string) => `${BASE}/canvas/${projectId}`,
  empathyMap: (projectId: string) => `${BASE}/empathy-map/${projectId}`,
  hypotheses: (projectId: string) => `${BASE}/hypotheses/${projectId}`,
  pitch: (projectId: string) => `${BASE}/pitch/${projectId}`,
  scenario: (projectId: string) => `${BASE}/scenario/${projectId}`,
  whatIf: (projectId: string) => `${BASE}/what-if/${projectId}`,
  whatIfAlternative: (projectId: string, alternativeId: string) => `${BASE}/what-if/${projectId}/${alternativeId}`,
  whatIfApply: (projectId: string, alternativeId: string) => `${BASE}/what-if/${projectId}/${alternativeId}/apply`,
  whatIfRevert: (projectId: string, alternativeId: string) => `${BASE}/what-if/${projectId}/${alternativeId}/revert`,
  architecture: (projectId: string) => `${BASE}/architecture/${projectId}`,
  generation: `${BASE}/generation`,
  regenerateModels: (projectId: string) => `${BASE}/generation/${projectId}/regenerate`,
  validateModel: (projectId: string) => `${BASE}/models/${projectId}/validate`,
} as const
