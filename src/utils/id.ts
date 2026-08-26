export function generateId(prefix: string): string {
  if (
    typeof globalThis !== "undefined" &&
    typeof (globalThis as { crypto?: { randomUUID?: () => string } }).crypto?.randomUUID === "function"
  ) {
    return `${prefix}-${(globalThis as { crypto: { randomUUID: () => string } }).crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function generateUniqueId(prefix: string, existingIds: Set<string>): string {
  let id: string
  let attempts = 0
  do {
    id = generateId(prefix)
    attempts++
    if (attempts > 20) break
  } while (existingIds.has(id))
  return id
}
