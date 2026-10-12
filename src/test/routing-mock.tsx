import type { ReactNode } from "react"
import { vi } from "vitest"

/** What the tests use in place of @/i18n/routing (which needs the Next app router): vi.mock("@/i18n/routing", () => routingMock). */
export const router = { push: vi.fn(), replace: vi.fn(), back: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), forward: vi.fn() }

export const routingMock = {
  Link: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useRouter: () => router,
  usePathname: () => "/",
  redirect: vi.fn(),
  getPathname: vi.fn(),
  routing: { locales: ["uk", "en"], defaultLocale: "uk" },
}
