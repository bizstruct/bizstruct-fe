"use client"

import React, { useState, useEffect } from "react"
import { RefreshCw, Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useProjectStore } from "@/store/use-project-store"
import type { EmpathyCategory, EmpathyData, EmpathyItem } from "@/schemas/empathy-map.schema"
import { addItem, updateItem, deleteItem } from "@/utils/mappers/empathy"
import { empathyStyles } from "./styles"
import { EmpathyCardList } from "./EmpathyCardList"

const TOP_CATEGORIES: EmpathyCategory[] = ["says", "thinks", "does", "feels"]
const BOTTOM_CATEGORIES: EmpathyCategory[] = ["pains", "gains"]

interface Props {
  projectId: string
  projectName: string
  initialData: EmpathyData
}

export function EmpathyView({ projectId, projectName, initialData }: Props) {
  const t            = useTranslations("EmpathyView")
  const history      = useProjectStore((s) => s.history)
  const setStoreState = useProjectStore.setState

  const projectHistoryItem = history.find((h) => h.id === projectId)

  const [state, setState] = useState<Record<EmpathyCategory, EmpathyItem[]>>(() => ({
    ...initialData,
    pains: projectHistoryItem?.empathy?.pains
      ? projectHistoryItem.empathy.pains.map((text, i) => ({ id: i + 1, text }))
      : initialData.pains,
    gains: projectHistoryItem?.empathy?.gains
      ? projectHistoryItem.empathy.gains.map((text, i) => ({ id: i + 1, text }))
      : initialData.gains,
  }))

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (projectHistoryItem?.empathy) {
      setState((prev) => ({
        ...prev,
        pains: projectHistoryItem.empathy!.pains.map((text, i) => ({ id: i + 1, text })),
        gains: projectHistoryItem.empathy!.gains.map((text, i) => ({ id: i + 1, text })),
      }))
    }
  }, [projectHistoryItem?.id])

  function update(cat: EmpathyCategory, id: number, text: string) {
    setState((prev) => ({ ...prev, [cat]: updateItem(prev[cat], id, text) }))
  }

  function del(cat: EmpathyCategory, id: number) {
    setState((prev) => ({ ...prev, [cat]: deleteItem(prev[cat], id) }))
  }

  function add(cat: EmpathyCategory) {
    setState((prev) => ({ ...prev, [cat]: addItem(prev[cat], t("newItem")) }))
  }

  function save() {
    const empathy = {
      pains: state.pains.map((p) => p.text),
      gains: state.gains.map((g) => g.text),
    }
    const exists = history.some((h) => h.id === projectId)
    const newHistory = exists
      ? history.map((h) => (h.id === projectId ? { ...h, empathy } : h))
      : [{ id: projectId, title: projectName, empathy }, ...history]
    setStoreState({ history: newHistory })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={empathyStyles.root}>
      <div className={empathyStyles.header}>
        <div>
          <span className={empathyStyles.headerTitle}>{t("title")}</span>
          <p className={empathyStyles.headerSubtitle}>{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs border-slate-200">
            <RefreshCw className="h-3 w-3" /> {t("regenerate")}
          </Button>
          <Button
            size="sm"
            onClick={save}
            className={cn(saved ? empathyStyles.saveBtnSaved : empathyStyles.saveBtnDefault)}
          >
            <Check className="h-3 w-3" /> {saved ? t("saved") : t("save")}
          </Button>
        </div>
      </div>

      <div className={empathyStyles.body}>
        <div className={empathyStyles.topGrid}>
          {TOP_CATEGORIES.map((cat) => (
            <EmpathyCardList
              key={cat}
              category={cat}
              items={state[cat]}
              onUpdate={(id, text) => update(cat, id, text)}
              onDelete={(id) => del(cat, id)}
              onAdd={() => add(cat)}
            />
          ))}
        </div>
        <div className={empathyStyles.bottomGrid}>
          {BOTTOM_CATEGORIES.map((cat) => (
            <EmpathyCardList
              key={cat}
              category={cat}
              items={state[cat]}
              onUpdate={(id, text) => update(cat, id, text)}
              onDelete={(id) => del(cat, id)}
              onAdd={() => add(cat)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
