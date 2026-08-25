"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, RefreshCw, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { modelSelectionStyles as s } from "./styles"
import { useProjectStore } from "@/store/use-project-store"
import { triggerValidateModel } from "@/app/actions"
import { waitForValidateResult } from "@/services/pubsub"
import type { ValidationResult } from "@/services/pubsub"
import type { CarouselApi } from "@/components/ui/carousel"
import type { GeneratedProject, GeneratedBusinessModel } from "@/schemas/project.schema"

interface Props {
  generatedProject: GeneratedProject
  onSelectModel: (modelId: string) => void
}

type EditableField = keyof Pick<GeneratedBusinessModel, "title" | "audience" | "valueProposition" | "description">
type ValidationState = ValidationResult | "loading" | "error"

interface EditState {
  modelId: string
  field: EditableField
  value: string
}

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  audience: "Target Audience",
  value_proposition: "Value Proposition",
  description: "Description",
}

function StatusIcon({ status }: { status: "ok" | "weak" | "invalid" }) {
  if (status === "ok")      return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
  if (status === "weak")    return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
  return                           <XCircle className="h-4 w-4 text-red-500 shrink-0" />
}

function ScoreRing({ score }: { score: number }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const fill = ((100 - score) / 100) * circ
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"

  return (
    <div className="relative flex items-center justify-center">
      <svg width="56" height="56" className="-rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={fill}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="absolute text-sm font-bold text-slate-800">{score}</span>
    </div>
  )
}

