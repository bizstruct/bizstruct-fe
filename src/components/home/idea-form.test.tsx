import { fireEvent, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { router } from "@/test/routing-mock"
import { renderIntl } from "@/test/render"
import { IDEA_MAX, IDEA_MIN, ideaFormSchema, ideaProblem } from "@/lib/validation/idea"
import { IdeaForm } from "./idea-form"

vi.mock("@/i18n/routing", async () => (await import("@/test/routing-mock")).routingMock)
const createProject = vi.hoisted(() => vi.fn())
vi.mock("@/lib/api/projects", () => ({ createProject }))

const idea = (length: number) => "a".repeat(length)

beforeEach(() => {
  createProject.mockReset()
  Object.values(router).forEach((fn) => fn.mockReset())
})

describe("ideaProblem (50-2000 characters)", () => {
  it.each([
    [0, "tooShort"],
    [IDEA_MIN - 1, "tooShort"],
    [IDEA_MIN, null],
    [IDEA_MAX, null],
    [IDEA_MAX + 1, "tooLong"],
  ])("a %i character idea -> %s", (length, expected) => {
    expect(ideaProblem(idea(length))).toBe(expected)
  })

  it("counts the trimmed text, as be does", () => {
    expect(ideaProblem(`   ${idea(IDEA_MIN - 1)}   `)).toBe("tooShort")
    expect(ideaProblem(`   ${idea(IDEA_MIN)}   `)).toBeNull()
  })

  it("the zod schema agrees", () => {
    const form = { language: "en", enabledOptional: [], autoApprove: false } as const
    expect(ideaFormSchema.safeParse({ ...form, idea: idea(IDEA_MIN) }).success).toBe(true)
    expect(ideaFormSchema.safeParse({ ...form, idea: idea(IDEA_MIN - 1) }).success).toBe(false)
    expect(ideaFormSchema.safeParse({ ...form, idea: idea(IDEA_MAX + 1) }).success).toBe(false)
    expect(ideaFormSchema.safeParse({ ...form, idea: idea(IDEA_MIN), enabledOptional: ["team_info"] }).success).toBe(false)
  })
})

describe("IdeaForm", () => {
  it("shows the character counter and, after a failed submit, why the idea is rejected", async () => {
    renderIntl(<IdeaForm />)
    fireEvent.change(screen.getByLabelText("Your idea"), { target: { value: "too short" } })
    expect(screen.getByText("9 / 2000 characters (at least 50)")).toBeInTheDocument()

    fireEvent.submit(screen.getByRole("button", { name: "Start generation" }).closest("form")!)

    expect(await screen.findByRole("alert")).toHaveTextContent("The idea must be at least 50 characters")
    expect(createProject).not.toHaveBeenCalled()
  })

  it("rejects an idea over 2000 characters", async () => {
    renderIntl(<IdeaForm />)
    fireEvent.change(screen.getByLabelText("Your idea"), { target: { value: idea(IDEA_MAX + 1) } })
    fireEvent.submit(screen.getByRole("button", { name: "Start generation" }).closest("form")!)
    expect(await screen.findByRole("alert")).toHaveTextContent("at most 2000")
    expect(createProject).not.toHaveBeenCalled()
  })

  it("offers only business case and environment scan, and hides auto-approve under Advanced", async () => {
    renderIntl(<IdeaForm />)
    expect(screen.getByLabelText("Business case")).toBeInTheDocument()
    expect(screen.getByLabelText("Environment scan")).toBeInTheDocument()
    expect(screen.queryByLabelText("Team")).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Approve automatically/)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Advanced" }))
    expect(screen.getByLabelText(/Approve automatically/)).not.toBeChecked()
  })

  it("starts the generation with the chosen options and opens the project", async () => {
    createProject.mockResolvedValue({ ok: true, data: { id: "p-123" } })
    renderIntl(<IdeaForm />, "en")
    fireEvent.change(screen.getByLabelText("Your idea"), { target: { value: `  ${idea(60)}  ` } })
    fireEvent.click(screen.getByLabelText("Environment scan"))
    fireEvent.click(screen.getByRole("button", { name: "Advanced" }))
    fireEvent.click(screen.getByLabelText(/Approve automatically/))
    fireEvent.click(screen.getByLabelText("Ukrainian"))

    fireEvent.click(screen.getByRole("button", { name: "Start generation" }))

    await waitFor(() => expect(createProject).toHaveBeenCalledOnce())
    expect(createProject).toHaveBeenCalledWith({ idea: idea(60), language: "uk", enabledOptional: ["environment_scan"], autoApprove: true })
    expect(router.push).toHaveBeenCalledWith("/project/p-123")
  })

  it("defaults to the language of the interface", () => {
    renderIntl(<IdeaForm />, "uk")
    expect(screen.getByLabelText("Українська")).toBeChecked()
  })

  it("shows be's validation message and stays on the page when the request fails", async () => {
    createProject.mockResolvedValue({ ok: false, kind: "validation", status: 422, detail: "idea: too short" })
    renderIntl(<IdeaForm />)
    fireEvent.change(screen.getByLabelText("Your idea"), { target: { value: idea(60) } })
    fireEvent.click(screen.getByRole("button", { name: "Start generation" }))
    expect(await screen.findByRole("alert")).toHaveTextContent("idea: too short")
    expect(router.push).not.toHaveBeenCalled()
  })
})
