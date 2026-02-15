# EPIC 001 Technical Design - Foundation

- Status: Draft
- Related Requirements: `docs/requirements/epic-001-foundation.md`
- Related ADR: `docs/adr/adr-0001-auth-platform-architecture.md`

## Objective
Define foundational implementation patterns for structure, environment safety, server-side access boundaries, and enforceable data security gates.

## Scope
- `US-001`, `US-002`, `US-003`, `US-004`

## Design Overview
- Standard route groups for public/admin/api domains.
- Dedicated Supabase clients for browser, server, and admin contexts.
- Centralized environment validation on boot.
- Middleware and server-side admin role checks for all admin paths.
- OpenAPI baseline for `/api/auth/*` and `/api/admin/*` with machine-readable spec endpoint.
- Swagger UI route for manual API test with explicit access guard policy.
- Required schema, indexes, and RLS policies for `profiles` and `auth_login_events`.
- Security gates in CI to verify migration/policy existence and RLS allow/deny behavior.

## OpenAPI and Swagger Baseline (Foundation Deliverable)

### Design Goals
1. Provide a stable API contract for EPIC-001 foundation endpoints.
2. Allow safe API testing via Swagger UI without changing auth/session semantics.
3. Keep privileged details server-only and hide internal provider error shapes.

### Initial Endpoint Coverage
OpenAPI baseline covers the foundation endpoint set only:

- Public auth:
  - `POST /api/auth/otp/request`
  - `POST /api/auth/otp/verify`
- Admin:
  - `GET /api/admin/users`
  - `POST /api/admin/users/{id}/disable`
  - `DELETE /api/admin/users/{id}/delete`
  - `GET /api/admin/users/{id}/login-events`

### Artifact and Route Structure
Recommended file boundaries:

1. `src/lib/openapi/foundation.openapi.ts` (or `foundation.openapi.yaml`)
   - Source of truth for EPIC-001 schema.
2. `src/app/api/openapi/route.ts`
   - Returns OpenAPI JSON when docs access policy allows.
3. `src/app/docs/api/page.tsx`
   - Swagger UI page loading spec from `/api/openapi`.
4. `src/lib/security/api-docs-guard.ts`
   - Shared policy check for docs page and spec endpoint.

### Security Scheme and Contract Rules
OpenAPI must define:

1. `bearerAuth` (`type: http`, `scheme: bearer`) for admin endpoints.
2. No auth scheme on OTP request/verify endpoints (existing behavior retained).
3. Standardized OTP error categories only:
   - `OTP_EXPIRED`
   - `OTP_INVALID`
   - `OTP_RATE_LIMITED`
4. Error examples must be normalized API contracts; do not expose provider internals.

### API Docs Access Policy (No Auth Semantic Change)
Policy is enforced by one shared server-side guard:

1. `API_DOCS_ENABLED`:
   - default `true` in development
   - default `false` in preview/production unless explicitly enabled
2. `API_DOCS_REQUIRE_ADMIN`:
   - default `true`
3. `API_DOCS_ALLOW_IN_PROD`:
   - default `false`

Effective behavior:
1. If docs disabled -> return `404` for `/docs/api` and `/api/openapi`.
2. If `NODE_ENV=production` and `API_DOCS_ALLOW_IN_PROD=false` -> return `404`.
3. If docs enabled and `API_DOCS_REQUIRE_ADMIN=true` -> enforce `assertAdmin()` before serving docs/spec.

This preserves existing auth/session logic and adds a non-invasive control layer around documentation routes.

## Data and RLS Baseline (EPIC-001 Security Deliverable)

### Required Schema (Versioned SQL Migration)
The EPIC-001 baseline migration must create and maintain the following tables:

1. `profiles`
   - `id` UUID (FK to `auth.users.id`)
   - `role` (`admin | user`)
   - `status` (`active | disabled | deleted`)
   - `phone` text nullable
   - `email` text nullable
   - `created_at`, `updated_at`
2. `auth_login_events`
   - `id` UUID
   - `user_id` UUID nullable
   - `event_type` (`LOGIN_SUCCESS | LOGIN_FAILED | OTP_REQUESTED`)
   - `failure_reason` text nullable
   - `ip` text nullable
   - `user_agent` text nullable
   - `device_id` text nullable
   - `metadata` JSONB
   - `occurred_at` timestamp

### Required Indexes
- `profiles(phone)` and `profiles(email)` for user/admin search behavior.
- `auth_login_events(user_id, occurred_at desc)` for login history by user.
- `auth_login_events(event_type, occurred_at desc)` for event-type audit queries.

### Required RLS Baseline
RLS is mandatory and non-optional for both required tables.

1. `profiles`
   - RLS enabled.
   - Policies define self-scope access for authenticated users.
   - Non-admin users must be denied access to other users' rows.
