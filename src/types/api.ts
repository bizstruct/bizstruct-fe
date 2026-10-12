// GENERATED FILE: do not edit. Run: pnpm sync:api
// Source: api/openapi.json (BizStruct API 1.0.0)

/**
 * Artifact id; derived with `derive_artifact_id`.
 */
export type Id = string
/**
 * Which persisted model `data` follows.
 */
export type ArtifactType =
  | "brief"
  | "empathy_map"
  | "customer_scenario"
  | "ideation"
  | "patterns"
  | "canvas"
  | "swot"
  | "errc"
  | "storytelling"
  | "future_scenario"
  | "pitch"
  | "team_info"
  | "business_case"
  | "environment_scan"
/**
 * The 14 persisted artifact models. `swot` and `errc` both belong to the
 * `swot_errc_cycle` stage.
 */
export type ArtifactType1 =
  | "brief"
  | "empathy_map"
  | "customer_scenario"
  | "ideation"
  | "patterns"
  | "canvas"
  | "swot"
  | "errc"
  | "storytelling"
  | "future_scenario"
  | "pitch"
  | "team_info"
  | "business_case"
  | "environment_scan"
export type GrantType = string | null
export type Username = string
export type Password = string
export type Scope = string
export type ClientId = string | null
export type ClientSecret = string | null
/**
 * Current plaintext password
 */
export type CurrentPassword = string
/**
 * New plaintext password to be hashed
 */
export type NewPassword = string
/**
 * 1 (severely inconsistent) to 5 (fully consistent). How the caller derives this from `violations` (e.g. from a judge model, or from counting errors) is not fixed here.
 */
export type Score = number
/**
 * Which rule raised this (matches ConsistencyRule.id).
 */
export type RuleId = string
/**
 * 'error': the artifacts are actually inconsistent. 'warning': plausible but worth a second look (mainly reserved for judge-model results, not deterministic rules, which should mostly raise errors precisely because they're checking a hard condition).
 */
export type Severity = "error" | "warning"
/**
 * Human-readable explanation, specific enough to act on.
 */
export type Message = string
/**
 * ids of the specific artifact instances involved, so the caller can point the user at them.
 *
 * @minItems 1
 */
export type ArtifactIds = [string, ...string[]]
export type Violations = ConsistencyViolation[]
/**
 * A human-readable description of the error
 */
export type Detail = string
/**
 * Project display name; a default is used when omitted
 */
export type Title = string | null
/**
 * Detailed unstructured business idea description
 */
export type Idea = string
/**
 * Generation language (immutable once set)
 */
export type ProjectLanguage = "uk" | "en"
/**
 * Enum representing the different stages of a chain.
 */
export type Stage =
  | "brief"
  | "empathy_map"
  | "customer_scenario"
  | "ideation"
  | "patterns"
  | "canvas"
  | "swot_errc_cycle"
  | "storytelling"
  | "future_scenario"
  | "pitch"
  | "team_info"
  | "business_case"
  | "environment_scan"
/**
 * Optional stages to generate: business_case and/or environment_scan
 */
export type Enabledoptional = Stage[]
/**
 * Approve rows with error-level consistency violations automatically instead of waiting for a user decision
 */
export type Autoapprove = boolean
export type Location = (string | number)[]
export type Message1 = string
export type ErrorType = string
export type Detail1 = ValidationError[]
/**
 * Unique identifier of the project
 */
export type Id1 = string
/**
 * Project title
 */
export type Title1 = string
/**
 * Detailed business idea
 */
export type Idea1 = string
/**
 * Project generation language
 */
export type ProjectLanguage1 = "uk" | "en"
/**
 * Optional stages generated for this project
 */
export type Enabledoptional1 = Stage[]
/**
 * Whether error-level violations are approved automatically
 */
export type Autoapprove1 = boolean
/**
 * Derived from the rows: failed if any row is in error, completed when every expected row is done, running otherwise
 */
export type Status = "completed" | "failed" | "running"
/**
 * Timestamp when the project was created
 */
export type Createdat = string
/**
 * Timestamp when the project was last updated
 */
export type Updatedat = string
/**
 * Row id
 */
export type Id2 = string
/**
 * Enum representing the different stages of a chain.
 */
