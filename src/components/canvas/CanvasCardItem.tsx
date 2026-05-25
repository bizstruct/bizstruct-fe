"use client"

import React, { useState, useRef, useEffect } from "react"
import { Sparkles, Pencil, Trash2, X, Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { useProjectStore } from "@/store/use-project-store"
import type { CanvasSectionKey } from "@/schemas/canvas.schema"
import type { CanvasCard } from "@/schemas/canvas.schema"
import { canvasStyles } from "./styles"

interface Props {
  card: CanvasCard
  sectionKey: CanvasSectionKey
}

export function CanvasCardItem({ card, sectionKey }: Props) {
  const t = useTranslations("CanvasView")
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(card.text)
  const textareaRef           = useRef<HTMLTextAreaElement>(null)
  const updateCanvasCard      = useProjectStore((s) => s.updateCanvasCard)
  const deleteCanvasCard      = useProjectStore((s) => s.deleteCanvasCard)

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [editing])

  function save() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== card.text) updateCanvasCard(sectionKey, card.id, trimmed)
    setEditing(false)
  }

  function cancel() {
    setDraft(card.text)
    setEditing(false)
  }

  return (
    <div className={canvasStyles.card}>
      {card.isAiGenerated && (
        <span className={canvasStyles.cardAiBadge}>
          <Sparkles className="h-2 w-2" /> {t("aiLabel")}
        </span>
      )}

      {editing ? (
        <div className="flex flex-col gap-1.5">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); save() }
              if (e.key === "Escape") cancel()
            }}
            rows={3}
            className={canvasStyles.cardTextarea}
          />
          <div className={canvasStyles.inlineActions}>
            <button onClick={cancel} className="rounded p-0.5 text-slate-400 hover:text-slate-600">
              <X className="h-3 w-3" />
            </button>
            <button onClick={save} className="rounded p-0.5 text-indigo-500 hover:text-indigo-700">
              <Check className="h-3 w-3" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className={canvasStyles.cardText}>{card.text}</p>
          <div className={canvasStyles.cardActions}>
            <button
              onClick={() => { setDraft(card.text); setEditing(true) }}
              className="rounded p-0.5 text-slate-300 hover:text-indigo-500 transition-colors"
            >
              <Pencil className="h-2.5 w-2.5" />
            </button>
            <button
              onClick={() => deleteCanvasCard(sectionKey, card.id)}
              className="rounded p-0.5 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="h-2.5 w-2.5" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
