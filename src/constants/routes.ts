export const ROUTES = {
  home: "/",
  project: (id: string) => `/project/${id}`,
  empathyMap: (id: string) => `/project/${id}/empathy-map`,
  scenario: (id: string) => `/project/${id}/scenario`,
  whatIf: (id: string) => `/project/${id}/what-if`,
  canvas: (id: string) => `/project/${id}/canvas`,
  architecture: (id: string) => `/project/${id}/architecture`,
  hypotheses: (id: string) => `/project/${id}/hypotheses`,
  pitch: (id: string) => `/project/${id}/pitch`,
  valueProp: (id: string) => `/project/${id}/value-prop`,
} as const