export type Stage1 =
  | "brief"
  | "empathy_map"
  | "customer_scenario"
  | "ideation"
  | "patterns"
  | "canvas"
  | "swot_errc_cycle"
  | "storytelling"
  | "future_scenario"
  | "pitch"
  | "team_info"
  | "business_case"
  | "environment_scan"
/**
 * 0-based order among rows of the same stage under the same parent
 */
export type Instanceindex = number
/**
 * Current status of the row
 */
export type StageStatus =
  "pending" | "running" | "consistency_check" | "awaiting_decision" | "needs_retry" | "done" | "error"
/**
 * Id of the current attempt
 */
export type Attemptid = string | null
/**
 * How many retries have been counted for this row
 */
export type Retrycount = number
/**
 * Failure code.
 */
export type StageErrorCode =
  "generation_failed" | "check_failed" | "queue_unavailable" | "canceled_by_user" | "stuck_timeout"
/**
 * Human-readable explanation.
 */
export type Message2 = string
/**
 * Artifacts the row produced
 */
export type Artifacts = ArtifactRecord[]
/**
 * When the current attempt started
 */
export type Startedat = string | null
/**
 * When the row last finished
 */
export type Finishedat = string | null
/**
 * All rows of the project
 */
export type Rows = StageRowResponse[]
export type ProjectLanguage2 = "uk" | "en"
/**
 * Project id.
 */
export type ProjectId = string
/**
 * The user's business idea.
 */
export type Idea2 = string
/**
 * Generation language of the project ('uk' or 'en').
 */
export type Language = string
/**
 * Optional stages enabled for this project; the only place this is carried.
 */
export type EnabledOptional = Stage[]
/**
 * Row id, assigned by be.
 */
export type Id3 = string
/**
 * Enum representing the different stages of a chain.
 */
export type Stage2 =
  | "brief"
  | "empathy_map"
  | "customer_scenario"
  | "ideation"
  | "patterns"
  | "canvas"
  | "swot_errc_cycle"
  | "storytelling"
  | "future_scenario"
  | "pitch"
  | "team_info"
  | "business_case"
  | "environment_scan"
/**
 * 0-based order among rows of the same stage under the same parent; for empathy_map, row k covers Brief.customer_segment_candidates[k].
 */
export type InstanceIndex = number
/**
 * Current status; only be changes it.
 */
export type StageStatus1 =
  "pending" | "running" | "consistency_check" | "awaiting_decision" | "needs_retry" | "done" | "error"
/**
 * Id of the current attempt, issued by be on every attempt of its own.
 */
export type AttemptId = string | null
/**
 * Artifacts this row produced (empty until it has a result).
 */
export type Artifacts1 = ArtifactRecord[]
/**
 * How many retries be has counted for this row.
 */
export type RetryCount = number
/**
 * Reason a stage entered `StageStatus.ERROR`.
 *
 * `error` is reserved for external failures and cancellation, never for
 * reaching the retry limit (that goes to `awaiting_decision` instead).
 */
export type StageErrorCode1 =
  "generation_failed" | "check_failed" | "queue_unavailable" | "canceled_by_user" | "stuck_timeout"
/**
 * Human-readable error text, if any.
 */
export type Error = string | null
/**
 * When the current attempt started.
 */
export type StartedAt = string | null
/**
 * When the row last finished.
 */
export type FinishedAt = string | null
/**
 * All rows of the project (or, with ?row=<id>, that row and the closure of its refs).
 */
export type Rows1 = StageRow[]
/**
 * Unique identifier of the project
 */
export type Id4 = string
/**
 * Project title
 */
export type Title2 = string
/**
 * Detailed business idea
 */
export type Idea3 = string
/**
 * Project generation language
 */
export type ProjectLanguage3 = "uk" | "en"
/**
 * Optional stages generated for this project
 */
export type Enabledoptional2 = Stage[]
/**
 * Whether error-level violations are approved automatically
 */
export type Autoapprove2 = boolean
/**
 * Derived from the rows: failed if any row is in error, completed when every expected row is done, running otherwise
 */
export type Status1 = "completed" | "failed" | "running"
/**
 * Timestamp when the project was created
 */
export type Createdat1 = string
/**
 * Timestamp when the project was last updated
 */
export type Updatedat1 = string
/**
 * Updated project title
 */
export type Title3 = string
export type RefreshToken = string
/**
 * Project id.
 */
export type ProjectId1 = string
/**
 * The row this result is for.
 */
