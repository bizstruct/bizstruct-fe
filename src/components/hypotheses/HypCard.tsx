"use client"

import React, { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Hypothesis } from "@/schemas/hypotheses.schema"
import { HYP_CAT_CFG, hypothesesStyles } from "./styles"

interface Props {
  hypothesis: Hypothesis
  isDragging: boolean
  isEditingThis: boolean
  onEditStart: (id: string) => void
  onEditEnd: () => void
  onTextChange: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export function HypCard({ hypothesis, isDragging, isEditingThis, onEditStart, onEditEnd, onTextChange, onDelete }: Props) {
  const cfg = HYP_CAT_CFG[hypothesis.category]
  const [draft, setDraft] = useState(hypothesis.text)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isEditingThis) setDraft(hypothesis.text)
  }, [hypothesis.text, isEditingThis])

  useEffect(() => {
    if (isEditingThis && textareaRef.current) {
      const el = textareaRef.current
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
      const len = el.value.length
      el.setSelectionRange(len, len)
    }
  }, [isEditingThis])

  function commit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== hypothesis.text) {
      onTextChange(hypothesis.id, trimmed)
    } else {
      setDraft(hypothesis.text)
    }
    onEditEnd()
  }

  return (
    <div className={cn(hypothesesStyles.card, cfg.border, isDragging && "opacity-40 scale-[0.97]", "group")}>
      <div className={hypothesesStyles.cardHeader}>
        <span className={hypothesesStyles.cardId}>{hypothesis.id}</span>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onDelete(hypothesis.id) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-400"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {isEditingThis ? (
        <textarea
          ref={textareaRef}
          value={draft}
          rows={1}
          onChange={(e) => {
            setDraft(e.target.value)
            e.target.style.height = "auto"
            e.target.style.height = `${e.target.scrollHeight}px`
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commit() }
            if (e.key === "Escape") { setDraft(hypothesis.text); onEditEnd() }
          }}
          className="w-full resize-none bg-transparent text-[11.5px] leading-snug text-slate-800 font-medium outline-none border-b border-indigo-300 pb-0.5"
        />
      ) : (
        <p
          className={cn(hypothesesStyles.cardText, "cursor-text")}
          onClick={() => onEditStart(hypothesis.id)}
        >
          {hypothesis.text}
        </p>
      )}

      <div className={hypothesesStyles.cardMeta}>
        <div className={hypothesesStyles.cardDot(cfg.dot)} />
        <span className={hypothesesStyles.cardBadge(cfg.badge)}>{hypothesis.category}</span>
      </div>
    </div>
  )
}
