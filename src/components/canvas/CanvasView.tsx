"use client"

import React from "react"
import { Download, Mic2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { canvasStyles } from "./styles"
import { CanvasSection, CANVAS_ORDER } from "./CanvasSection"

export function CanvasView() {
  const t        = useTranslations("CanvasView")
  const router   = useRouter()
  const params   = useParams()
  const locale   = (params?.locale as string) ?? "en"
  const projectId = (params?.id as string) ?? ""

  return (
    <div className={canvasStyles.root}>
      <div className={canvasStyles.header}>
        <span className={canvasStyles.headerTitle}>{t("title")}</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs border-slate-200 text-slate-600">
            <Download className="h-3 w-3" /> {t("exportPdf")}
          </Button>
          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs bg-violet-600 hover:bg-violet-700"
            onClick={() => router.push(`/${locale}${ROUTES.pitch(projectId)}`)}
          >
            <Mic2 className="h-3 w-3" /> {t("generatePitch")}
          </Button>
        </div>
      </div>

      <div className={canvasStyles.gridWrapper}>
        <div className={canvasStyles.grid}>
          {CANVAS_ORDER.map((key) => (
            <CanvasSection key={key} sectionKey={key} />
          ))}
        </div>
      </div>
    </div>
  )
}
