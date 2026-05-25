async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

export const apiGet  = <T>(url: string)                          => apiFetch<T>(url)
export const apiPost = <T>(url: string, body: unknown)           => apiFetch<T>(url, { method: "POST",  body: JSON.stringify(body) })
export const apiPut  = <T>(url: string, body: unknown)           => apiFetch<T>(url, { method: "PUT",   body: JSON.stringify(body) })