2. `auth_login_events`
   - RLS enabled.
   - Policies define self-scope access to login history rows.
   - Non-admin users must be denied access to other users' events.

Admin operations stay behind server route handlers with explicit admin guard checks. Secret-key execution remains server-only.

## UI Foundation (Layout and Design Tokens)

### UI Objectives at Foundation Stage
- Define one consistent UI baseline for all future EPICs.
- Keep visual behavior config-driven for multi-app reuse.
- Ensure dark/light support from day one, with admin UX optimized for dark mode.

### Layout System
**Public layout (`/login` and auth routes)**
- Single-column centered container.
- Max-width constrained auth card.
- Clear hierarchy: page title, description, form, helper/error area.
- Mobile-first spacing with larger desktop breathing room.

**Admin layout (`/admin/*`)**
- App shell with persistent navigation, top bar, and content area.
- Responsive behavior:
  - Desktop: sidebar + content.
  - Tablet/mobile: collapsible drawer nav + sticky top bar.
- Shared page template for list/detail screens with standardized:
  - Header area (title, actions)
  - Filter/search strip
  - Main content panel
  - State blocks (loading, empty, error)

### Design Token Architecture
Tokens are required at three levels:

1. Foundation tokens (raw primitives)
   - Color scale, spacing scale, radius scale, typography scale, shadow scale.
2. Semantic tokens (UI meaning)
   - `bg`, `surface`, `text-primary`, `text-muted`, `border`, `accent`, `success`, `warning`, `danger`, `focus-ring`.
3. Component tokens (optional overrides)
   - Table, input, button, dialog, toast, sidebar-specific aliases.

### Theme Modes and App Accents
- Modes:
  - Light mode and dark mode are both mandatory.
  - Admin UI defaults to dark mode while still supporting user preference.
- Base palette:
  - Neutral + blue for trust/security baseline.
- App accent variants:
  - Health app accent: teal.
  - League app accent: orange.
- Rule:
  - Accent changes must only modify token values, not component logic.

### Token Storage and Consumption
**Source of truth**
- Store CSS variables in a single token stylesheet (for example `src/styles/tokens.css`).
- Define:
  - `:root` for light mode defaults
  - `[data-theme="dark"]` for dark mode overrides
  - `[data-app="health"]`, `[data-app="league"]` for accent overrides

**Tailwind integration**
- Tailwind theme values map to CSS variables (not hardcoded hex in components).
- shadcn/ui components consume semantic tokens through Tailwind classes.

### Minimum Token Set (Foundation)
Required token groups:
- Color:
  - `--color-bg`, `--color-surface`, `--color-surface-elevated`
  - `--color-text-primary`, `--color-text-muted`
  - `--color-border`, `--color-focus-ring`
  - `--color-accent`, `--color-accent-foreground`
  - `--color-success`, `--color-warning`, `--color-danger`
- Spacing:
  - `--space-1` to `--space-8` (or equivalent)
- Radius:
  - `--radius-sm`, `--radius-md`, `--radius-lg`
- Typography:
  - `--font-sans`, `--text-xs` to `--text-xl`, line-height tokens
- Elevation:
  - `--shadow-sm`, `--shadow-md`, `--shadow-lg`

### UI Component Baseline (Foundation Scope)
The following components must be token-compliant from the start:
- Button
- Input (including OTP input states)
- Card
- Table
- Dialog
- Toast
- Skeleton/loading placeholders

### Accessibility and UX Baseline Rules
- Minimum contrast requirement for text and interactive elements in both modes.
- Visible keyboard focus styles using `focus-ring` tokens.
- Minimum hit area for interactive controls (mobile-safe target sizes).
- Error and success states must have both color and text cues.

### Foundation Deliverables for UI
1. App shell layouts for public and admin areas.
2. Token file with light/dark + app accent overrides.
3. Tailwind mapping to semantic token variables.
4. Base themed components (button, input, table, dialog, toast).
5. Documented usage examples for new screens.

## Design Patterns and Rationale

### 1) Modular Monolith with Explicit Boundaries
**How it is used**
- Keep one deployable Next.js application, but split by responsibility:
  - Public user flows in public route groups.
  - Admin UI flows in `/admin`.
  - API boundaries in `/api/auth/*` and `/api/admin/*`.
  - Shared domain/infrastructure logic in `lib/*`.
- Ban cross-boundary shortcuts (for example, admin routes calling internal public-only modules directly without service interfaces).

**Why this pattern**
- Preserves development speed of a single repo/runtime while preventing architecture drift.
- Creates clear ownership lines and supports future extraction to separate services if needed.
- Matches current product scale and team velocity better than early microservices.