export type StageRowId = string
/**
 * The attempt this result belongs to.
 */
export type AttemptId1 = string
/**
 * Outcome of the generation.
 */
export type Status2 = "success" | "failed"
/**
 * All artifacts of the row (for the cycle: every version). Required for success.
 */
export type Artifacts2 = ArtifactRecord[]
/**
 * Lifecycle status of a single stage in the generation chain.
 *
 * See `bizstruct_domain.stage_machine` for the allowed-transition table
 * between these statuses.
 */
export type StageStatus2 =
  "pending" | "running" | "consistency_check" | "awaiting_decision" | "needs_retry" | "done" | "error"
export type AccessToken = string
export type RefreshToken1 = string
export type TokenType = string
/**
 * User's email address
 */
export type Email = string
/**
 * User's full name
 */
export type FullName = string | null
/**
 * Plaintext password to be hashed
 */
export type Password1 = string
/**
 * Indicates if the user is a service account
 */
export type IsService = boolean
/**
 * User's email address
 */
export type Email1 = string
/**
 * User's full name
 */
export type FullName1 = string | null
/**
 * Unique identifier for the user
 */
export type Id5 = string
/**
 * Indicates if the user is active
 */
export type IsActive = boolean
/**
 * Indicates if the user is a service account
 */
export type IsService1 = boolean
/**
 * Timestamp with timezone when the user was created
 */
export type CreatedAt = string
/**
 * Timestamp with timezone when the user was last updated
 */
export type UpdatedAt = string | null
/**
 * New email address
 */
export type Email2 = string | null
/**
 * New full name
 */
export type FullName2 = string | null
/**
 * New plaintext password to be hashed
 */
export type Password2 = string | null
/**
 * Indicates if the user is active
 */
export type IsActive1 = boolean | null

export interface ApiSchemas {
  ArtifactRecord?: ArtifactRecord
  ArtifactType?: ArtifactType1
  Body_login_api_auth_login_post?: BodyLoginApiAuthLoginPost
  ChangePasswordRequest?: ChangePasswordRequest
  ConsistencyReport?: ConsistencyReport
  ConsistencyViolation?: ConsistencyViolation
  ErrorResponse?: ErrorResponse
  GenerationRequest?: GenerationRequest
  HTTPValidationError?: HTTPValidationError
  ProjectDetail?: ProjectDetail
  ProjectLanguage?: ProjectLanguage2
  ProjectSnapshot?: ProjectSnapshot
  ProjectSummary?: ProjectSummary
  ProjectUpdate?: ProjectUpdate
  RefreshTokenRequest?: RefreshTokenRequest
  Stage?: Stage
  StageErrorCode?: StageErrorCode1
  StageFailure?: StageFailure
  StageResult?: StageResult
  StageRow?: StageRow
  StageRowResponse?: StageRowResponse
  StageStatus?: StageStatus2
  TokenResponse?: TokenResponse
  UserCreate?: UserCreate
  UserResponse?: UserResponse
  UserUpdate?: UserUpdate
  ValidationError?: ValidationError
}
/**
 * One persisted artifact on the wire: its id, its type and its data.
 */
export interface ArtifactRecord {
  id: Id
  type: ArtifactType
  data: Data
}
/**
 * The artifact as the persisted model dumps it (validate with `parse_artifact`).
 */
export interface Data {
  [k: string]: unknown
}
export interface BodyLoginApiAuthLoginPost {
  grant_type?: GrantType
  username: Username
  password: Password
  scope?: Scope
  client_id?: ClientId
  client_secret?: ClientSecret
}
/**
 * Model for changing a user's password.
 */
export interface ChangePasswordRequest {
  current_password: CurrentPassword
  new_password: NewPassword
}
/**
 * Result of running one or more rules against a set of artifacts.
 */
export interface ConsistencyReport {
  score: Score
  violations?: Violations
}
/**
 * One thing a rule found wrong, or worth flagging, between artifacts.
 */
export interface ConsistencyViolation {
  rule_id: RuleId
  severity: Severity
  message: Message
  artifact_ids: ArtifactIds
}
/**
 * Standard error response payload.
 */
export interface ErrorResponse {
  detail: Detail
}
/**
 * Schema for creating a project and starting its generation.
 */
