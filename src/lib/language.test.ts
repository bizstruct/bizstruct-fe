import { describe, expect, it } from "vitest"
import { detectLanguage, preferredLanguage } from "./language"

describe("detectLanguage", () => {
  it("takes Cyrillic text for Ukrainian and Latin text for English", () => {
    expect(detectLanguage("Сервіс для власників невеликих кав’ярень в Україні", "en")).toBe("uk")
    expect(detectLanguage("An app that delivers boxes of fresh produce", "uk")).toBe("en")
  })

  it("follows the script that holds most of the letters in a mixed idea", () => {
    expect(detectLanguage("Сервіс для кав’ярень з інтеграцією POS та API", "en")).toBe("uk")
    expect(detectLanguage("A marketplace for photographers, студії та оренда", "uk")).toBe("en")
  })

  it("ignores digits, punctuation and emoji", () => {
    expect(detectLanguage("2026 — 100% 🚀 !!! Мобільний застосунок", "en")).toBe("uk")
  })

  it("falls back when the text says too little", () => {
    expect(detectLanguage("", "uk")).toBe("uk")
    expect(detectLanguage("   123  ", "en")).toBe("en")
    expect(detectLanguage("Привіт", "en")).toBe("en") // 6 letters: not enough to decide
  })
})

describe("preferredLanguage", () => {
  it("takes the first browser language be supports, regional tags included", () => {
    expect(preferredLanguage(["uk-UA", "en"], "en")).toBe("uk")
    expect(preferredLanguage(["de-DE", "en-GB"], "uk")).toBe("en")
  })

  it("falls back to the interface language, then English", () => {
    expect(preferredLanguage(["ru", "de"], "uk")).toBe("uk")
    expect(preferredLanguage([], "pl")).toBe("en")
  })
})
