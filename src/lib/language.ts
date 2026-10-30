// The generation language is never asked for: it follows the text the user wrote, and the browser's
// language when the text says too little. be accepts uk and en only.

export type GenerationLanguage = "uk" | "en"

/** Fewer letters than this say nothing reliable about the language. */
const MIN_LETTERS = 8

/**
 * Cyrillic text -> "uk", Latin text -> "en", by the script that holds most of the letters. This does not
 * tell Ukrainian from Russian: be generates in Ukrainian for any Cyrillic idea. Too little text -> `fallback`.
 */
export function detectLanguage(text: string, fallback: GenerationLanguage): GenerationLanguage {
  let cyrillic = 0
  let latin = 0
  for (const char of text) {
    if (/\p{Script=Cyrillic}/u.test(char)) cyrillic++
    else if (/\p{Script=Latin}/u.test(char)) latin++
  }
  if (cyrillic + latin < MIN_LETTERS) return fallback
  return cyrillic >= latin ? "uk" : "en"
}

/** The first browser language be can generate in; otherwise the interface language, otherwise English. */
export function preferredLanguage(browserLanguages: readonly string[], interfaceLocale: string): GenerationLanguage {
  for (const tag of browserLanguages) {
    const base = tag.toLowerCase().split("-")[0]
    if (base === "uk" || base === "en") return base
  }
  return interfaceLocale === "uk" ? "uk" : "en"
}
