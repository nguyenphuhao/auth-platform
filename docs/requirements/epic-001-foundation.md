# EPIC 001 - Foundation

## Goal
Establish the baseline architecture, project structure, and security boundaries required before feature EPIC delivery.

## Included Scope
- Standardized Next.js App Router structure for `public`, `admin`, and `api` domains.
- Supabase client separation (`browser`, `server`, `admin`).
- Environment variable validation at startup.
- Admin route and API protection with server-side role checks.
- OpenAPI baseline for foundation APIs under `/api/auth/*` and `/api/admin/*`.
- Swagger UI/docs route for safe API testing with explicit security schemes and access gating.
- Baseline database schema for `profiles` and `auth_login_events` using versioned SQL migrations.
- RLS enablement and baseline policies for `profiles` and `auth_login_events`.

## Success Criteria
- New features follow a consistent project structure.
- Privileged credentials and operations stay server-side.
- Misconfiguration is detected early in all environments.
- Unauthorized users cannot access admin pages or APIs.
- API docs are only accessible under approved guard rules (admin-only or disabled in production).
- `profiles` and `auth_login_events` schema, indexes, and RLS policies are present and verifiable in CI.

## User Stories and Acceptance Criteria

### US-001 (P0) - Standard App Structure
**User Story**  
As a Platform Engineer, I want a standardized Next.js App Router structure for `public`, `admin`, and `api` domains so that implementation stays consistent.

**Acceptance Criteria**  
1. Project has clear route groups for public/admin/api.
2. Shared libs are separated (`supabase`, `auth`, `logging`, `config`).
3. OpenAPI artifacts have a defined location and ownership:
   - spec source under `src/lib/openapi/*` (or equivalent server-only path)
   - docs route under `/docs/api`
   - machine-readable spec endpoint under `/api/openapi`
4. Versioned SQL migrations are organized under a single migration path and tracked as part of foundation setup.
5. A baseline migration creates required tables:
   - `profiles` (`id`, `role`, `status`, `phone`, `email`, `created_at`, `updated_at`)
   - `auth_login_events` (`id`, `user_id`, `event_type`, `failure_reason`, `ip`, `user_agent`, `device_id`, `metadata`, `occurred_at`)
6. Supporting indexes for `profiles` search (`phone`, `email`) and login history queries (`user_id + occurred_at`, `event_type + occurred_at`) are included.

### US-002 (P0) - Supabase Client Separation
**User Story**  
As a Platform Engineer, I want separate Supabase clients (`browser`, `server`, `admin`) so that privileged operations are isolated.

**Acceptance Criteria**  
1. Browser client uses publishable key only (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
2. Admin client uses secret key server-side only (`SUPABASE_SECRET_KEY`).
3. Build/runtime checks confirm no secret-key usage in client paths.
4. Privileged database operations (including admin user management and audit queries) execute only through server route handlers and server-only modules.
5. RLS remains enabled for `profiles` and `auth_login_events` and is not treated as optional when privileged server paths exist.
6. OpenAPI examples and docs never expose:
   - `SUPABASE_SECRET_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - internal admin-provider error payloads/messages

### US-003 (P0) - Environment Validation
**User Story**  
As a Platform Engineer, I want env validation at startup so that misconfiguration is detected early.

**Acceptance Criteria**  
1. App fails fast when required env vars are missing.
2. Required vars are documented.
3. Validation runs in dev/preview/test/prod.
4. Pre-deploy validation verifies schema and policy migration state for `profiles` and `auth_login_events` before promotion.
5. Validation failure for missing required schema/RLS artifacts is a release blocker.
6. API docs env flags are validated and documented:
   - `API_DOCS_ENABLED` (default true in dev, false otherwise)
   - `API_DOCS_REQUIRE_ADMIN` (default true)
   - `API_DOCS_ALLOW_IN_PROD` (default false)

### US-004 (P0) - Admin Route Protection
**User Story**  
As a Security Engineer, I want `/admin/*` protected by middleware and server-side role checks so that non-admin users cannot access admin functions.

**Acceptance Criteria**  
1. Non-authenticated users are redirected or denied.
2. Authenticated non-admin users are denied.
3. All `/api/admin/*` endpoints enforce admin role checks server-side.
4. RLS is enabled for both `profiles` and `auth_login_events` with explicit policies committed in migrations.
5. Security tests prove allow/deny behavior:
   - `profiles`: user can access own profile rows only; non-admin cannot access other users.
   - `auth_login_events`: user can access own login events only; non-admin cannot access other users' events.
6. CI blocks merge when admin guard tests or RLS policy behavior tests fail.
7. API docs route and OpenAPI endpoint are protected by policy:
   - admin-only when enabled in protected environments
   - disabled by default in production unless explicit override

## Resolved Baseline Decisions (Kickoff Inputs)
1. OTP anti-abuse baseline is mandatory and env-driven:
   - `OTP_TTL_SECONDS=300`
   - `OTP_RESEND_COOLDOWN_SECONDS=30`
   - request limits: max 5 requests per 15 minutes per phone; max 10 requests per 15 minutes per IP
   - verify limits: max 5 attempts per OTP; lockout 15 minutes when exceeded
2. RLS baseline policy model is fixed for EPIC-001:
   - `profiles`: authenticated users can `SELECT/UPDATE` own row only (`id = auth.uid()`); no client-side delete policy
   - `auth_login_events`: authenticated users can `SELECT` own rows only (`user_id = auth.uid()`)
   - privileged writes/reads for admin and logging run through server-only/admin client paths
3. Pagination contract is mandatory for list/history admin endpoints:
   - request: `limit` (default 20, max 100), `cursor` (opaque), `sort` (whitelisted values only)
   - response: `data` + `page` object with `nextCursor`, `hasMore`, and effective `limit`
4. Error envelope contract is mandatory and stable:
   - `error: { code, message, requestId, retryable }`
   - minimum code set: `AUTH_REQUIRED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `RATE_LIMITED`, `OTP_INVALID`, `OTP_EXPIRED`, `OTP_RATE_LIMITED`, `INTERNAL_ERROR`
5. Migration rollback notes are required for every non-trivial migration and are treated as release criteria.

## EPIC-001 Security Gates (Cross-Story)
1. Migration existence check confirms required `CREATE TABLE`, indexes, `ENABLE ROW LEVEL SECURITY`, and `CREATE POLICY` statements for `profiles` and `auth_login_events`.
2. Integration tests validate RLS allow/deny paths using at least unauthenticated, authenticated user, and authenticated non-owner contexts.
3. OpenAPI schema validation/lint check runs in CI and fails on invalid schema.
4. Integration tests validate API docs route allow/deny behavior for:
   - non-prod enabled
   - prod disabled default
   - admin-required enforcement
5. CI secret scan fails on forbidden patterns in client paths and docs/examples:
   - `SUPABASE_SECRET_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Security gates are required in CI and configured as merge blockers.
7. OTP anti-abuse threshold and lockout tests are required in CI and configured as merge blockers.
8. Non-trivial migrations without rollback notes are treated as release blockers.

## Supabase Key Migration Note
- New standard names:
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SECRET_KEY`
- Legacy names can be temporarily mapped during migration:
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` -> `SUPABASE_SECRET_KEY`
