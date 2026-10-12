// The supported locales, on their own so code that only needs the list (the route guard, tests)
// does not pull in next-intl's navigation helpers.
export const LOCALES = ["uk", "en"] as const
export const DEFAULT_LOCALE = "uk"
