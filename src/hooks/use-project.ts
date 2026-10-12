"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getProject, type Project } from "@/lib/api/projects"
import type { ApiError, ApiResult } from "@/lib/api/http"

export const POLL_INTERVAL_MS = 4000

/** A project stops changing on its own once it is completed or failed (a user action can start it again). */
export const isSettled = (project: Project | null): boolean => project?.status === "completed" || project?.status === "failed"

export interface UseProject {
  project: Project | null
  error: ApiError | null
  loading: boolean
  /** True while the hook is polling (the project is running or not loaded yet). */
  polling: boolean
  /** Fetch now (after a row action). */
  refresh: () => Promise<void>
  /** Replace the project with a fresher copy (a row action returns one). */
  replace: (project: Project) => void
}

/**
 * Loads GET /api/projects/{id} and polls it every `intervalMs` while the project is running.
 * Polling stops on completed or failed, on a lost session and on 404; it starts again when an
 * action puts the project back to running. A transient error keeps the last project and retries.
 */
export function useProject(
  id: string,
  { intervalMs = POLL_INTERVAL_MS, fetcher = getProject }: { intervalMs?: number; fetcher?: (id: string, signal?: AbortSignal) => Promise<ApiResult<Project>> } = {},
): UseProject {
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(true)
  const [stopped, setStopped] = useState(false)
  const [tick, setTick] = useState(0)
  const controller = useRef<AbortController | null>(null)

  const apply = useCallback((result: ApiResult<Project>) => {
    setLoading(false)
    if (result.ok) {
      setProject(result.data)
      setError(null)
      setStopped(false)
    } else {
      setError(result)
      // Nothing to wait for: the session is gone or the project does not exist.
      if (result.kind === "unauthorized" || result.kind === "not_found") setStopped(true)
    }
  }, [])

  const load = useCallback(async () => {
    controller.current?.abort()
    const own = new AbortController()
    controller.current = own
    const result = await fetcher(id, own.signal)
    if (!own.signal.aborted) apply(result)
  }, [fetcher, id, apply])

  useEffect(() => {
    const own = new AbortController()
    controller.current = own
    void fetcher(id, own.signal).then((result) => {
      if (!own.signal.aborted) apply(result)
    })
    return () => own.abort()
  }, [fetcher, id, apply])

  const settled = isSettled(project)
  useEffect(() => {
    // Wait for the first answer: polling before it would race the initial load.
    if (loading || settled || stopped) return
    const timer = setTimeout(() => {
      void load().then(() => setTick((n) => n + 1))
    }, intervalMs)
    return () => clearTimeout(timer)
  }, [loading, settled, stopped, intervalMs, load, tick])

  return {
    project,
    error,
    loading,
    polling: !settled && !stopped,
    refresh: load,
    replace: (next) => {
      setProject(next)
      setError(null)
      setStopped(false)
    },
  }
}
