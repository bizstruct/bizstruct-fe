// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/bbee62baff73b4c40eadedc7a285274bf63b15c0/schemas/pitch.json (bizstruct-domain@bbee62baff73b4c40eadedc7a285274bf63b15c0)

/**
 * @minItems 5
 * @maxItems 5
 */
export type Customer = [CustomerSlide, CustomerSlide, CustomerSlide, CustomerSlide, CustomerSlide]
export type Content = string
export type Headline = string
export type Type = "opening" | "empathy" | "transformation" | "social_proof" | "invitation"
/**
 * @minItems 5
 * @maxItems 5
 */
export type Investor = [InvestorSlide, InvestorSlide, InvestorSlide, InvestorSlide, InvestorSlide]
export type Content1 = string
export type Headline1 = string
export type Type1 = "hook" | "problem" | "solution" | "traction" | "ask"

/**
 * Output of the `pitch` stage: investor and customer decks.
 */
export interface Pitch {
  customer: Customer
  investor: Investor
}
export interface CustomerSlide {
  content: Content
  headline: Headline
  type: Type
}
export interface InvestorSlide {
  content: Content1
  headline: Headline1
  type: Type1
}


