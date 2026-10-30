// The sidebar lists projects under "Today / Last 7 days / Earlier", newest first.

export type RecencyGroup = "today" | "week" | "earlier"

const DAY_MS = 86_400_000

/** Which group a creation time falls in, by calendar day in the viewer's time zone. */
export function recencyOf(createdAt: string, now: Date): RecencyGroup {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const created = Date.parse(createdAt)
  if (created >= startOfToday) return "today"
  if (created >= startOfToday - 6 * DAY_MS) return "week"
  return "earlier"
}

/** Non-empty groups in display order, each newest first. */
export function groupByRecency<T extends { createdAt: string }>(items: readonly T[], now: Date): { group: RecencyGroup; items: T[] }[] {
  const sorted = [...items].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  return (["today", "week", "earlier"] as const)
    .map((group) => ({ group, items: sorted.filter((i) => recencyOf(i.createdAt, now) === group) }))
    .filter((g) => g.items.length > 0)
}