export interface GenerationRequest {
  title?: Title
  idea: Idea
  language: ProjectLanguage
  enabledOptional?: Enabledoptional
  autoApprove?: Autoapprove
}
export interface HTTPValidationError {
  detail?: Detail1
}
export interface ValidationError {
  loc: Location
  msg: Message1
  type: ErrorType
}
/**
 * Public representation of a project with all its rows.
 */
export interface ProjectDetail {
  id: Id1
  title: Title1
  idea: Idea1
  language: ProjectLanguage1
  enabledOptional: Enabledoptional1
  autoApprove: Autoapprove1
  status: Status
  createdAt: Createdat
  updatedAt: Updatedat
  rows: Rows
}
/**
 * Public representation of one stage row. The artifacts, the failure and
 * the consistency report are domain models and stay snake_case.
 */
export interface StageRowResponse {
  id: Id2
  stage: Stage1
  instanceIndex: Instanceindex
  status: StageStatus
  refs: Refs
  attemptId: Attemptid
  retryCount: Retrycount
  /**
   * Why the row is in ERROR, if it is
   */
  error: StageFailure | null
  /**
   * The last consistency report
   */
  consistency: ConsistencyReport | null
  artifacts: Artifacts
  startedAt: Startedat
  finishedAt: Finishedat
}
/**
 * Upstream stage -> ids of the rows this row draws from
 */
export interface Refs {
  [k: string]: string[]
}
/**
 * Why a row failed.
 */
export interface StageFailure {
  code: StageErrorCode
  message: Message2
}
/**
 * What ml (and the experiment tool) reads: project fields and all rows.
 */
export interface ProjectSnapshot {
  project_id: ProjectId
  idea: Idea2
  language: Language
  enabled_optional?: EnabledOptional
  rows?: Rows1
}
/**
 * A stage row as be keeps it: state plus the artifacts it produced.
 */
export interface StageRow {
  id: Id3
  stage: Stage2
  instance_index?: InstanceIndex
  status: StageStatus1
  attempt_id?: AttemptId
  refs?: Refs1
  artifacts?: Artifacts1
  /**
   * The last consistency report for this row, if any.
   */
  consistency?: ConsistencyReport | null
  retry_count?: RetryCount
  /**
   * Why the row is in ERROR, if it is.
   */
  error_code?: StageErrorCode1 | null
  error?: Error
  started_at?: StartedAt
  finished_at?: FinishedAt
}
/**
 * Upstream stage -> ids of the rows this row draws from.
 */
export interface Refs1 {
  [k: string]: string[]
}
/**
 * Public representation of a project without its rows.
 */
export interface ProjectSummary {
  id: Id4
  title: Title2
  idea: Idea3
  language: ProjectLanguage3
  enabledOptional: Enabledoptional2
  autoApprove: Autoapprove2
  status: Status1
  createdAt: Createdat1
  updatedAt: Updatedat1
}
/**
 * Schema for updating an existing project.
 *
 * Only the title is mutable. Attempting to modify immutable fields
 * such as idea, language, or status triggers a 422 extra_forbidden validation error.
 */
export interface ProjectUpdate {
  title: Title3
}
/**
 * Request model for refreshing access tokens.
 */
export interface RefreshTokenRequest {
  refresh_token: RefreshToken
}
/**
 * ml -> be (hook). The final outcome of a row; ml never writes statuses.
 */
export interface StageResult {
  project_id: ProjectId1
  stage_row_id: StageRowId
  attempt_id: AttemptId1
  status: Status2
  artifacts?: Artifacts2
  /**
   * Required for failed.
   */
  error?: StageFailure | null
  /**
   * The final consistency report after ml's own retries.
   */
  consistency?: ConsistencyReport | null
}
/**
 * Response model for authentication tokens.
 */
export interface TokenResponse {
  access_token: AccessToken
  refresh_token: RefreshToken1
  token_type?: TokenType
}
/**
 * Model for creating a new user.
 */
export interface UserCreate {
  email: Email
  full_name?: FullName
  password: Password1
  is_service?: IsService
}
/**
 * Model for user data returned in responses.
 */
export interface UserResponse {
  email: Email1
  full_name?: FullName1
  id: Id5
  is_active: IsActive
  is_service: IsService1
  created_at: CreatedAt
  updated_at?: UpdatedAt
}
/**
 * Model for updating user data.
 */
export interface UserUpdate {
  email?: Email2
  full_name?: FullName2
  password?: Password2
  is_active?: IsActive1
}
