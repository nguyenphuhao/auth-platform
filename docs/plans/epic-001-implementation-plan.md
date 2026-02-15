# EPIC-001 Implementation Plan (Foundation)

- Source tech design: `docs/tech-design/epic-001-foundation-tech-design.md`
- Scope: `US-001`, `US-002`, `US-003`, `US-004`

## Sprint Goal
Complete architecture foundation, security boundaries, OpenAPI/Swagger baseline, UI foundation, and enforceable security gates for EPIC-001.

## Workstream A - Project Boundaries (`US-001`)
1. Create standardized route groups for `public`, `admin`, and `api`.
2. Create module boundaries in `lib`: `supabase`, `auth`, `logging`, `config`.
3. Create base app shell structure for public and admin areas.
4. Add guardrails for cross-boundary imports (lint/restricted imports).
5. Establish migration structure and naming convention for versioned SQL delivery.
6. Add baseline migration for required schema:
   - `profiles`
   - `auth_login_events`
7. Add required indexes for `profiles` search and `auth_login_events` history queries.

## Workstream B - Supabase Client Separation (`US-002`)
1. Implement:
   - `createBrowserClient()`
   - `createServerClient()`
   - `createAdminClient()`
2. Mark admin client modules as server-only.
3. Prevent admin client imports in browser/client code paths.
4. Add tests for context-correct client usage.
5. Enable RLS on `profiles` and `auth_login_events`.
6. Define baseline policies for row ownership allow/deny behavior on both tables.

## Workstream C - Environment Validation (`US-003`)
1. Define env schema for dev/test/staging/prod.
2. Enforce fail-fast startup on missing/invalid env.
3. Add `.env.example` and `.env.test.example`.
4. Document environment setup and usage.
5. Standardize Supabase env names:
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
6. Add backward-compatible env mapping from legacy names and mark them deprecated.
7. Add pre-deploy validation for migration/policy presence (schema + RLS artifacts).
8. Mark failed schema/RLS validation as release-blocking.
9. Add docs env flags:
   - `API_DOCS_ENABLED`
   - `API_DOCS_REQUIRE_ADMIN`
   - `API_DOCS_ALLOW_IN_PROD`

## Workstream D - OpenAPI + Swagger Baseline (`US-001`, `US-002`, `US-003`, `US-004`)
1. Create EPIC-001 OpenAPI spec covering:
   - `/api/auth/otp/request`
   - `/api/auth/otp/verify`
   - `/api/admin/users`
   - `/api/admin/users/{id}/disable`
   - `/api/admin/users/{id}/delete`
   - `/api/admin/users/{id}/login-events`
2. Define security scheme:
   - `bearerAuth` for `/api/admin/*` operations
   - no admin secret key examples in spec/docs
3. Add machine-readable spec endpoint at `/api/openapi`.
4. Add Swagger UI page at `/docs/api`.
5. Implement shared guard policy for docs routes:
   - disabled by default in production
   - optional admin-only enforcement when enabled
6. Ensure docs layer does not change OTP/session/auth semantics.

## Workstream E - Admin Guard (Defense in Depth) (`US-004`)
1. Add middleware protection for `/admin/*`.
2. Implement `assertAdmin()` for all `/api/admin/*` handlers.
3. Standardize unauthorized/forbidden response contracts.
4. Prepare admin/non-admin fixtures for test execution.
5. Ensure every `/api/admin/*` route verifies guard execution before domain operations.

## Workstream F - UI Foundation (Layout + Tokens)
1. Define token source (CSS variables): light/dark + app accent variants.
2. Map semantic tokens into Tailwind configuration.
3. Build base token-compliant components:
   - button, input, card, table, dialog, toast, loading states
4. Implement public auth layout and admin shell responsive patterns.
5. Apply accessibility baseline (focus ring, contrast, touch targets).

## Workstream G - Local and Integration Test Harness
1. Add scripts to start local Supabase, reset DB, and seed fixtures.
2. Configure integration test runner for route handlers.
3. Use fake OTP provider in local/test for deterministic behavior.
4. Add minimum integration coverage:
   - admin route/API access control
   - docs route access control (`/docs/api`, `/api/openapi`)
   - env validation boot behavior
   - role guard enforcement
   - OpenAPI artifact existence and endpoint coverage
   - migration/policy existence checks for `profiles` and `auth_login_events`
   - RLS allow/deny behavior for owner vs non-owner access
5. Add fixture matrix: unauthenticated, authenticated owner, authenticated non-owner, admin.

## Workstream H - CI Quality Gates
1. Run unit and integration tests in CI.
2. Run OpenAPI lint/validation in CI.
3. Run migration/policy existence checks in CI.
4. Run RLS behavior integration tests in CI.
5. Run docs route guard integration tests in CI.
6. Run admin guard enforcement tests in CI.
7. Add explicit fail-fast CI conditions for EPIC-001 security gates.
8. Add secret-key leakage checks (client bundle/static checks + docs/spec scanning).
9. Block merge on security/auth test failures.
10. Publish test logs/artifacts for failure diagnosis.

