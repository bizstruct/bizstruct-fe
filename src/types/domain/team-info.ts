// GENERATED FILE: do not edit. Run: pnpm sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.17.0/schemas/team_info.json (bizstruct-domain@v0.17.0)

/**
 * Unique identifier for the team.
 */
export type Id = string
/**
 * A list of team members involved in the business structuring process.
 *
 * @minItems 1
 */
export type Members = [TeamMember, ...TeamMember[]]
/**
 * A list of the team member's key competencies.
 */
export type KeyCompetencies = string[]
/**
 * The name of the team member.
 */
export type Name = string
/**
 * A brief description of the team member's relevant experience.
 */
export type RelevantExperience = string
/**
 * The role of the team member within the business structuring process.
 */
export type Role = string
/**
 * Identifier of the project this team is associated with.
 */
export type ProjectId = string

/**
 * Represents information about the team involved in the business structuring process.
 */
export interface TeamInfo {
  id: Id
  members: Members
  project_id: ProjectId
  [k: string]: unknown
}
/**
 * Represents a team member involved in the business structuring process.
 */
export interface TeamMember {
  key_competencies: KeyCompetencies
  name: Name
  relevant_experience: RelevantExperience
  role: Role
  [k: string]: unknown
}
