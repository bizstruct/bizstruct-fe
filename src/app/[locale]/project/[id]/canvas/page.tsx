"use client"

import React from "react"
import { useParams } from "next/navigation"
import { useProjectStore, type CanvasSectionKey, type CanvasCard as StoreCanvasCard } from "@/store/use-project-store"
import { Button } from "@/components/ui/button"
import { Trash2, Sparkles, Plus } from "lucide-react"

type SectionProps = {
  title: string
  sectionKey: CanvasSectionKey
  icon?: React.ReactNode
}

function Section(props: SectionProps & { drafts: Record<string, string>; setDraft: (id: string, text: string) => void }) {
  const { title, sectionKey, icon, drafts, setDraft } = props
  const sections = useProjectStore((s) => s.canvasSections)
  const add = useProjectStore((s) => s.addCanvasCard)
  const update = useProjectStore((s) => s.updateCanvasCard)
  const del = useProjectStore((s) => s.deleteCanvasCard)
  const move = useProjectStore((s) => s.moveCanvasCard)
  const items = sections[sectionKey]
  const [adding, setAdding] = React.useState(false)
  const [addText, setAddText] = React.useState("")
  const [editingId, setEditingId] = React.useState<string | null>(null)

  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [dropTarget, setDropTarget] = React.useState<null | { id?: string; position: "before" | "after" | "end" }>(null)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const areas = Array.from(el.querySelectorAll('textarea')) as HTMLTextAreaElement[]
    areas.forEach((ta) => {
      ta.style.height = 'auto'
      ta.style.overflow = 'hidden'
      ta.style.height = ta.scrollHeight + 'px'
    })
  }, [items])

  React.useEffect(() => {
    if (!editingId) return
    const el = containerRef.current?.querySelector(`textarea[data-id="${editingId}"]`) as HTMLTextAreaElement | null
    if (el) {
      el.focus()
      el.selectionStart = el.value.length
    }
  }, [editingId])

  function autoResizeTextarea(ta: HTMLTextAreaElement | null) {
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = ta.scrollHeight + 'px'
  }

  function handleDragStart(e: React.DragEvent, cardId: string) {
    e.dataTransfer.setData('application/json', JSON.stringify({ cardId, fromSection: sectionKey }))
    e.dataTransfer.effectAllowed = 'move'
    setDraggingId(cardId)
  }

  function handleDragEnd() {
    setDraggingId(null)
  }

  function handleDropOnCard(e: React.DragEvent, targetCardId: string) {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    try {
      const { cardId, fromSection } = JSON.parse(raw)
      if (!cardId) return
      const targetIndex = items.findIndex((c) => c.id === targetCardId)
      if (targetIndex === -1) return
      // determine insertion index based on current dropTarget position
      const position = dropTarget?.id === targetCardId ? dropTarget.position : "before"
      const insertIndex = position === "after" ? targetIndex + 1 : targetIndex
      move({ section: fromSection, cardId }, { section: sectionKey, index: insertIndex })
    } catch (err) {
      // ignore
    } finally {
      setDraggingId(null)
      setDropTarget(null)
    }
  }

  function handleDropOnSection(e: React.DragEvent) {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    try {
      const { cardId, fromSection } = JSON.parse(raw)
      if (!cardId) return
      move({ section: fromSection, cardId }, { section: sectionKey, index: items.length })
    } catch (err) {
      // ignore
    } finally {
      setDraggingId(null)
    }
  }

  function handleDragOverCard(e: React.DragEvent, cardId: string) {
    e.preventDefault()
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const mid = rect.top + rect.height / 2
    const pos = e.clientY < mid ? "before" : "after"
    setDropTarget({ id: cardId, position: pos })
  }

  function handleDragLeaveCard(e: React.DragEvent, cardId: string) {
    // clear only if leaving the current target element
    setDropTarget((cur) => (cur && cur.id === cardId ? null : cur))
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <div>
          <button
            onClick={() => {
              const id = add(sectionKey, "")
              setDraft(id, "")
              setEditingId(id)
            }}
            aria-label={`Add card to ${title}`}
            className="text-slate-600 p-1"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={containerRef} className="flex flex-col gap-3" onDragOver={(e) => e.preventDefault()} onDrop={handleDropOnSection}>
        {items.map((c) => (
          <div key={c.id} className="flex flex-col gap-2 relative">
            {/* insert line before */}
            {dropTarget?.id === c.id && dropTarget.position === "before" ? (
              <div className="absolute left-3 right-10 top-0 -translate-y-1/2">
                <div className="h-0.5 bg-indigo-600 rounded" />
              </div>
            ) : null}

            <div
              draggable
              onDragStart={(e) => handleDragStart(e, c.id)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDropOnCard(e, c.id)}
              onDragOver={(e) => handleDragOverCard(e, c.id)}
              onDragLeave={(e) => handleDragLeaveCard(e, c.id)}
              className={"group rounded-md pl-3 pr-10 py-3 relative transition-all duration-150 " + (c.isAiGenerated ? "bg-indigo-50 border border-indigo-200" : "bg-white border border-slate-200") + (draggingId === c.id ? " opacity-50" : "") + (dropTarget?.id === c.id ? " ring-2 ring-indigo-100" : "")}
            >
              <button onClick={() => del(sectionKey, c.id)} aria-label="Delete" className="absolute top-2 right-2 text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="text-sm text-slate-900">
                <textarea
                  data-id={c.id}
                  rows={1}
                  value={drafts[c.id] ?? c.text}
                  onChange={(e) => setDraft(c.id, e.target.value)}
                  onInput={(e) => autoResizeTextarea(e.currentTarget)}
                  onBlur={() => {
                    // commit this card immediately on blur
                    const val = drafts[c.id] ?? c.text
                    update(sectionKey, c.id, val)
                    if (editingId === c.id) setEditingId(null)
                  }}
                  ref={(el) => autoResizeTextarea(el)}
                  className="w-full bg-transparent p-0 m-0 text-sm overflow-hidden resize-none"
                />
              </div>
            </div>

            {/* insert line after */}
            {dropTarget?.id === c.id && dropTarget.position === "after" ? (
              <div className="absolute left-3 right-10 bottom-0 translate-y-1/2">
                <div className="h-0.5 bg-indigo-600 rounded" />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      
    </>
  )
}

export default function CanvasPage(): JSX.Element {
  const params = useParams() as { id?: string; locale?: string }
  const projectId = params?.id ?? "[id]"
  const sections = useProjectStore((s) => s.canvasSections)
  const update = useProjectStore((s) => s.updateCanvasCard)

  const [drafts, setDrafts] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    // initialize drafts for any card not yet in drafts
    setDrafts((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(sections) as CanvasSectionKey[]) {
        sections[key].forEach((c) => {
          if (next[c.id] === undefined) next[c.id] = c.text
        })
      }
      return next
    })
  }, [sections])

  function setDraft(id: string, text: string) {
    setDrafts((d) => ({ ...d, [id]: text }))
  }

  function saveCanvas() {
    for (const key of Object.keys(sections) as CanvasSectionKey[]) {
      sections[key].forEach((c) => {
        const draft = drafts[c.id]
        if (typeof draft === "string" && draft !== c.text) {
          update(key, c.id, draft)
        }
      })
    }
  }

  return (
    <div className="min-h-full bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">Business Model Canvas</h1>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">Project {projectId.slice(-6)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">Export PDF</Button>
            <Button onClick={saveCanvas} className="bg-indigo-600 text-white">Save Canvas</Button>
          </div>
        </header>

        <section className="grid grid-cols-10 grid-rows-[minmax(180px,1fr)_minmax(180px,1fr)_minmax(150px,auto)] gap-[1px] bg-slate-300 border border-slate-300 rounded-xl overflow-hidden w-full min-h-[700px]">
          <div className="col-span-2 row-span-2 col-start-1 row-start-1 bg-white p-4 flex flex-col relative"><Section drafts={drafts} setDraft={setDraft} title="Key Partners" sectionKey="keyPartners" icon={<div className="h-5 w-5" />} /></div>
          <div className="col-span-2 row-span-1 col-start-3 row-start-1 bg-white p-4 flex flex-col relative"><Section drafts={drafts} setDraft={setDraft} title="Key Activities" sectionKey="keyActivities" icon={<div className="h-5 w-5" />} /></div>
          <div className="col-span-2 row-span-1 col-start-3 row-start-2 bg-white p-4 flex flex-col relative"><Section drafts={drafts} setDraft={setDraft} title="Key Resources" sectionKey="keyResources" icon={<div className="h-5 w-5" />} /></div>
          <div className="col-span-2 row-span-2 col-start-5 row-start-1 bg-slate-50/50 p-4 flex flex-col relative"><Section drafts={drafts} setDraft={setDraft} title="Value Propositions" sectionKey="valuePropositions" icon={<div className="h-5 w-5" />} /></div>
          <div className="col-span-2 row-span-1 col-start-7 row-start-1 bg-white p-4 flex flex-col relative"><Section drafts={drafts} setDraft={setDraft} title="Customer Relationships" sectionKey="customerRelationships" icon={<div className="h-5 w-5" />} /></div>

          <div className="col-span-2 row-span-1 col-start-7 row-start-2 bg-white p-4 flex flex-col relative"><Section drafts={drafts} setDraft={setDraft} title="Channels" sectionKey="channels" icon={<div className="h-5 w-5" />} /></div>
          <div className="col-span-2 row-span-2 col-start-9 row-start-1 bg-white p-4 flex flex-col relative"><Section drafts={drafts} setDraft={setDraft} title="Customer Segments" sectionKey="customerSegments" icon={<div className="h-5 w-5" />} /></div>
          <div className="col-span-5 row-span-1 col-start-1 row-start-3 bg-white p-4 flex flex-col relative"><Section drafts={drafts} setDraft={setDraft} title="Cost Structure" sectionKey="costStructure" icon={<div className="h-5 w-5" />} /></div>
          <div className="col-span-5 row-span-1 col-start-6 row-start-3 bg-white p-4 flex flex-col relative"><Section drafts={drafts} setDraft={setDraft} title="Revenue Streams" sectionKey="revenueStreams" icon={<div className="h-5 w-5" />} /></div>
        </section>
      </div>
    </div>
  )
}
