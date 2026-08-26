export interface FieldFeedback {
  field: string
  status: "ok" | "weak" | "invalid"
  comment: string
  suggestion?: string
}

export interface ValidationResult {
  model_id: string
  status: "valid" | "needs_revision" | "invalid"
  score: number
  summary: string
  fields: FieldFeedback[]
}

interface GenerationCompleteEvent {
  status: "completed" | "failed"
}

async function _negotiate(projectId: string): Promise<string> {
  const negotiateBase = process.env.NEXT_PUBLIC_AZURE_WEB_PUBSUB_NEGOTIATE_URL
  if (!negotiateBase) throw new Error("NEXT_PUBLIC_AZURE_WEB_PUBSUB_NEGOTIATE_URL is not set")
  const res = await fetch(`${negotiateBase}?project_id=${projectId}`)
  if (!res.ok) throw new Error(`PubSub negotiate failed: ${res.status}`)
  const { url } = (await res.json()) as { url: string }
  return url
}

export async function waitForProjectGeneration(projectId: string): Promise<GenerationCompleteEvent> {
  const url = await _negotiate(projectId)

  return new Promise((resolve, reject) => {
    const es = new EventSource(url)

    es.onmessage = (event: MessageEvent<string>) => {
      let msg: Record<string, unknown>
      try {
        msg = JSON.parse(event.data) as Record<string, unknown>
      } catch {
        return
      }
      if (msg.type === "generation_complete") {
        es.close()
        resolve({ status: (msg.status as "completed" | "failed") ?? "failed" })
      }
    }

    es.onerror = () => {
      es.close()
      reject(new Error("PubSub connection error"))
    }
  })
}

export async function waitForValidateResult(projectId: string, modelId: string): Promise<ValidationResult> {
  const url = await _negotiate(projectId)

  return new Promise((resolve, reject) => {
    const es = new EventSource(url)

    es.onmessage = (event: MessageEvent<string>) => {
      let msg: Record<string, unknown>
      try {
        msg = JSON.parse(event.data) as Record<string, unknown>
      } catch {
        return
      }
      if (msg.type === "validate_model_result" && msg.model_id === modelId) {
        es.close()
        resolve(msg.result as ValidationResult)
      }
    }

    es.onerror = () => {
      es.close()
      reject(new Error("PubSub connection error"))
    }
  })
}
