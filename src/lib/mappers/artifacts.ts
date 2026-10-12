import type { Row } from "@/lib/api/projects"
import type { ArtifactKind, ArtifactModels } from "@/types/artifacts"

/** The artifacts of one type a row holds, typed by the generated domain type. Data is taken as stored, never rewritten. */
export function artifactsOf<K extends ArtifactKind>(row: Row | undefined, kind: K): ArtifactModels[K][] {
  if (!row) return []
  return row.artifacts.filter((a) => a.type === kind).map((a) => a.data as unknown as ArtifactModels[K])
}

export function firstArtifact<K extends ArtifactKind>(row: Row | undefined, kind: K): ArtifactModels[K] | undefined {
  return artifactsOf(row, kind)[0]
}
