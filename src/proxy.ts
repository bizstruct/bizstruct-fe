import { NextResponse, type NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { decide } from "./lib/route-guard"
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./lib/server/session"

const handleI18nRouting = createMiddleware(routing)

export function proxy(request: NextRequest) {
  // Signed in = a session cookie exists. The tokens themselves are checked (and refreshed) by be on
  // the first API call; a stale cookie ends up on the login page through the 401 handling there.
  const signedIn = request.cookies.has(REFRESH_COOKIE) || request.cookies.has(ACCESS_COOKIE)
  const decision = decide(request.nextUrl.pathname, signedIn)
  if (decision.action === "redirect") return NextResponse.redirect(new URL(decision.to, request.url))
  return handleI18nRouting(request)
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
