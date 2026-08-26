import type { EmpathyItem } from "@/schemas/empathy-map.schema"

export type RationaleLocale = "uk" | "en"

export function toRationaleLocale(locale: string): RationaleLocale {
  return locale === "uk" ? "uk" : "en"
}

/** The field on EmpathyItem that carries the given locale's text. */
export function textField(locale: string): "text_uk" | "text_en" {
  return `text_${toRationaleLocale(locale)}`
}

export function getItemText(item: EmpathyItem, locale: string): string {
  return item[textField(locale)]
}

export function addItem(items: EmpathyItem[], locale: string, text = ""): { items: EmpathyItem[]; newId: number } {
  const newId = items.length ? Math.max(...items.map((q) => q.id)) + 1 : 1
  const newItem: EmpathyItem = { id: newId, text_uk: "", text_en: "" }
  newItem[textField(locale)] = text
  return { items: [...items, newItem], newId }
}

export function updateItem(items: EmpathyItem[], locale: string, id: number, text: string): EmpathyItem[] {
  const field = textField(locale)
  return items.map((q) => (q.id === id ? { ...q, [field]: text } : q))
}

export function deleteItem(items: EmpathyItem[], id: number): EmpathyItem[] {
  return items.filter((q) => q.id !== id)
}
