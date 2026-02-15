# AGENTS.md

## Purpose
This file defines repository-level engineering guardrails and coding conventions.
It is intentionally feature-agnostic and should remain stable across EPICs.

## What This File Is Not
- Not a feature roadmap.
- Not a story execution order.
- Not a substitute for requirements and technical design docs.

Feature scope, priority, and acceptance criteria belong in:
- `docs/requirements/*`
- `docs/tech-design/*`
- `docs/plans/*`

## Decision Priority
1. Security
2. Correctness
3. Maintainability and extensibility
4. Reusability
5. UX
6. Delivery speed

If a requirement is ambiguous and impacts auth, security, API contracts, or data model, stop and ask.

## Mandatory Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui + lucide-react
- Supabase Auth + Supabase PostgreSQL
- Next.js Route Handlers for privileged backend operations
- Vercel deployment with env-driven configuration

## Architecture Invariants
- Keep one repo and one deployable app with explicit boundaries.
- Route boundaries:
  - Public auth APIs under `/api/auth/*`
  - Admin APIs under `/api/admin/*`
- Keep privileged logic in server-only modules.
- Keep UI, API, domain, and data-access concerns separated.
- Keep product-specific behavior config-driven; no hardcoded app identity logic.
- Do not bypass domain services for access control, rate limiting, logging, or policy checks.

## Security Baseline
- `SUPABASE_SECRET_KEY` is server-only and must never appear in client bundles.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the only client-safe Supabase key.
- Protect `/admin/*` with both middleware and server-side role checks.
- Enforce admin checks in every `/api/admin/*` route handler.
- RLS must be enabled for `profiles` and `auth_login_events`.
- OTP anti-abuse controls are mandatory for OTP flows.
- Logging remains best effort and must not break auth outcomes.
- Never expose provider-internal errors or secrets to clients.

## Supabase Key Standard
- Project endpoint: `NEXT_PUBLIC_SUPABASE_URL`
- Client-safe key: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Server-only privileged key: `SUPABASE_SECRET_KEY`
- Legacy temporary mapping:
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` -> `SUPABASE_SECRET_KEY`

## Environment and Configuration Conventions
- Centralize env parsing and validation in one typed module.
- Fail fast at startup on missing or invalid required env vars.
- Apply the same validation standard in dev, preview, test, and prod.
- Keep config declarative and environment-driven.
- Do not hardcode environment-specific behavior in feature modules.

## Data and Migration Conventions
- Use explicit, versioned SQL migrations.
- Prefer additive, backward-compatible migration strategy.
- Include indexes needed for expected query patterns.
- Treat RLS and policies as part of schema completion.
- Never run destructive migrations without explicit approval.
- Document rollback considerations for non-trivial schema changes.

## API and Error Conventions
- Keep handlers thin; move business rules to domain/service modules.
- Keep response contracts stable and explicit.
- Normalize provider errors into product-safe error categories.
- Use pagination for list/history endpoints by default.
- Avoid leaking internal implementation details in API responses.

## Code Conventions
- Prefer small, composable modules over large multipurpose files.
- Enforce strict typing for boundary interfaces.
- Keep naming consistent:
  - kebab-case for files
  - PascalCase for React components
  - camelCase for variables/functions
- Keep side effects at boundaries; keep domain logic deterministic where possible.
- Comments must explain non-obvious intent, rationale, or tradeoffs (`why`), not restate code (`what`).
- Avoid noisy comments for obvious operations (assignments, simple conditionals, straightforward loops).
- Prefer clear naming and extraction over explanatory comments.
- For complex logic, use one short high-value comment before the block instead of many line-by-line comments.
- Avoid hidden cross-layer dependencies.

## Testing and Quality Gates
Minimum coverage expectation:
- Unit tests:
  - Access-control and policy decisions
  - Env validation behavior
  - Core business-rule branches
- Integration tests:
  - Auth and admin API flows
  - Authorization allow/deny paths
  - Pagination/sorting behavior for list/history endpoints
- Security tests:
  - Admin route protection
  - Non-admin denial for admin APIs
  - Migration/policy existence checks for `profiles` and `auth_login_events`
  - RLS allow/deny checks for owner/non-owner row access
  - No secret-key leakage to client bundles

CI merge gate should fail on security or contract regressions.

## Change Management
- Prefer small, reviewable changes with clear scope.
- Preserve backward compatibility unless explicitly approved otherwise.
- For contract changes, include migration and rollout notes.
- For each change summary, include:
  - impacted modules/contracts
  - migration/policy impact
  - security impact
  - test coverage added or updated

## Definition of Done (Generic)
A change is done only when:
- Behavior matches accepted requirements for its scope.
- Relevant tests pass for changed behavior.
- Security constraints remain intact.
- Required env/config updates are documented.
- No secrets are committed or exposed.
- Operationally risky changes include rollback notes.

## Ask Before Proceeding
Always ask before:
- Destructive data changes or irreversible delete strategy changes
- Auth/session semantic changes
- Relaxing security controls for convenience
- Breaking API contract changes that impact clients
- Disabling or bypassing required quality gates
