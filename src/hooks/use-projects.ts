"use client"

import { useCallback, useEffect, useState } from "react"
import { listProjects } from "@/lib/api/projects"
import type { ApiError } from "@/lib/api/http"
import type { ProjectSummary } from "@/types/api"

const CHANGED = "bizstruct:projects-changed"

/** Tell every mounted project list (sidebar, home) to reload. */
export function notifyProjectsChanged(): void {
  window.dispatchEvent(new Event(CHANGED))
}

export function useProjects(): { projects: ProjectSummary[] | null; error: ApiError | null; reload: () => void } {
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null)
  const [error, setError] = useState<ApiError | null>(null)

  const reload = useCallback(() => {
    const controller = new AbortController()
    void listProjects(controller.signal).then((result) => {
      if (controller.signal.aborted) return
      if (result.ok) {
        setProjects(result.data)
        setError(null)
      } else setError(result)
    })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const cancel = reload()
    window.addEventListener(CHANGED, reload)
    return () => {
      cancel()
      window.removeEventListener(CHANGED, reload)
    }
  }, [reload])

  return { projects, error, reload }
}
