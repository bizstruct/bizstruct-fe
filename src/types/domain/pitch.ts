// GENERATED FILE — do not edit. Run: npm run sync:domain
// Source: https://raw.githubusercontent.com/bizstruct/bizstruct-domain/v0.7.0/schemas/pitch.json (bizstruct-domain@v0.7.0)

/**
 * @minItems 5
 * @maxItems 5
 */
export type Customer = [CustomerSlide, CustomerSlide, CustomerSlide, CustomerSlide, CustomerSlide]
export type ContentEn = string
export type ContentUk = string
export type HeadlineEn = string
export type HeadlineUk = string
export type Type = "opening" | "empathy" | "transformation" | "social_proof" | "invitation"
/**
 * @minItems 5
 * @maxItems 5
 */
export type Investor = [InvestorSlide, InvestorSlide, InvestorSlide, InvestorSlide, InvestorSlide]
export type ContentEn1 = string
export type ContentUk1 = string
export type HeadlineEn1 = string
export type HeadlineUk1 = string
export type Type1 = "hook" | "problem" | "solution" | "traction" | "ask"

/**
 * Output of the `pitch` stage: investor and customer decks.
 */
export interface Pitch {
  customer: Customer
  investor: Investor
}
export interface CustomerSlide {
  content_en: ContentEn
  content_uk: ContentUk
  headline_en: HeadlineEn
  headline_uk: HeadlineUk
  type: Type
}
export interface InvestorSlide {
  content_en: ContentEn1
  content_uk: ContentUk1
  headline_en: HeadlineEn1
  headline_uk: HeadlineUk1
  type: Type1
}


