"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { modelSelectionStyles as s } from "./styles"
import type { CarouselApi } from "@/components/ui/carousel"
import type { GeneratedProject } from "@/schemas/project.schema"

interface Props {
  generatedProject: GeneratedProject
  onSelectModel: (modelId: string) => void
}

export function ModelSelectionScreen({ generatedProject, onSelectModel }: Props) {
  const tModel = useTranslations("ModelSelection")
  const [carouselApi, setCarouselApi]           = useState<CarouselApi | null>(null)
  const [activeModelIndex, setActiveModelIndex] = useState(0)

  useEffect(() => {
    if (!carouselApi) return
    const update = () => setActiveModelIndex(carouselApi.selectedScrollSnap())
    update()
    carouselApi.on("select", update)
    carouselApi.on("reInit", update)
    return () => { carouselApi.off("select", update); carouselApi.off("reInit", update) }
  }, [carouselApi])

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
              {generatedProject.models.map((model) => (
                <CarouselItem key={model.id} className="basis-full">
                  <Card className={s.card}>
                    <div className={s.cardHeader}>
                      <p className={s.cardBadge}>Business Model</p>
                      <h3 className={s.cardTitle}>{model.title}</h3>
                    </div>
                    <div className={s.cardBody}>
                      <div>
                        <p className={s.fieldLabel}>{tModel("fields.targetAudience")}</p>
                        <p className={s.fieldValue}>{model.audience}</p>
                      </div>
                      <div>
                        <p className={s.fieldLabel}>{tModel("fields.valueProposition")}</p>
                        <p className={s.fieldValue}>{model.valueProposition}</p>
                      </div>
                      <div>
                        <p className={s.fieldLabel}>{tModel("fields.description")}</p>
                        <p className={s.fieldValueMuted}>{model.description}</p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => onSelectModel(model.id)}
                        className={s.selectBtn}
                      >
                        {tModel("selectModel")}
                      </Button>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
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
                aria-label={tModel("goToModelAriaLabel").replace("{n}", String(index + 1))}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
