import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// There used to be a `rewrites()` config here — a blanket
// `beforeFiles` rewrite of `/api/:path*` straight to
// `process.env.API_BASE_URL ?? "http://localhost:8000"`, from before every
// block had its own `src/app/api/**/route.ts` handler. `beforeFiles`
// rewrites are matched ahead of the filesystem, so it silently intercepted
// every request to `/api/*` before any route handler ever ran — every
// route handler's mock-gating, error handling, and (after this task)
// ApiResult/backend-client logic was dead code, and every request to a
// missing/misconfigured backend got Next's own generic proxy failure
// instead of any of this app's error handling. It also carried its own
// undocumented `?? "http://localhost:8000"` fallback — a second instance
// of exactly the defect this task's transport unification removed from
// actions.ts. Every path it used to cover now has a real route handler
// (verified against every API_ROUTES entry), so it's removed rather than
// fixed in place.
const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
