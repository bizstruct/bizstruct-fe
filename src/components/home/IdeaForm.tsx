"use client"

import { useState, useEffect, type FormEvent } from "react"
import { ArrowUp, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { ideaFormStyles as s } from "./styles"

interface Props {
  isLoading: boolean
  onSubmit: (idea: string) => Promise<void>
}

export function IdeaForm({ isLoading, onSubmit }: Props) {
  const t = useTranslations("HomePage")
  const [text, setText]   = useState("")
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    try {
      await onSubmit(text)
      setText("")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.unexpected"))
    }
  }

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <div className={s.inputWrapper}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder={t("input.placeholder")}
          disabled={isLoading}
          className={s.textarea}
        />
        {error && <p className={s.error}>{error}</p>}
        <div className={s.submitRow}>
          <Button
            type="submit"
            size="icon"
            aria-label={t("input.submit")}
            disabled={!mounted || isLoading || text.trim().length < 10}
            className={s.submitBtn}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </form>
  )
}