## Recommended Execution Order
1. A -> B
2. C (after A/B migration baseline exists)
3. D (after B/C)
4. E (after D; keep admin checks authoritative)
5. F (in parallel with E where possible)
6. G -> H
7. Final documentation, QA sign-off, and go/no-go review

## Swagger/OpenAPI Proposal (EPIC-001)
1. OpenAPI source of truth:
   - `src/lib/openapi/foundation.openapi.ts` (or YAML equivalent)
2. Spec endpoint:
   - `GET /api/openapi` from `src/app/api/openapi/route.ts`
3. Swagger UI page:
   - `GET /docs/api` from `src/app/docs/api/page.tsx`
4. Shared guard:
   - `src/lib/security/api-docs-guard.ts`
5. Environment controls:
   - `API_DOCS_ENABLED`
   - `API_DOCS_REQUIRE_ADMIN`
   - `API_DOCS_ALLOW_IN_PROD`

## Test and Security Gate Proposal (Swagger Extension)
1. OpenAPI schema validation/lint:
   - fail when schema invalid or required foundation paths missing
2. Integration tests:
   - allow/deny behavior for `/docs/api` and `/api/openapi`
   - admin API guard behavior remains enforced
3. CI no-go conditions:
   - OpenAPI lint invalid
   - docs route guard test fail
   - admin guard fail
   - secret leakage pattern detected in client/docs/spec

## US Mapping + AC Status (Current Patch Set)
1. `US-001` - Structure/docs location: **Partial**
   - Planned structure, endpoint coverage, and file layout are defined in docs.
   - Code scaffold for `/api/openapi` and `/docs/api` is pending repository application layer setup.
2. `US-002` - Server-only safety + no secret leakage: **Partial**
   - Security constraints and forbidden patterns are now explicit in requirements/design/CI plan.
   - Enforcement scripts/tests in codebase are pending implementation.
3. `US-003` - Env flags by environment: **Partial**
   - `API_DOCS_*` flags and behavior matrix are documented.
   - Runtime env validation implementation is pending.
4. `US-004` - Admin route/API protection enforced: **Partial**
   - Docs and tests now require docs guard + existing admin guard preservation.
   - Route-level and integration implementation is pending.

## File-by-File Patch Plan + Applied Changes
1. `docs/requirements/epic-001-foundation.md`
   - Applied: add OpenAPI/Swagger scope, docs route protection AC, docs env flags, and OpenAPI/secret-leak CI gates.
2. `docs/tech-design/epic-001-foundation-tech-design.md`
   - Applied: add technical design for OpenAPI artifact, `/api/openapi`, `/docs/api`, security scheme, and guard policy.
   - Applied: add test strategy and CI fail conditions for schema lint + docs route allow/deny.
3. `docs/plans/epic-001-implementation-plan.md`
   - Applied: add dedicated Swagger/OpenAPI workstream, US mapping status, and go/no-go criteria with Swagger gates.
4. Planned code files (next execution pass in app codebase):
   - `src/lib/openapi/foundation.openapi.ts` (or `.yaml`)
   - `src/lib/security/api-docs-guard.ts`
   - `src/app/api/openapi/route.ts`
   - `src/app/docs/api/page.tsx`
   - tests under `tests/integration/docs-route.*` and OpenAPI lint script in CI

## Definition of Done
1. EPIC-001 user stories satisfy accepted AC.
2. Security boundaries and secret-key constraints are enforced.
3. OpenAPI spec and Swagger UI are available only under approved guard policy.
4. UI foundation uses tokenized theme system (no scattered hardcoded styles).
5. Local + CI tests are stable and required gates are active.
6. Setup/runbook docs are complete for onboarding and execution.

## Final Go/No-Go Criteria (EPIC-001)

Go:
1. `US-001..US-004` AC are fully met with no partial security exceptions.
2. `profiles` and `auth_login_events` required schema and indexes are present in versioned migrations.
3. RLS is enabled and policies are defined for both tables.
4. Migration/policy existence checks pass in CI.
5. OpenAPI lint/validation passes in CI with required endpoint/security coverage.
6. Integration tests prove allowed/denied paths by role and ownership (RLS + docs guards + admin guard).
7. QA issues go signal and Security issues must-pass signal.

No-go:
1. Any missing required schema/index/policy artifact for the two required tables.
2. OpenAPI schema invalid or missing required foundation endpoints/security scheme.
3. Any failing RLS allow/deny integration test.
4. Any failing docs route guard test or admin middleware/API guard test.
5. Any detected secret-key leakage risk in client code paths or docs/spec artifacts.
