import { describe, expect, it } from "vitest"
import { decide } from "./route-guard"

describe("route guard", () => {
  it("sends a visitor without a session to the login page of the same locale", () => {
    expect(decide("/uk", false)).toEqual({ action: "redirect", to: "/uk/login" })
    expect(decide("/en/project/abc", false)).toEqual({ action: "redirect", to: "/en/login" })
  })

  it("lets a visitor without a session reach login and register", () => {
    expect(decide("/uk/login", false)).toEqual({ action: "next" })
    expect(decide("/en/register", false)).toEqual({ action: "next" })
    expect(decide("/en/register/", false)).toEqual({ action: "next" })
  })

  it("lets a signed-in user in and keeps them off the login and register pages", () => {
    expect(decide("/uk", true)).toEqual({ action: "next" })
    expect(decide("/uk/project/abc", true)).toEqual({ action: "next" })
    expect(decide("/uk/login", true)).toEqual({ action: "redirect", to: "/uk" })
    expect(decide("/en/register", true)).toEqual({ action: "redirect", to: "/en" })
  })

  it("leaves an unprefixed path to next-intl, which redirects it first", () => {
    expect(decide("/", false)).toEqual({ action: "next" })
    expect(decide("/project/abc", false)).toEqual({ action: "next" })
  })
})
