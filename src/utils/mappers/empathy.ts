import type { EmpathyItem } from "@/schemas/empathy-map.schema"

export function textsToItems(texts: string[]): EmpathyItem[] {
  return texts.map((text, i) => ({ id: i + 1, text }))
}

export function itemsToTexts(items: EmpathyItem[]): string[] {
  return items.map((item) => item.text)
}

export function addItem(items: EmpathyItem[], text = ""): { items: EmpathyItem[]; newId: number } {
  const newId = items.length ? Math.max(...items.map((q) => q.id)) + 1 : 1
  return { items: [...items, { id: newId, text }], newId }
}

export function updateItem(items: EmpathyItem[], id: number, text: string): EmpathyItem[] {
  return items.map((q) => (q.id === id ? { ...q, text } : q))
}

export function deleteItem(items: EmpathyItem[], id: number): EmpathyItem[] {
  return items.filter((q) => q.id !== id)
}
