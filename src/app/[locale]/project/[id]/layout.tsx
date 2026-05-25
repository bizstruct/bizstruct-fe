"use client"

import { usePathname } from "next/navigation"
import { ProjectStepper } from "@/components/common/project-stepper"

export default function ProjectIdLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // pathname for workspace root: /en/project/<id>  → 3 non-empty segments
  // pathname for sub-pages:      /en/project/<id>/canvas → 4+ segments
  const segments = pathname?.split("/").filter(Boolean) ?? []
  const isWorkspaceRoot = segments.length === 3

  return (
    <div className="flex flex-col h-full">
      {!isWorkspaceRoot && <ProjectStepper />}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  )
}
