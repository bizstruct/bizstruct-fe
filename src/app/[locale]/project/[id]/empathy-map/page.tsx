"use client"

import React from "react"
import { MessageSquare, School, Activity, Heart, AlertCircle, CheckCircle2, Trash2, Plus, GripVertical } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { useProjectStore } from "@/store/use-project-store"

type Quote = { id: number; text: string }

export default function EmpathyMapPage(): JSX.Element {
  const params = useParams() as { id?: string }
  const router = useRouter()
  const projectId = params?.id ?? "[id]"
  const initialSays: Quote[] = [
    { id: 1, text: "Нам потрібно автоматизувати ESG-звітність, щоб відповідати вимогам стейкхолдерів." },
    { id: 2, text: "Поточні процеси збору даних занадто повільні." },
  ]

  const initialThinks: Quote[] = [
    { id: 1, text: "Я хвилююся за точність даних перед наступним аудитом." },
    { id: 2, text: "Чи зможе новий інструмент безшовно інтегруватися з нашою SAP/Oracle ERP?" },
  ]

  const initialDoes: Quote[] = [
    { id: 1, text: "Щомісяця вручну збирає Excel-таблиці з різних департаментів." },
    { id: 2, text: "Презентує екологічні метрики раді директорів через статичні слайди." },
  ]

  const initialFeels: Quote[] = [
    { id: 1, text: "Розгубленість через постійні зміни в глобальних екологічних регуляціях." },
    { id: 2, text: "Фрустрація через внутрішню закритість (silos) департаментів, що заважає збору даних." },
  ]

  const [says, setSays] = React.useState<Quote[]>(initialSays)
  const [thinks, setThinks] = React.useState<Quote[]>(initialThinks)
  const [does, setDoes] = React.useState<Quote[]>(initialDoes)
  const [feels, setFeels] = React.useState<Quote[]>(initialFeels)

  const [editing, setEditing] = React.useState<{ category: string; id: number } | null>(null)
  const [isDirty, setIsDirty] = React.useState<boolean>(false)
  const dragItem = React.useRef<{ category: string; index: number } | null>(null)

  const history = useProjectStore((s) => s.history)
  const setStoreState = useProjectStore.setState

  const defaultPains: string[] = [
    "Ризик людського фактору — помилки введення та ручна агрегація даних.",
    "Відсутність real-time CO2 трекінгу для прийняття швидких рішень.",
    "Обмежений бюджет на аналітику і інженерні інтеграції.",
  ]

  const defaultGains: string[] = [
    "Автоматизація звітів — швидка генерація стандартизованих документів.",
    "Доведення ROI для ради директорів через фінансові сценарії.",
    "Безшовна API інтеграція для зручної синхронізації даних.",
  ]

  const projectHistoryItem = history.find((h) => h.id === projectId)

  const pains: Quote[] = (projectHistoryItem?.empathy?.pains ?? defaultPains).map((text, i) => ({ id: i + 1, text }))
  const gains: Quote[] = (projectHistoryItem?.empathy?.gains ?? defaultGains).map((text, i) => ({ id: i + 1, text }))

  const [painsState, setPainsState] = React.useState<Quote[]>(pains)
  const [gainsState, setGainsState] = React.useState<Quote[]>(gains)

  React.useEffect(() => {
    setPainsState(pains)
    setGainsState(gains)
  }, [projectHistoryItem?.id])

  function updateItem(category: string, id: number, value: string) {
    const updater = (items: Quote[], setItems: (v: Quote[]) => void) => {
      setItems(items.map((it) => (it.id === id ? { ...it, text: value } : it)))
    }

    if (category === "says") updater(says, setSays)
    if (category === "thinks") updater(thinks, setThinks)
    if (category === "does") updater(does, setDoes)
    if (category === "feels") updater(feels, setFeels)
    if (category === "pains") updater(painsState, setPainsState)
    if (category === "gains") updater(gainsState, setGainsState)
    setIsDirty(true)
  }

  function deleteItem(category: string, id: number) {
    if (category === "says") setSays(says.filter((it) => it.id !== id))
    if (category === "thinks") setThinks(thinks.filter((it) => it.id !== id))
    if (category === "does") setDoes(does.filter((it) => it.id !== id))
    if (category === "feels") setFeels(feels.filter((it) => it.id !== id))
    if (category === "pains") setPainsState(painsState.filter((it) => it.id !== id))
    if (category === "gains") setGainsState(gainsState.filter((it) => it.id !== id))
  }

  function addItem(category: string) {
    if (category === "says") {
      const nextId = says.length ? Math.max(...says.map((s) => s.id)) + 1 : 1
      setSays([...says, { id: nextId, text: "Новий пункт" }])
    }
    if (category === "thinks") {
      const nextId = thinks.length ? Math.max(...thinks.map((s) => s.id)) + 1 : 1
      setThinks([...thinks, { id: nextId, text: "Новий пункт" }])
    }
    if (category === "does") {
      const nextId = does.length ? Math.max(...does.map((s) => s.id)) + 1 : 1
      setDoes([...does, { id: nextId, text: "Новий пункт" }])
    }
    if (category === "feels") {
      const nextId = feels.length ? Math.max(...feels.map((s) => s.id)) + 1 : 1
      setFeels([...feels, { id: nextId, text: "Новий пункт" }])
    }
    if (category === "pains") {
      const nextId = painsState.length ? Math.max(...painsState.map((s) => s.id)) + 1 : 1
      setPainsState([...painsState, { id: nextId, text: "Новий пункт" }])
    }
    if (category === "gains") {
      const nextId = gainsState.length ? Math.max(...gainsState.map((s) => s.id)) + 1 : 1
      setGainsState([...gainsState, { id: nextId, text: "Новий пункт" }])
    }

    setIsDirty(true)
    // set editing to newly created item so it opens for editing
    const nextId = (() => {
      if (category === "says") return says.length ? Math.max(...says.map((s) => s.id)) + 1 : 1
      if (category === "thinks") return thinks.length ? Math.max(...thinks.map((s) => s.id)) + 1 : 1
      if (category === "does") return does.length ? Math.max(...does.map((s) => s.id)) + 1 : 1
      if (category === "feels") return feels.length ? Math.max(...feels.map((s) => s.id)) + 1 : 1
      if (category === "pains") return painsState.length ? Math.max(...painsState.map((s) => s.id)) + 1 : 1
      if (category === "gains") return gainsState.length ? Math.max(...gainsState.map((s) => s.id)) + 1 : 1
      return 1
    })()

    setEditing({ category, id: nextId })
  }

  React.useEffect(() => {
    if (!editing) return
    const selector = `textarea[data-edit="${editing.category}-${editing.id}"]`
    const el = document.querySelector(selector) as HTMLTextAreaElement | null
    if (el) {
      el.focus()
      el.selectionStart = el.value.length
    }
  }, [editing])

  function handleDragStart(category: string, index: number, e: React.DragEvent<HTMLLIElement>) {
    dragItem.current = { category, index }
    try {
      e.dataTransfer?.setData('text/plain', `${category}:${index}`)

      // show the whole list item as drag image (not the handle button)
      const btn = e.currentTarget as HTMLElement
      const li = btn.closest('li') as HTMLElement | null
      if (li && e.dataTransfer) {
        const clone = li.cloneNode(true) as HTMLElement
        clone.style.position = 'absolute'
        clone.style.top = '-9999px'
        clone.style.left = '-9999px'
        clone.style.width = `${li.offsetWidth}px`
        document.body.appendChild(clone)
        const rect = li.getBoundingClientRect()
        const offsetX = Math.floor(rect.width / 2)
        const offsetY = Math.floor(rect.height / 2)
        e.dataTransfer.setDragImage(clone, offsetX, offsetY)
        // remove clone shortly after setting drag image
        setTimeout(() => {
          try { document.body.removeChild(clone) } catch {}
        }, 0)
      }
    } catch {}
  }

  function handleDragOverTarget(category: string, index: number, e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault()
    const src = dragItem.current
    if (!src) return
    if (src.category !== category) return
    if (src.index === index) return

    const reorder = <T extends Quote>(items: T[], setItems: (v: T[]) => void) => {
      const next = Array.from(items)
      const [moved] = next.splice(src.index, 1)
      next.splice(index, 0, moved)
      setItems(next)
      setIsDirty(true)
      // update current index so subsequent dragOver uses new index
      dragItem.current = { category, index }
    }

    if (category === 'says') reorder(says, setSays)
    if (category === 'thinks') reorder(thinks, setThinks)
    if (category === 'does') reorder(does, setDoes)
    if (category === 'feels') reorder(feels, setFeels)
    if (category === 'pains') reorder(painsState, setPainsState)
    if (category === 'gains') reorder(gainsState, setGainsState)
  }

  function handleDrop(category: string, index: number, e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault()
    // finalise drag by clearing the dragItem; live reordering already handled in dragOver
    dragItem.current = null
  }

  function savePainsAndGainsToHistory() {
    const newHistory = history.map((h) => {
      if (h.id !== projectId) return h
      return {
        ...h,
        empathy: {
          ...(h.empathy ?? {}),
          pains: painsState.map((p) => p.text),
          gains: gainsState.map((g) => g.text),
        },
      }
    })

    // if project not in history, add it
    const exists = history.some((h) => h.id === projectId)
    const finalHistory = exists
      ? newHistory
      : [
          {
            id: projectId,
            title: `Проєкт: ${projectId}`,
            empathy: { pains: painsState.map((p) => p.text), gains: gainsState.map((g) => g.text) },
          },
          ...history,
        ]

    setStoreState({ history: finalHistory })
    // user feedback
    // eslint-disable-next-line no-alert
    alert("Болі та вигоди збережено")
    setIsDirty(false)
  }

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-geist text-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">Проєкти &gt; {projectId} &gt; <span className="text-slate-900">Карта емпатії</span></div>
          <h1 className="mt-3 text-3xl font-semibold">Карта емпатії користувача</h1>
          <p className="mt-2 text-sm text-slate-500">Цільова аудиторія: Середній бізнес, екологічні ініціативи | Роль: Corporate Env Manager</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => { /* TODO: regen */ }} className="text-sm">Перегенерувати</Button>
          <Button onClick={savePainsAndGainsToHistory} variant="secondary" className="text-sm">Зберегти</Button>
          <Button
            onClick={() => {
              if (isDirty) {
                // eslint-disable-next-line no-alert
                const ok = confirm("Є незбережені зміни. Вийти без збереження?")
                if (!ok) return
              }
              router.push(`/project/${projectId}/value-prop`)
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
          >
            Продовжити
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Що говорить (Says)</h3>
              <Button variant="ghost" size="sm" onClick={() => addItem("says")} aria-label="Додати пункт">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-4 space-y-3">
              {says.map((q, idx) => (
                <li
                  key={q.id}
                  className="rounded-md bg-slate-50 px-3 py-2"
                  onDragOver={(e) => handleDragOverTarget('says', idx, e)}
                  onDrop={(e) => handleDrop('says', idx, e)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        draggable
                        onDragStart={(e) => handleDragStart('says', idx, e)}
                        aria-label="Перетягнути"
                      >
                        <GripVertical className="h-4 w-4" />
                      </Button>

                      {editing?.category === "says" && editing.id === q.id ? (
                        <textarea
                          data-edit={`says-${q.id}`}
                          className="w-full text-sm text-slate-900 bg-transparent resize-none"
                          value={q.text}
                          onChange={(e) => updateItem("says", q.id, e.target.value)}
                          onBlur={() => setEditing(null)}
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm text-slate-900 cursor-text" onClick={() => setEditing({ category: "says", id: q.id })}>{q.text}</p>
                      )}
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => deleteItem("says", q.id)} aria-label="Видалити">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <School className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Що думає (Thinks)</h3>
              <Button variant="ghost" size="sm" onClick={() => addItem("thinks")} aria-label="Додати пункт">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-4 space-y-3">
              {thinks.map((q, idx) => (
                <li key={q.id} className="rounded-md bg-slate-50 px-3 py-2" onDragOver={(e) => handleDragOverTarget('thinks', idx, e)} onDrop={(e) => handleDrop('thinks', idx, e)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 w-full">
                      <Button variant="ghost" size="sm" draggable onDragStart={(e) => handleDragStart('thinks', idx, e)} aria-label="Перетягнути">
                        <GripVertical className="h-4 w-4" />
                      </Button>

                      {editing?.category === "thinks" && editing.id === q.id ? (
                        <textarea
                          data-edit={`thinks-${q.id}`}
                          className="w-full text-sm text-slate-900 bg-transparent resize-none"
                          value={q.text}
                          onChange={(e) => updateItem("thinks", q.id, e.target.value)}
                          onBlur={() => setEditing(null)}
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm text-slate-900 cursor-text" onClick={() => setEditing({ category: "thinks", id: q.id })}>{q.text}</p>
                      )}
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => deleteItem("thinks", q.id)} aria-label="Видалити">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Що робить (Does)</h3>
              <Button variant="ghost" size="sm" onClick={() => addItem("does")} aria-label="Додати пункт">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-4 space-y-3">
              {does.map((q, idx) => (
                <li key={q.id} className="rounded-md bg-slate-50 px-3 py-2" onDragOver={(e) => handleDragOverTarget('does', idx, e)} onDrop={(e) => handleDrop('does', idx, e)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 w-full">
                      <Button variant="ghost" size="sm" draggable onDragStart={(e) => handleDragStart('does', idx, e)} aria-label="Перетягнути">
                        <GripVertical className="h-4 w-4" />
                      </Button>

                      {editing?.category === "does" && editing.id === q.id ? (
                        <textarea
                          data-edit={`does-${q.id}`}
                          className="w-full text-sm text-slate-900 bg-transparent resize-none"
                          value={q.text}
                          onChange={(e) => updateItem("does", q.id, e.target.value)}
                          onBlur={() => setEditing(null)}
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm text-slate-900 cursor-text" onClick={() => setEditing({ category: "does", id: q.id })}>{q.text}</p>
                      )}
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => deleteItem("does", q.id)} aria-label="Видалити">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Що відчуває (Feels)</h3>
              <Button variant="ghost" size="sm" onClick={() => addItem("feels")} aria-label="Додати пункт">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-4 space-y-3">
              {feels.map((q, idx) => (
                <li key={q.id} className="rounded-md bg-slate-50 px-3 py-2" onDragOver={(e) => handleDragOverTarget('feels', idx, e)} onDrop={(e) => handleDrop('feels', idx, e)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 w-full">
                      <Button variant="ghost" size="sm" draggable onDragStart={(e) => handleDragStart('feels', idx, e)} aria-label="Перетягнути">
                        <GripVertical className="h-4 w-4" />
                      </Button>

                      {editing?.category === "feels" && editing.id === q.id ? (
                        <textarea
                          data-edit={`feels-${q.id}`}
                          className="w-full text-sm text-slate-900 bg-transparent resize-none"
                          value={q.text}
                          onChange={(e) => updateItem("feels", q.id, e.target.value)}
                          onBlur={() => setEditing(null)}
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm text-slate-900 cursor-text" onClick={() => setEditing({ category: "feels", id: q.id })}>{q.text}</p>
                      )}
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => deleteItem("feels", q.id)} aria-label="Видалити">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Summary: Pains & Gains */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Болі</h3>
              <Button variant="ghost" size="sm" onClick={() => addItem("pains")} aria-label="Додати пункт">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-4 space-y-3">
              {painsState.map((p, idx) => (
                <li key={p.id} className="rounded-md bg-slate-50 px-3 py-2" onDragOver={(e) => handleDragOverTarget('pains', idx, e)} onDrop={(e) => handleDrop('pains', idx, e)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 w-full">
                      <Button variant="ghost" size="sm" draggable onDragStart={(e) => handleDragStart('pains', idx, e)} aria-label="Перетягнути">
                        <GripVertical className="h-4 w-4" />
                      </Button>

                      {editing?.category === "pains" && editing.id === p.id ? (
                        <textarea
                          data-edit={`pains-${p.id}`}
                          className="w-full text-sm text-slate-900 bg-transparent resize-none"
                          value={p.text}
                          onChange={(e) => updateItem("pains", p.id, e.target.value)}
                          onBlur={() => setEditing(null)}
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm text-slate-900 cursor-text" onClick={() => setEditing({ category: "pains", id: p.id })}>{p.text}</p>
                      )}
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => deleteItem("pains", p.id)} aria-label="Видалити">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-none">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-900">Вигоди</h3>
              <Button variant="ghost" size="sm" onClick={() => addItem("gains")} aria-label="Додати пункт">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-4 space-y-3">
              {gainsState.map((g, idx) => (
                <li key={g.id} className="rounded-md bg-slate-50 px-3 py-2" onDragOver={(e) => handleDragOverTarget('gains', idx, e)} onDrop={(e) => handleDrop('gains', idx, e)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 w-full">
                      <Button variant="ghost" size="sm" draggable onDragStart={(e) => handleDragStart('gains', idx, e)} aria-label="Перетягнути">
                        <GripVertical className="h-4 w-4" />
                      </Button>

                      {editing?.category === "gains" && editing.id === g.id ? (
                        <textarea
                          data-edit={`gains-${g.id}`}
                          className="w-full text-sm text-slate-900 bg-transparent resize-none"
                          value={g.text}
                          onChange={(e) => updateItem("gains", g.id, e.target.value)}
                          onBlur={() => setEditing(null)}
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm text-slate-900 cursor-text" onClick={() => setEditing({ category: "gains", id: g.id })}>{g.text}</p>
                      )}
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => deleteItem("gains", g.id)} aria-label="Видалити">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
