import { fireEvent, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { router } from "@/test/routing-mock"
import { renderIntl } from "@/test/render"
import { AuthForm } from "./auth-form"

vi.mock("@/i18n/routing", async () => (await import("@/test/routing-mock")).routingMock)
const api = vi.hoisted(() => ({ login: vi.fn(), register: vi.fn() }))
vi.mock("@/lib/api/auth", () => api)

beforeEach(() => {
  api.login.mockReset()
  api.register.mockReset()
  Object.values(router).forEach((fn) => fn.mockReset())
})

const fill = (email: string, password: string) => {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } })
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } })
}

describe("login", () => {
  it("signs in and goes to the home page", async () => {
    api.login.mockResolvedValue({ ok: true, data: { ok: true } })
    renderIntl(<AuthForm mode="login" />)
    fill(" ann@example.com ", "pw-12345678")
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }))
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/"))
    expect(api.login).toHaveBeenCalledWith("ann@example.com", "pw-12345678")
  })

  it("shows a wrong-password message and stays", async () => {
    api.login.mockResolvedValue({ ok: false, kind: "unauthorized", status: 401, detail: "Invalid credentials" })
    renderIntl(<AuthForm mode="login" />)
    fill("ann@example.com", "wrong-password")
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }))
    expect(await screen.findByRole("alert")).toHaveTextContent("Wrong email or password")
    expect(router.replace).not.toHaveBeenCalled()
  })

  it("shows that the server is unreachable", async () => {
    api.login.mockResolvedValue({ ok: false, kind: "network", status: 0, detail: "offline" })
    renderIntl(<AuthForm mode="login" />)
    fill("ann@example.com", "pw-12345678")
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }))
    expect(await screen.findByRole("alert")).toHaveTextContent("The server is unreachable")
  })

  it("has no name field and links to registration", () => {
    renderIntl(<AuthForm mode="login" />)
    expect(screen.queryByLabelText(/Name/)).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Create account" })).toHaveAttribute("href", "/register")
  })
})

describe("register", () => {
  it("creates the account (name optional) and goes home", async () => {
    api.register.mockResolvedValue({ ok: true, data: { ok: true } })
    renderIntl(<AuthForm mode="register" />)
    fill("ann@example.com", "pw-12345678")
    fireEvent.change(screen.getByLabelText("Name (optional)"), { target: { value: "Ann" } })
    fireEvent.click(screen.getByRole("button", { name: "Create account" }))
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith("/"))
    expect(api.register).toHaveBeenCalledWith("ann@example.com", "pw-12345678", "Ann")
  })

  it("reports an email that is already registered", async () => {
    api.register.mockResolvedValue({ ok: false, kind: "conflict", status: 409, detail: "exists" })
    renderIntl(<AuthForm mode="register" />)
    fill("ann@example.com", "pw-12345678")
    fireEvent.click(screen.getByRole("button", { name: "Create account" }))
    expect(await screen.findByRole("alert")).toHaveTextContent("already exists")
  })

  it("is available in Ukrainian", () => {
    renderIntl(<AuthForm mode="register" />, "uk")
    expect(screen.getByRole("heading", { name: "Створення облікового запису" })).toBeInTheDocument()
  })
})
