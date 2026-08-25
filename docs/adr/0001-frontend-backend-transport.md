# 0001. Frontend-to-backend transport: proxy routes as the single default

## Status

Accepted

## Context

The frontend had two parallel mechanisms for talking to bizstruct-be:

1. **Proxy routes** (`src/app/api/**/route.ts`) — a Next.js route handler
   per backend endpoint, forwarding the request server-side and returning
   the backend's response (status code included) to the browser. Used for
   every generation block except one: architecture, empathy_map, scenario,
   pitch, hypotheses, canvas, what_if, plus the project list.
2. **Server Actions** (`src/app/actions.ts`, `"use server"`) — plain async
   functions called directly from client components, executed server-side.
   Used for exactly one flow: creating a project from an idea, fetching a
   project during the generation-polling loop, and the `models_options`
   mutations (select/save/regenerate/validate).

Investigating *why* the second mechanism exists turned up no technical
reason tied to what Server Actions actually provide over route handlers —
progressive `<form action={fn}>` enhancement, streaming responses, or
response caching semantics. None of that is in use: every one of
`actions.ts`'s six functions was called as a plain function from client-side
code (`use-project-store.ts`, `ModelSelectionScreen.tsx`), the same way a
`fetch()` to a proxy route would be called. The two mechanisms run in the
same execution context (the Next.js server) and differ only in *how* a
request reaches that code — a URL route vs. a direct RPC-style call — not in
what either can do here.

What differed was error-handling quality, and it differed by omission, not
design: `actions.ts`'s mutations didn't check `response.ok`, didn't return a
result, and didn't throw — a `422` or a dead backend looked identical to
success. Its reads collapsed `404`, `500`, a network failure, and invalid
JSON into a single `null`. It had a hardcoded `?? "http://localhost:8000"`
fallback that the route handlers never had. None of this is a property of
Server Actions as a mechanism — it's what happens when the same
request/response handling logic gets implemented twice, and only one copy
keeps getting the fixes the other one already has. `RawProjectResponse`'s
`modelsOptions: ModelsOptionsPayload | null` field further duplicated a
type that `npm run sync:domain` already generates from bizstruct-domain,
with no mechanism to catch it drifting.

## Decision

**Proxy routes are the single default transport.** Every frontend-to-backend
call goes through a `src/app/api/**/route.ts` handler; the browser never
calls Server Actions to reach bizstruct-be, and `src/app/actions.ts` no
longer exists.

Concretely:

- `createProjectFromIdea`, `fetchProjectById`, `selectProjectModel`,
  `saveModelsEdits`, `triggerRegenerateModels`, and `triggerValidateModel`
  moved from `actions.ts` into `src/services/generation.ts`, calling new
  proxy routes (`POST /api/generation`, `GET`/`PATCH /api/projects/[id]`,
  `POST /api/generation/[projectId]/regenerate`,
  `POST /api/models/[projectId]/validate`) the same way every other
  service (`services/architecture.ts`, `services/canvas.ts`, ...) already
  calls its own block's routes.
- Every route handler's outbound call to bizstruct-be goes through one
  shared server-side client, `src/lib/backend-client.ts` — replacing each
  handler's own copy-pasted `fetch(...)` + status-forwarding boilerplate.
  The browser-side client, `src/services/api-client.ts`, gained the same
  `ApiResult`/timeout/no-fallback properties (see ADR-shaped detail below)
  so both hops of a request (browser → this app's route, route → backend)
  are handled by the same design, not just the same intent.
- `src/app/api/projects/[id]/route.ts` gained a real `GET` and `PATCH`
  (previously only `DELETE` existed, and that `DELETE` didn't even call the
  backend — it unconditionally returned `{ok: true}`; fixed while touching
  this file for the same reason `selectProjectModel`/`saveModelsEdits`
  needed it).

No exception was found worth keeping on Server Actions. If a future flow
genuinely needs progressive form enhancement without JavaScript, or
streaming, that would be a deliberate, documented exception here — not a
silent reversion to a second mechanism.

**Scope note:** `what_if`'s two route handlers
(`src/app/api/what-if/[projectId]/route.ts` and its `[scenarioId]` child)
were deliberately *not* migrated onto `backend-client.ts` in this pass — a
parallel task is rewriting `what_if` for ERRC, and touching its routes here
risked a merge conflict for no benefit to this task's goals. They still work
exactly as before (a hand-rolled `fetch` to `API_BASE_URL`, no fallback, no
mock); migrating them is a small follow-up once that task lands.

## Consequences

**Positive:**
- One request-handling implementation per hop, not two per flow. A fix to
  timeout handling, error classification, or mock-gating lands once and
  applies everywhere, instead of needing to be remembered for a second
  mechanism.
- `ApiResult<T>` (see `src/lib/api-result.ts`) makes a caller's response
  handling explicit: `ok`, `not_found`, `validation` (with the backend's own
  violation list attached), `server`, `network`, `timeout`, or `config`.
  Nothing collapses into an ambiguous `null` or a generic thrown `Error`
  anymore.
- No more localhost fallback anywhere. A missing `API_BASE_URL` fails the
  first request it's needed for with an explicit message, rather than
  quietly proxying to `http://localhost:8000` in a real deployment.
- `ModelsOptionsPayload` is now `Omit<ModelsOptions, "options"> & { options:
  BusinessModelOption[] }` — derived from the generated domain type, so a
  field rename in `bizstruct-domain` breaks this at compile time instead of
  drifting silently. Likewise `triggerValidateModel`'s field list is a
  `Pick<BusinessModelOption, ...>`, not five independently-typed function
  parameters.

**Trade-offs accepted:**
- `services/api-client.ts`'s pre-existing `apiGet`/`apiPost`/`apiPut`/
  `apiPatch`/`apiDelete` (used by the 8 blocks that were already on proxy
  routes) were **not** rewritten to expose `ApiResult` to their many
  existing call sites — that would have meant updating every consuming
  component across 8 blocks, which is a different, much larger task with no
  named defect motivating it here. They're now thin wrappers over the same
  underlying `apiRequest()` (so they get its timeout and consistent error
  classification for free), preserving their existing contract (404 → null,
  other failures → throw) for backward compatibility. New code should call
  `apiRequest`/`ApiResult` directly, as `services/generation.ts` does.
- `what_if`'s routes still duplicate the fetch-and-forward boilerplate
  `backend-client.ts` was meant to replace, for the reason noted above.

## Alternatives considered

- **Keep both mechanisms, fix `actions.ts` in place.** Rejected: this was
  the literal ask ("convert what can reasonably converge onto one
  mechanism"), and no reasonable exception justifying Server Actions here
  was found. Keeping two mechanisms after concluding one has no reason to
  exist would just preserve the original problem under better-behaved code.
- **Convert everything (including the other 8 blocks + what_if) onto Server
  Actions instead of proxy routes.** Rejected: proxy routes were already the
  established, dominant pattern (8 of 9 blocks); moving the majority to
  match the minority is more churn for no behavioral gain, and Server
  Actions have real constraints proxy routes don't (always POST under the
  hood, body size limits, less natural fit for a `GET`-shaped read) that
  don't matter for a single-block mutation but would for the read-heavy
  majority of this app's calls.