### 2) BFF (Backend-for-Frontend) via Route Handlers
**How it is used**
- Treat Next.js Route Handlers as the only execution point for privileged operations.
- UI components never call Supabase admin capabilities directly.
- Admin operations flow: UI -> `/api/admin/*` -> server-side guard -> domain service -> infrastructure adapter.

**Why this pattern**
- Keeps sensitive logic and credentials off the client.
- Allows stable API contracts for frontend while backend internals evolve.
- Centralizes policy enforcement, logging, and error normalization.

### 3) Factory Pattern for Supabase Client Contexts
**How it is used**
- Provide dedicated creation functions:
  - `createBrowserClient()` for client-side user context.
  - `createServerClient()` for server session-aware operations.
  - `createAdminClient()` for secret-key privileged operations (server-only).
- Enforce import boundaries so admin client cannot be referenced from browser code paths.

**Why this pattern**
- Reduces accidental key leakage and misused client contexts.
- Makes security posture explicit in code and easier to review.
- Improves testability by allowing context-specific mocks/stubs.

### 4) Guard Pattern with Defense in Depth
**How it is used**
- Layer 1: middleware gate for `/admin/*` route access.
- Layer 2: `assertAdmin()` check at each `/api/admin/*` handler before business logic.
- Keep authorization decisions server-side only.

**Why this pattern**
- Prevents single-point failure in route protection.
- Protects both page access and API access independently.
- Ensures future endpoints remain secure even when middleware coverage is incomplete or changed.

### 5) Fail-Fast Configuration Pattern
**How it is used**
- Validate required environment variables during startup and fail immediately on missing/invalid values.
- Centralize env parsing and type-safe access in one module.
- Apply the same validation rules in development, preview, and production.

**Why this pattern**
- Converts hidden runtime failures into deterministic startup failures.
- Reduces incident risk caused by partial or incorrect deployment configuration.
- Speeds up troubleshooting by surfacing configuration errors early and clearly.

### Pattern Selection Tradeoff
- Decision: prefer explicit boundaries and server-side safety over early abstraction complexity.
- Accepted cost: additional boilerplate around guards/factories and stricter module discipline.
- Benefit: lower security risk and easier long-term maintainability.

## Implementation Plan
1. Create route and module boundaries.
2. Implement Supabase client factories with strict context separation.
3. Add OpenAPI source for EPIC-001 foundation endpoints.
4. Add `/api/openapi` route handler with docs guard.
5. Add `/docs/api` Swagger UI page with docs guard.
6. Add baseline SQL migration for `profiles` and `auth_login_events`, including required indexes.
7. Enable RLS and define baseline policies for both required tables.
8. Add env schema validation and fail-fast behavior, including docs flags.
9. Implement admin middleware and `assertAdmin` guard utilities.
10. Add security gate checks for OpenAPI schema, docs guard behavior, migration/policy existence, and RLS behavior.

## Security Considerations
- Supabase secret key must never be importable from client code.
- All admin APIs must call role guard before business logic.
- API docs/spec routes must use explicit guard policy and be disabled by default in production.
- OpenAPI examples must not include `SUPABASE_SERVICE_ROLE_KEY` or provider internal error payloads.
- RLS enablement and policy definitions for `profiles` and `auth_login_events` are mandatory release criteria.
- Logging remains best effort; logging failures must not block auth outcomes.

## Testing Strategy
- Unit tests for env validation and role guard logic.
- Unit tests for API docs guard policy evaluation across env combinations.
- Integration tests for admin route/API access denial and allow paths.
- Integration tests for `/docs/api` and `/api/openapi` allow/deny behavior.
- Migration/policy existence checks for required schema artifacts.
- OpenAPI schema lint/validation checks.
- Integration tests that prove RLS allow/deny behavior by role and row ownership.

## Security Gate Proposal (EPIC-001)

