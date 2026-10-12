// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/storytelling.json (bizstruct-domain@v0.17.0)

/**
 * Identifier of the canvas this storytelling element is associated with.
 */
export type CanvasId = string
/**
 * A list of references to specific sections and cards on the canvas that are relevant to the storytelling element.
 *
 * @minItems 1
 */
export type CanvasReferences = [CanvasReference, ...CanvasReference[]]
/**
 * A note or description related to the specific section and card.
 */
export type Note = string
/**
 * The section of the canvas (e.g., 'Customer Segments', 'Value Propositions').
 */
export type CanvasSection =
  | "value_propositions"
  | "customer_segments"
  | "channels"
  | "customer_relationships"
  | "revenue_streams"
  | "key_resources"
  | "key_activities"
  | "key_partnerships"
  | "cost_structure"
/**
 * The format of the storytelling (e.g.,, 'Video Clip', 'TALK AND IMAGE').
 */
export type StorytellingFormat = "talk_and_image" | "video_clip" | "role_play" | "text_and_image" | "comic_strip"
/**
 * The goal of the storytelling (e.g., 'Introducing New', 'Engaging Employees', 'Pitching Investors').
 */
export type StorytellingGoal = "introducing_new" | "engaging_employees" | "pitching_investors"
/**
 * Unique identifier for the storytelling element.
 */
export type Id = string
/**
 * The narrative text of the storytelling element.
 */
export type NarrativeText = string
/**
 * The perspective from which the storytelling is presented (e.g., 'Company', 'Customer').
 */
export type StorytellingPerspective = "company" | "customer"

/**
 * Represents a storytelling element for a business model canvas.
 */
export interface Storytelling {
  canvas_id: CanvasId
  canvas_references: CanvasReferences
  format: StorytellingFormat
  goal: StorytellingGoal
  id: Id
  narrative_text: NarrativeText
  perspective: StorytellingPerspective
  [k: string]: unknown
}
/**
 * Represents a reference to a specific section and card on the canvas.
 */
export interface CanvasReference {
  note: Note
  section: CanvasSection
  [k: string]: unknown
}
