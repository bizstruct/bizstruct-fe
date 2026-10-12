import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MESSAGES, renderIntl } from "@/test/render"
import { ProjectStatusChip, RowStatusChip } from "./status-chip"

const ROW_STATUSES = ["pending", "running", "consistency_check", "awaiting_decision", "needs_retry", "done", "error"] as const

describe("RowStatusChip", () => {
  it.each(ROW_STATUSES)("shows the %s label and exposes the status", (status) => {
    renderIntl(<RowStatusChip status={status} />)
    const chip = screen.getByText(MESSAGES.en.Status.row[status])
    expect(chip).toHaveAttribute("data-status", status)
  })

  it("uses a different tone for done, error and awaiting_decision", () => {
    const tones = ROW_STATUSES.map((status) => {
      const { container, unmount } = renderIntl(<RowStatusChip status={status} />)
      const cls = container.querySelector("[data-status]")!.className
      unmount()
      return [status, cls] as const
    })
    const byStatus = Object.fromEntries(tones)
    expect(byStatus.done).toContain("emerald")
    expect(byStatus.error).toContain("red")
    expect(byStatus.awaiting_decision).toContain("amber")
    expect(new Set([byStatus.done, byStatus.error, byStatus.awaiting_decision]).size).toBe(3)
  })

  it("adds the instance number for a multi-instance row", () => {
    renderIntl(<RowStatusChip status="done" instanceIndex={2} showIndex />)
    expect(screen.getByText("#3")).toBeInTheDocument()
  })

  it("is translated", () => {
    renderIntl(<RowStatusChip status="awaiting_decision" />, "uk")
    expect(screen.getByText("Чекає на рішення")).toBeInTheDocument()
  })
})

describe("ProjectStatusChip", () => {
  it.each(["running", "completed", "failed"] as const)("shows %s", (status) => {
    renderIntl(<ProjectStatusChip status={status} />)
    expect(screen.getByText(MESSAGES.en.Status.project[status])).toHaveAttribute("data-status", status)
  })
})
