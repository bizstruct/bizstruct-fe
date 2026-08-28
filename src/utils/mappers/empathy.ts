import type { EmpathyItem } from "@/schemas/empathy-map.schema"

// EmpathyItem is single-language now (part E of the data-quality-fixes
// brief removed the text_uk/text_en pair — see bizstruct_domain.blocks.
// empathy_map). Generation language is a project-level setting, not a
// per-viewer locale choice, so these helpers no longer take or dispatch
// on `locale` — they just read/write `item.text` directly.

export function addItem(items: EmpathyItem[], text = ""): { items: EmpathyItem[]; newId: number } {
  const newId = items.length ? Math.max(...items.map((q) => q.id)) + 1 : 1
  const newItem: EmpathyItem = { id: newId, text }
  return { items: [...items, newItem], newId }
}

export function updateItem(items: EmpathyItem[], id: number, text: string): EmpathyItem[] {
  return items.map((q) => (q.id === id ? { ...q, text } : q))
}

export function deleteItem(items: EmpathyItem[], id: number): EmpathyItem[] {
  return items.filter((q) => q.id !== id)
}
