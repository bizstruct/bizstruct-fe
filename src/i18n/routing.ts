import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"
import { DEFAULT_LOCALE, LOCALES } from "./locales"

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
})

export type Locale = (typeof routing.locales)[number]

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
