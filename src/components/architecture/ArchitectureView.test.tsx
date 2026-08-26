import { render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { describe, expect, it, vi } from "vitest"

import type { Architecture } from "@/schemas/architecture.schema"
import enMessages from "../../../messages/en.json"

import { ArchitectureView } from "./ArchitectureView"

vi.mock("@/services/architecture", () => ({
  patchArchitectureEpicenter: vi.fn(),
  patchArchitecturePattern: vi.fn(),
}))

function renderView(architecture: Architecture, locale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={enMessages}>
      <ArchitectureView
        projectId="p1"
        locale={locale}
        architecture={architecture}
        hasCanvas
        onGoToCanvas={() => {}}
      />
    </NextIntlClientProvider>,
  )
}

const RATIONALE_UK = "Достатньо довге обґрунтування епіцентру українською мовою для цього блоку."
const RATIONALE_EN = "A rationale long enough in English for this epicenter to display properly."
const PATTERN_RATIONALE_UK = "Достатньо довге обґрунтування патерну українською мовою для цього блоку."
const PATTERN_RATIONALE_EN = "A rationale long enough in English for this pattern to display properly."

function architecture(overrides: Partial<Architecture> = {}): Architecture {
  return {
    epicenter: "customer_driven",
    epicenter_rationale_uk: RATIONALE_UK,
    epicenter_rationale_en: RATIONALE_EN,
    pattern: "free",
    pattern_subtype: "freemium",
    pattern_rationale_uk: PATTERN_RATIONALE_UK,
    pattern_rationale_en: PATTERN_RATIONALE_EN,
    ...overrides,
  }
}

describe("ArchitectureView", () => {
  it("renders multiple_epicenter without crashing and with a non-empty label", () => {
    renderView(architecture({ epicenter: "multiple_epicenter" }))
    const button = screen.getByRole("button", { name: /multiple epicenter/i })
    expect(button).toBeInTheDocument()
    expect(button.textContent?.trim()).not.toBe("")
  })

  it("renders free + freemium as a two-level structure (pattern + subtype selectors)", () => {
    renderView(architecture({ pattern: "free", pattern_subtype: "freemium" }))
    expect(screen.getByRole("button", { name: /^free$/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /freemium/i })).toBeInTheDocument()
    expect(screen.getByText(/subtype/i)).toBeInTheDocument()
  })

  it("renders long_tail with no subtype selector", () => {
    renderView(architecture({ pattern: "long_tail", pattern_subtype: null }))
    expect(screen.getByRole("button", { name: /long tail/i })).toBeInTheDocument()
    expect(screen.queryByText(/subtype/i)).not.toBeInTheDocument()
  })

  it("shows the English rationale when locale is en", () => {
    renderView(architecture(), "en")
    expect(screen.getByText(RATIONALE_EN)).toBeInTheDocument()
    expect(screen.queryByText(RATIONALE_UK)).not.toBeInTheDocument()
  })

  it("shows the Ukrainian rationale when locale is uk", () => {
    renderView(architecture(), "uk")
    expect(screen.getByText(RATIONALE_UK)).toBeInTheDocument()
    expect(screen.queryByText(RATIONALE_EN)).not.toBeInTheDocument()
  })
})