### Gate S1 - Migration and Policy Existence Checks
Run automated checks against SQL migrations to assert:
1. `profiles` and `auth_login_events` tables are created.
2. Required indexes exist for both tables.
3. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` exists for both tables.
4. `CREATE POLICY` statements exist for both tables.

### Gate S1.5 - OpenAPI Schema Validation
Run schema quality checks against the EPIC-001 OpenAPI artifact:
1. OpenAPI document is syntactically valid.
2. Required paths for foundation endpoints are present.
3. `bearerAuth` security scheme is defined and bound to admin endpoints.
4. Forbidden secret/internal patterns are absent from examples and descriptions.

### Gate S2 - RLS Behavior Integration Tests
Run integration tests against a real test database using seeded users:
1. `profiles`: owner can read own row; non-owner is denied.
2. `auth_login_events`: owner can read own events; non-owner is denied.
3. Admin API flows still require server-side `assertAdmin()` regardless of DB policy behavior.
4. Tests include allow and deny assertions for unauthenticated and authenticated contexts.

### Gate S2.5 - API Docs Route Guard Integration Tests
1. `/docs/api` and `/api/openapi` return `404` when `API_DOCS_ENABLED=false`.
2. Production mode with `API_DOCS_ALLOW_IN_PROD=false` returns `404`.
3. When docs are enabled and `API_DOCS_REQUIRE_ADMIN=true`, non-admin receives deny response.
4. Admin context can access docs/spec when enabled.

### Gate S3 - CI Fail Conditions
CI is no-go when any of the following fail:
1. Migration/policy existence checks.
2. OpenAPI schema validation/lint checks.
3. RLS allow/deny integration tests.
4. API docs route guard integration tests.
5. Admin route/API guard tests.
6. Secret-key leakage checks in client paths and OpenAPI/docs artifacts.

## Environment Setup by Stage

### Local Development
**Purpose**
- Fast feature iteration with deterministic behavior and no dependency on external SMS provider.

**Required tooling**
- Node.js 20+
- pnpm
- Docker Desktop
- Supabase CLI

**Core setup**
1. Start local Supabase stack.
2. Reset local DB and apply migrations.
3. Configure `.env.local` with local Supabase values.
4. Run app in development mode.

**Environment variables (minimum)**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `API_DOCS_ENABLED=true`
- `API_DOCS_REQUIRE_ADMIN=true`
- `API_DOCS_ALLOW_IN_PROD=false`
- `APP_CODE`
- `APP_THEME`
- `NODE_ENV=development`

**OTP provider mode**
- Default to fake OTP provider for local development.
- Never depend on real SMS provider for default local flow.

### Integration Test Environment
**Purpose**
- Validate route handlers, auth flow boundaries, and DB/RLS behavior against a real local stack.

**Core setup**
1. Use isolated test database reset before suite run.
2. Seed deterministic test fixtures (admin, non-admin, disabled user).
3. Run integration tests against local Supabase endpoints.
4. Tear down or reset state after suite completion.

**Environment variables (minimum)**
- `NODE_ENV=test`
- Same Supabase variables as local development, but using test context.
- `API_DOCS_ENABLED` and related docs flags explicitly set per test suite scenario.
- OTP provider set to deterministic fake mode for repeatable results.

**Backward compatibility (temporary)**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` -> `SUPABASE_SECRET_KEY`

### Staging
**Purpose**
- Validate release candidate behavior with production-like environment settings.

**Core setup**
1. Deploy from mainline branch candidate.
2. Use staging-specific Supabase project and credentials.
3. Run smoke tests for auth/admin critical paths.
4. Validate RLS policy behavior and admin access controls.

### Production
**Purpose**
- Serve live traffic with strict separation from all non-production environments.

**Core setup**
1. Use production-specific Supabase project and Vercel env set.
2. Keep secret key server-only.
3. Enable operational monitoring for OTP errors and admin action anomalies.
4. Roll back through deployment controls if auth or security regressions are detected.

## Testing Execution Matrix

### Local (Developer machine)
- Unit tests: run on each feature change.
- Integration tests: run before PR and before merging risky auth/security changes.

### CI (Pull Request)
- Mandatory: unit tests + integration tests for affected auth/admin modules.
- Mandatory: migration/policy existence checks for `profiles` and `auth_login_events`.
- Mandatory: RLS allow/deny integration tests for owner/non-owner access.
- Mandatory: security checks for admin guard and secret-key leakage patterns.
- Gate rule: failing integration or security checks block merge (no override for EPIC-001).

### Staging Validation
- Smoke tests: OTP request/verify success/failure, admin access, user disable behavior.
- Data checks: login events are written and queryable in admin history.

### Production Verification
- Post-deploy checks: login success ratio, OTP failure spikes, admin API error rates.
- Incident trigger: if auth failure or authorization anomalies exceed threshold, start rollback protocol.

## EPIC-001 Go/No-Go Criteria

Go:
1. `US-001..US-004` acceptance criteria are fully met.
2. Required schema, indexes, RLS enablement, and policies for `profiles` and `auth_login_events` are present in versioned migrations.
3. Security gates (migration/policy existence + RLS behavior + admin guard + secret-key leakage) pass in CI.
4. QA validates admin allow/deny flows and row-scoped login history behavior.

No-go:
1. Missing required table/index/policy artifacts for `profiles` or `auth_login_events`.
2. RLS not enabled for either required table.
3. Any failing security gate in CI.
4. Any regression that exposes admin or secret-key capability to non-admin or client paths.

## Risks and Mitigations
- Risk: route protection drift across new APIs.
  - Mitigation: enforce shared middleware + guard utility usage.

## Open Questions
- None at this stage.
