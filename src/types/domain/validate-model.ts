// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.8.1/schemas/validate_model.json (bizstruct-domain@v0.8.1)

/**
 * @minItems 1
 */
export type Fields = [FieldFeedback, ...FieldFeedback[]]
export type Comment = string
export type Field = "title" | "audience" | "value_proposition" | "description"
export type Status = "ok" | "weak" | "invalid"
export type Suggestion = string | null
export type Score = number
export type Status1 = "valid" | "needs_revision" | "invalid"
export type Summary = string

/**
 * Output of the `validate_model` side-channel task.
 */
export interface ValidateModelResult {
  fields: Fields
  score: Score
  status: Status1
  summary: Summary
}
export interface FieldFeedback {
  comment: Comment
  field: Field
  status: Status
  suggestion?: Suggestion
}


