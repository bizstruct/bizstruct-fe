import type { CanvasSections, CanvasSectionKey, CanvasCard } from "@/schemas/canvas.schema"
import { generateUniqueId } from "@/utils/id"

export function getAllCardIds(sections: CanvasSections): Set<string> {
  return new Set(Object.values(sections).flatMap((arr) => arr.map((c) => c.id)))
}

export function createCard(sections: CanvasSections, section: CanvasSectionKey, text: string, isAiGenerated = false): CanvasCard {
  const existingIds = getAllCardIds(sections)
  const id = generateUniqueId(section, existingIds)
  return { id, text, isAiGenerated }
}

export function moveCard(
  sections: CanvasSections,
  from: { section: CanvasSectionKey; cardId: string },
  to: { section: CanvasSectionKey; index: number },
): CanvasSections {
  if (from.section === to.section) {
    const arr = [...sections[from.section]]
    const idx = arr.findIndex((c) => c.id === from.cardId)
    if (idx === -1) return sections
    const [moved] = arr.splice(idx, 1)
    const insertIndex = Math.max(0, Math.min(to.index, arr.length))
    arr.splice(insertIndex, 0, moved)
    return { ...sections, [from.section]: arr }
  }

  const sourceArr = [...sections[from.section]]
  const idx = sourceArr.findIndex((c) => c.id === from.cardId)
  if (idx === -1) return sections
  const [moved] = sourceArr.splice(idx, 1)
  const targetArr = [...sections[to.section]]
  const insertIndex = Math.max(0, Math.min(to.index, targetArr.length))
  targetArr.splice(insertIndex, 0, moved)
  return { ...sections, [from.section]: sourceArr, [to.section]: targetArr }
}
