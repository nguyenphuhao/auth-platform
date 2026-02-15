# EPIC-001 Implementation Plan (Foundation)

- Source tech design: `docs/tech-design/epic-001-foundation-tech-design.md`
- Scope: `US-001`, `US-002`, `US-003`, `US-004`

## Sprint Goal
Complete architecture foundation, security boundaries, UI foundation, and test harness for EPIC-001.

## Workstream A - Project Boundaries (`US-001`)
1. Create standardized route groups for `public`, `admin`, and `api`.
2. Create module boundaries in `lib`: `supabase`, `auth`, `logging`, `config`.
3. Create base app shell structure for public and admin areas.
4. Add guardrails for cross-boundary imports (lint/restricted imports).

## Workstream B - Supabase Client Separation (`US-002`)
1. Implement:
   - `createBrowserClient()`
   - `createServerClient()`
   - `createAdminClient()`
2. Mark admin client modules as server-only.
3. Prevent admin client imports in browser/client code paths.
4. Add tests for context-correct client usage.

## Workstream C - Environment Validation (`US-003`)
1. Define env schema for dev/test/staging/prod.
2. Enforce fail-fast startup on missing/invalid env.
3. Add `.env.example` and `.env.test.example`.
4. Document environment setup and usage.

## Workstream D - Admin Guard (Defense in Depth) (`US-004`)
1. Add middleware protection for `/admin/*`.
2. Implement `assertAdmin()` for all `/api/admin/*` handlers.
3. Standardize unauthorized/forbidden response contracts.
4. Prepare admin/non-admin fixtures for test execution.

## Workstream E - UI Foundation (Layout + Tokens)
1. Define token source (CSS variables): light/dark + app accent variants.
2. Map semantic tokens into Tailwind configuration.
3. Build base token-compliant components:
   - button, input, card, table, dialog, toast, loading states
4. Implement public auth layout and admin shell responsive patterns.
5. Apply accessibility baseline (focus ring, contrast, touch targets).

## Workstream F - Local and Integration Test Harness
1. Add scripts to start local Supabase, reset DB, and seed fixtures.
2. Configure integration test runner for route handlers.
3. Use fake OTP provider in local/test for deterministic behavior.
4. Add minimum integration coverage:
   - admin route/API access control
   - env validation boot behavior
   - role guard enforcement

## Workstream G - CI Quality Gates
1. Run unit and integration tests in CI.
2. Add service-role leakage checks (client bundle/static checks).
3. Block merge on security/auth test failures.
4. Publish test logs/artifacts for failure diagnosis.

## Recommended Execution Order
1. A -> B -> C
2. D (after B/C)
3. E (in parallel with D where possible)
4. F -> G
5. Final documentation and DoD check

## Definition of Done
1. EPIC-001 user stories satisfy accepted AC.
2. Security boundaries and service-role constraints are enforced.
3. UI foundation uses tokenized theme system (no scattered hardcoded styles).
4. Local + CI tests are stable and required gates are active.
5. Setup/runbook docs are complete for onboarding and execution.
