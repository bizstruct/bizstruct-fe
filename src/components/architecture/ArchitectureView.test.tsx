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

function renderView(architecture: Architecture, uiLocale = "en") {
  return render(
    <NextIntlClientProvider locale={uiLocale} messages={enMessages}>
      <ArchitectureView
        projectId="p1"
        architecture={architecture}
        hasCanvas
        onGoToCanvas={() => {}}
      />
    </NextIntlClientProvider>,
  )
}

// Architecture is single-language per project now (part E) — the rationale
// text is whatever the project was generated in, unrelated to the viewer's
// UI locale (uiLocale above is only next-intl's interface-string locale).
const RATIONALE = "A rationale long enough in English for this epicenter to display properly."
const PATTERN_RATIONALE = "A rationale long enough in English for this pattern to display properly."

function architecture(overrides: Partial<Architecture> = {}): Architecture {
  return {
    epicenter: "customer_driven",
    epicenter_rationale: RATIONALE,
    pattern: "free",
    pattern_subtype: "freemium",
    pattern_rationale: PATTERN_RATIONALE,
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

  it("renders the project's rationale text as-is, regardless of the viewer's UI locale", () => {
    renderView(architecture(), "uk")
    expect(screen.getByText(RATIONALE)).toBeInTheDocument()
    expect(screen.getByText(PATTERN_RATIONALE)).toBeInTheDocument()
  })
})