function ValidationPanel({ result }: { result: ValidationState }) {
  if (result === "loading") {
    return (
      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-4 w-4 animate-spin text-violet-500" />
          <span className="text-sm text-slate-500">Validating with AI…</span>
        </div>
      </div>
    )
  }

  if (result === "error") {
    return (
      <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        Failed to validate. Check LLM configuration.
      </div>
    )
  }

  const { status, score, summary, fields } = result

  const statusMeta = {
    valid:          { label: "Valid",          bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
    needs_revision: { label: "Needs revision", bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   dot: "bg-amber-500"   },
    invalid:        { label: "Invalid",        bg: "bg-red-50",     border: "border-red-200",     text: "text-red-700",     dot: "bg-red-500"     },
  }[status]

  return (
    <div className={`mt-4 rounded-2xl border ${statusMeta.border} ${statusMeta.bg} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
          <span className={`text-sm font-semibold ${statusMeta.text}`}>{statusMeta.label}</span>
        </div>
        <ScoreRing score={score} />
      </div>

      {/* Summary */}
      <div className="border-t border-slate-100 bg-white/60 px-5 py-3">
        <p className="text-sm leading-relaxed text-slate-600">{summary}</p>
      </div>

      {/* Fields */}
      <div className="divide-y divide-slate-100 border-t border-slate-100">
        {fields.map((f) => (
          <div key={f.field} className="bg-white/40 px-5 py-3">
            <div className="flex items-start gap-3">
              <StatusIcon status={f.status} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {FIELD_LABELS[f.field] ?? f.field}
                </p>
                <p className="mt-0.5 text-sm text-slate-700">{f.comment}</p>
                {f.suggestion && (
                  <div className="mt-1.5 flex items-start gap-1.5">
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 text-violet-400 shrink-0" />
                    <p className="text-xs text-violet-700">{f.suggestion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ModelSelectionScreen({ generatedProject, onSelectModel }: Props) {
  const tModel = useTranslations("ModelSelection")
  const updateGeneratedModel = useProjectStore((s) => s.updateGeneratedModel)
  const regenerateModels     = useProjectStore((s) => s.regenerateModels)
  const storeProject         = useProjectStore((s) => s.generatedProject)

  const [carouselApi, setCarouselApi]           = useState<CarouselApi | null>(null)
  const [activeModelIndex, setActiveModelIndex] = useState(0)
  const [editState, setEditState]               = useState<EditState | null>(null)
  const [isRegenerating, setIsRegenerating]     = useState(false)
  const [savedKeys, setSavedKeys]               = useState<Set<string>>(new Set())
  const [modifiedKeys, setModifiedKeys]         = useState<Set<string>>(new Set())
  const [validations, setValidations]           = useState<Record<string, ValidationState>>({})

  useEffect(() => {
    if (!carouselApi) return
    const update = () => setActiveModelIndex(carouselApi.selectedScrollSnap())
    update()
    carouselApi.on("select", update)
    carouselApi.on("reInit", update)
    return () => { carouselApi.off("select", update); carouselApi.off("reInit", update) }
  }, [carouselApi])

  function startEdit(modelId: string, field: EditableField, currentValue: string) {
    setEditState({ modelId, field, value: currentValue })
  }

  async function commitEdit() {
    if (!editState) return
    const { modelId, field, value } = editState
    const key = `${modelId}:${field}`
    setEditState(null)
    const model = generatedProject.models.find((m) => m.id === modelId)
    if (!model || model[field] === value) return

    setModifiedKeys((prev) => new Set(prev).add(key))
    await updateGeneratedModel(modelId, field, value)
    setSavedKeys((prev) => new Set(prev).add(key))
    setTimeout(() => {
      setSavedKeys((prev) => { const next = new Set(prev); next.delete(key); return next })
    }, 2000)
  }

  function cancelEdit() {
    setEditState(null)
  }

  async function handleRegenerate() {
    setIsRegenerating(true)
    setValidations({})
    try {
      await regenerateModels()
    } finally {
      setIsRegenerating(false)
    }
  }

  async function handleValidate(model: GeneratedBusinessModel) {
    const projectId = storeProject?.id ?? generatedProject.id
    setValidations((prev) => ({ ...prev, [model.id]: "loading" }))
    try {
      await triggerValidateModel(projectId, {
        modelId: model.id,
        title: model.title,
        audience: model.audience,
        valueProposition: model.valueProposition,
        description: model.description,
      })
      const result = await waitForValidateResult(projectId, model.id)
      setValidations((prev) => ({ ...prev, [model.id]: result }))
    } catch {
      setValidations((prev) => ({ ...prev, [model.id]: "error" }))
    }
  }

  function EditableText({
    modelId,
    field,
    value,
    className,
    multiline,
  }: {
    modelId: string
    field: EditableField
    value: string
    className: string
    multiline?: boolean
  }) {
    const key      = `${modelId}:${field}`
    const isActive = editState?.modelId === modelId && editState?.field === field
    const isSaved  = savedKeys.has(key)
    const isEdited = modifiedKeys.has(key) && !isSaved
    const displayValue = isActive ? editState!.value : value

    if (isActive) {
      const sharedProps = {
        autoFocus: true,
        value: displayValue,
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
          setEditState((prev) => (prev ? { ...prev, value: e.target.value } : null)),
        onBlur: () => void commitEdit(),
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Escape") cancelEdit()
          if (!multiline && e.key === "Enter") void commitEdit()
        },
        className: `${className} w-full rounded-lg border border-violet-300 bg-violet-50 px-2 py-1 outline-none ring-2 ring-violet-300`,
      }
      return multiline ? (
        <textarea {...sharedProps} rows={3} className={`${sharedProps.className} resize-none`} />
      ) : (
        <input {...sharedProps} />
      )
    }

    return (
      <div className="relative">
        <p
          className={`${className} cursor-text rounded-lg px-2 py-1 transition-colors hover:bg-violet-50 hover:ring-1 hover:ring-violet-200 ${isEdited ? "bg-amber-50/40 ring-1 ring-amber-200" : ""}`}
          onClick={() => startEdit(modelId, field, value)}
          title={tModel("editHint")}
        >
          {value}
        </p>
        {isSaved && (
          <span className="absolute -top-0.5 right-1 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
            ✓ Saved
          </span>
        )}
        {isEdited && !isSaved && (
          <span className="absolute -top-0.5 right-1 text-[10px] font-medium text-amber-500">
            edited
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.header}>
          <p className={s.label}>{tModel("label")}</p>
          <h2 className={s.title}>{tModel("title")}</h2>
        </div>

        <div className={s.carouselWrap}>
          <Carousel setApi={setCarouselApi} opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {generatedProject.models.map((model) => {
                const validation = validations[model.id]
                const isValidating = validation === "loading"

                return (
                  <CarouselItem key={model.id} className="basis-full">
                    <Card className={s.card}>
                      <div className={s.cardHeader}>
                        <div className="flex items-center justify-between">
                          <p className={s.cardBadge}>Business Model</p>
                          <ScoreRing score={model.score} />
                        </div>
                        <EditableText modelId={model.id} field="title" value={model.title} className={s.cardTitle} />
                      </div>
                      <div className={s.cardBody}>
                        <div>
                          <p className={s.fieldLabel}>{tModel("fields.targetAudience")}</p>
                          <EditableText modelId={model.id} field="audience" value={model.audience} className={s.fieldValue} />
                        </div>
                        <div>
                          <p className={s.fieldLabel}>{tModel("fields.valueProposition")}</p>
                          <EditableText modelId={model.id} field="valueProposition" value={model.valueProposition} className={s.fieldValue} />
                        </div>
                        <div>
                          <p className={s.fieldLabel}>{tModel("fields.description")}</p>
                          <EditableText modelId={model.id} field="description" value={model.description} className={s.fieldValueMuted} multiline />
                        </div>

                        {/* Generated, not user-editable — see updateGeneratedModel's
                            RAW_FIELD_BY_UI_FIELD in the store for why these three
                            stay display-only. */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className={s.fieldLabel}>{tModel("fields.keyMetric")}</p>
                            <p className={s.fieldValue}>{model.keyMetric}</p>
                          </div>
                          <div>
                            <p className={s.fieldLabel}>{tModel("fields.timeToValue")}</p>
                            <p className={s.fieldValue}>{model.timeToValue}</p>
                          </div>
                        </div>
                        <div>
                          <p className={s.fieldLabel}>{tModel("fields.scoreRationale")}</p>
                          <p className={s.fieldValueMuted}>{model.scoreRationale}</p>
                        </div>

                        <Button type="button" onClick={() => onSelectModel(model.id)} className={s.selectBtn}>
                          {tModel("selectModel")}
                        </Button>

                        <div className={s.actionBtns}>
                          <Button
                            type="button" variant="outline"
                            onClick={() => void handleRegenerate()}
                            disabled={isRegenerating}
                            className={s.secondaryBtn}
                          >
                            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
                            {tModel("regenerate")}
                          </Button>
                          <Button
                            type="button" variant="outline"
                            onClick={() => void handleValidate(model)}
                            disabled={isValidating}
                            className={s.secondaryBtn}
                          >
                            <ShieldCheck className={`mr-2 h-3.5 w-3.5 ${isValidating ? "animate-pulse text-violet-500" : ""}`} />
                            {isValidating ? tModel("validating") : tModel("validate")}
                          </Button>
                        </div>

                        {validation && <ValidationPanel result={validation} />}
                      </div>
                    </Card>
                  </CarouselItem>
                )
              })}
            </CarouselContent>

            <Button
              type="button" variant="outline" size="icon"
              onClick={() => carouselApi?.scrollPrev()}
              className={`${s.navBtn} ${s.navBtnPrev}`}
              aria-label={tModel("prevAriaLabel")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button" variant="outline" size="icon"
              onClick={() => carouselApi?.scrollNext()}
              className={`${s.navBtn} ${s.navBtnNext}`}
              aria-label={tModel("nextAriaLabel")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Carousel>

          <div className={s.dots}>
            {generatedProject.models.map((model, index) => (
              <button
                key={model.id}
                type="button"
                onClick={() => carouselApi?.scrollTo(index)}
                className={s.dot(activeModelIndex === index)}
                aria-label={tModel("goToModelAriaLabel", { n: index + 1 })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
