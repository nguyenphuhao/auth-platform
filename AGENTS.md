# AGENTS.md

## Mission
Build a reusable Auth and User Management platform template for multi-app deployment using one codebase and config-driven environments.

## Scope (Current Phase)
In scope:
- Phone SMS OTP authentication (passwordless)
- Admin portal user management
- Login history and basic device visibility
- Security baseline for auth/admin flows
- Multi-app reusability through env and theme tokens

Out of scope:
- Social login
- Realtime force logout
- Advanced RBAC and multi-tenant auth in one shared pool
- Billing/subscription features

## Canonical Sources
- Product requirements and EPIC pages in Notion
- Technical stack requirement in Notion
- Architecture decision record: `docs/adr/adr-0001-auth-platform-architecture.md`

Conflict priority:
1. Security
2. Correctness
3. Reusability
4. UX
5. Delivery speed

If a requirement is ambiguous and impacts auth, security, or data model, stop and ask.

## Mandatory Tech Stack
- Next.js (App Router)
- Tailwind CSS + shadcn/ui + lucide-react
- Supabase Auth + Supabase PostgreSQL
- Next.js Route Handlers for privileged backend operations
- Vercel deployment with env-driven configuration

## Execution Model (Track by User Story IDs)
Implement in this order unless user explicitly reprioritizes:

1. Foundation
   - `US-001`, `US-002`, `US-003`, `US-004`
2. EPIC 1 (Phone OTP)
   - `US-101`, `US-102`, `US-103`, `US-104`
3. EPIC 2 (Admin User Management)
   - `US-201`, `US-202`, `US-203`, `US-204`, `US-205`
4. EPIC 3 (Login History)
   - `US-301`, `US-302`, `US-304` (P0)
   - `US-303` (P1)
5. EPIC 5 (Security Hardening)
   - `US-501`, `US-502`
6. EPIC 4 (Multi-App Reusability)
   - `US-401` (validate at least two deploy targets)

Rule:
- Every PR/change summary must list the US IDs covered and whether AC is fully met or partial.

## Architecture Guardrails
- Use a single repo with clear boundaries: public flows, admin flows, and server APIs.
- Route boundaries:
  - Public auth APIs under `/api/auth/*`
  - Admin APIs under `/api/admin/*`
- Keep privileged logic in server-only modules.
- Do not bypass domain services for access control, rate limiting, or logging concerns.
- Keep product-specific behavior config-driven; no hardcoded app identity logic.

## Security Non-Negotiables
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never appear in client bundles.
- Protect `/admin/*` with both middleware and server-side role checks.
- Enforce admin checks in every `/api/admin/*` route handler.
- RLS must be enabled for `profiles` and `auth_login_events`.
- OTP anti-abuse controls are mandatory (resend cooldown + per-phone/IP limits).
- Login-event writes are best effort and must not break login success/failure behavior.

## Data and Migration Standards
Required tables:
- `profiles` (`role: admin|user`, `status: active|disabled|deleted`)
- `auth_login_events` (`LOGIN_SUCCESS|LOGIN_FAILED|OTP_REQUESTED` + metadata)

Optional (phase 2):
- `user_devices`

Migration rules:
- Use explicit, versioned SQL migrations.
- Add supporting indexes for user search and login history performance.
- Never run destructive migrations without explicit user approval.
- RLS and policies are part of schema completion, not optional follow-up.

## API and Error Standards
- Keep admin operations behind server Route Handlers.
- Return stable error categories for OTP:
  - `OTP_EXPIRED`
  - `OTP_INVALID`
  - `OTP_RATE_LIMITED`
- Use pagination for user lists and login history endpoints.
- Do not expose internal admin-provider errors directly to clients.

## Quality and Testing Standards
Minimum coverage expectation:
- Unit tests
  - Access control checks
  - OTP policy logic (cooldown/limits)
  - Logging best-effort behavior
- Integration tests
  - OTP request/verify flows
  - Admin list/search/disable/delete endpoints
  - Login history queries with pagination/sorting
- Security tests
  - Admin route protection
  - Non-admin denial for admin APIs
  - No service-role leakage to client

Performance targets:
- Admin user search under 3 seconds
- Login history view under 1 second for expected load and indexed queries

## Definition of Done (Per User Story)
A story is done only when all conditions are met:
- Story implementation matches accepted AC.
- Relevant tests pass for new/changed behavior.
- Security constraints remain intact.
- Required env/config updates are documented.
- Logging and error handling are production-safe.
- No secrets committed and no service-role exposure.

## Ask Before Proceeding
Always ask before:
- Destructive data changes or irreversible delete strategy changes
- Auth/session semantic changes
- Relaxing security controls for convenience
- Major API contract changes that impact clients
- Deviating from US priority order
