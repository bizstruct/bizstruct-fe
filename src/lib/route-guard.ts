// Which pages need a session. Pure, so proxy.ts stays thin and the rule is tested.

import { LOCALES } from "@/i18n/locales"

export const PUBLIC_PAGES = ["/login", "/register"] as const

export type GuardDecision = { action: "next" } | { action: "redirect"; to: string }

/** `pathname` includes the locale prefix (next-intl `localePrefix: always`). */
export function decide(pathname: string, signedIn: boolean): GuardDecision {
  const [, first, ...rest] = pathname.split("/")
  const locale = (LOCALES as readonly string[]).includes(first) ? first : null
  if (!locale) return { action: "next" } // next-intl redirects an unprefixed path first
  const page = "/" + rest.join("/")
  const isPublic = (PUBLIC_PAGES as readonly string[]).includes(page.replace(/\/+$/, "") || "/")
  if (!signedIn && !isPublic) return { action: "redirect", to: `/${locale}/login` }
  if (signedIn && isPublic) return { action: "redirect", to: `/${locale}` }
  return { action: "next" }
}
