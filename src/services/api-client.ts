async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (response.status === 404) {
    return null as T
  }
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`)
  }
  // 204 No Content or empty body — treat as success with no payload
  const contentType = response.headers.get("content-type") ?? ""
  if (response.status === 204 || !contentType.includes("application/json")) {
    return undefined as T
  }
  return response.json() as Promise<T>
}

export function parseOrLog<T>(schema: { parse: (v: unknown) => T }, data: unknown, label: string): T {
  try {
    return schema.parse(data)
  } catch (err) {
    console.error(`[${label}] Zod parse failed. Raw data:`, JSON.stringify(data, null, 2))
    console.error(`[${label}] Error:`, err)
    throw err
  }
}

export const apiGet    = <T>(url: string)              => apiFetch<T>(url)
export const apiPost   = <T>(url: string, body: unknown) => apiFetch<T>(url, { method: "POST",   body: JSON.stringify(body) })
export const apiPut    = <T>(url: string, body: unknown) => apiFetch<T>(url, { method: "PUT",    body: JSON.stringify(body) })
export const apiPatch  = <T>(url: string, body: unknown) => apiFetch<T>(url, { method: "PATCH",  body: JSON.stringify(body) })
export async function apiDelete(url: string): Promise<void> {
  const response = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`)
  }
}
