# ADR-0001: Architecture for Reusable Auth and User Management Platform

- Status: Accepted
- Date: 2026-02-14
- Owner: Platform Engineering
- Related Requirements:
  - Product Vision: Reusable Auth and User Management Platform
  - EPIC 1: Phone OTP Authentication
  - EPIC 2: Admin Portal (User Management)
  - EPIC 3: Login History and Device Tracking
  - EPIC 4: Multi-App Reusability
  - EPIC 5: Security and Safety
  - Tech Stack Requirement

## Context

The company needs a reusable authentication platform that can be deployed for multiple products without rewriting core auth logic. Current phase priorities are:

1. End-user login via phone SMS OTP (passwordless).
2. Admin portal for user management.
3. Login history tracking with basic device visibility.
4. Security baseline (admin protection and OTP anti-abuse).
5. Multi-app reuse through configuration and environment isolation.

Key constraints:

- Keep stack aligned with product requirement: Next.js App Router, Supabase Auth, Supabase PostgreSQL, Vercel.
- Keep sensitive operations server-side only.
- Keep solution practical for small-medium scale (roughly 100-300 users per app in current expectation).

## Decision

We adopt a single Next.js codebase with clear separation between public auth flows and admin operations, backed by Supabase Auth and Postgres, with server-enforced access control and audit logging.

### 1) System Topology

- Frontend and backend-for-frontend run in one Next.js App Router project.
- Public user authentication and admin portal are separate route groups in the same app.
- All privileged operations are routed through server-only Next.js Route Handlers.
- Supabase Auth provides identity and session primitives.
- Supabase Postgres stores profile and audit data.
- Deployment is configuration-driven on Vercel; each app deployment uses isolated environment variables and Supabase project.

### 2) Logical Layers

1. Presentation Layer
   - Public OTP login experience.
   - Admin portal UI (list/search/paginate, disable/delete, history view).

2. Application/API Layer
   - Route Handlers in `app/api/**` implement use cases.
   - Server Actions may be used for tightly coupled UI mutations, but admin security checks still stay server-side.

3. Domain Layer
   - Access control service (`assertAdmin`, `assertActiveUser`).
   - OTP policy service (cooldown, retry limits, anti-abuse decisions).
   - Login event service (best-effort audit writes).

4. Infrastructure Layer
   - Supabase browser client for public client-side auth interactions.
   - Supabase server client for session-aware server operations.
   - Supabase admin client with secret key for privileged admin APIs only.
   - Optional Redis (phase extension) if stricter rate-limit guarantees are required.

### 3) Route and API Structure

Recommended route boundaries:

- Public:
  - `/login` (phone input, OTP input, error states)
  - `/api/auth/otp/request`
  - `/api/auth/otp/verify`

- Admin:
  - `/admin`
  - `/api/admin/users`
  - `/api/admin/users/:id/disable`
  - `/api/admin/users/:id/delete`
  - `/api/admin/users/:id/login-events`

All `/api/admin/*` handlers must execute explicit server-side role checks before business logic.

### 4) Data Architecture

#### Required Tables

1. `profiles`
   - `id` UUID (foreign key to `auth.users.id`)
   - `role` enum/text (`admin | user`)
   - `status` enum/text (`active | disabled | deleted`)
   - `phone` text nullable
   - `email` text nullable
   - `created_at`, `updated_at`

2. `auth_login_events`
   - `id` UUID
   - `user_id` UUID nullable (nullable for pre-auth failures)
   - `event_type` text (`LOGIN_SUCCESS | LOGIN_FAILED | OTP_REQUESTED`)
   - `failure_reason` text nullable
   - `ip` text nullable
   - `user_agent` text nullable
   - `device_id` text nullable
   - `metadata` JSONB
   - `occurred_at` timestamp

#### Optional Phase 2 Table

3. `user_devices`
   - `user_id` UUID
   - `device_id` text
   - `last_seen_at` timestamp
   - `last_ip` text nullable
   - `last_user_agent` text nullable

#### Indexing Strategy

- `auth_login_events(user_id, occurred_at desc)`
- `auth_login_events(event_type, occurred_at desc)`
- Search-oriented indexes for `profiles.phone` and `profiles.email`

### 5) Security Architecture

#### Core Controls

- `SUPABASE_SECRET_KEY` is server-only and never imported into client code.
- `/admin/*` UI routes are protected by middleware plus server-side role checks in APIs.
- Row-Level Security (RLS) is enabled for `profiles` and `auth_login_events`.
- OTP request and verify endpoints enforce anti-abuse policies (cooldown and attempt limits).
- Logging is best-effort: failed logging must not block successful authentication.

#### Access Model

- End user:
  - Can only access own session-scoped data through RLS-protected pathways.

- Admin:
  - Can perform user management and audit operations only through privileged server APIs.
  - No direct secret-key exposure to browser.

### 6) Authentication and Session Flows

#### End User OTP Flow

1. User submits phone number.
2. System requests OTP via Supabase Auth.
3. User submits OTP code.
4. System verifies code.
5. If first login, create `profiles` entry with default `user` role.
6. Write `LOGIN_SUCCESS` or `LOGIN_FAILED` event with metadata.
7. Establish authenticated session for user.

Failure states to standardize:

- Expired OTP
- Invalid OTP
- Rate-limited attempts or requests

#### Admin Flow

1. Admin signs in with email/password.
2. Server validates session and role before granting admin routes.
3. Admin actions execute via server APIs that use admin Supabase client.
4. Sensitive admin actions are auditable and should be logged.

### 7) Multi-App Reusability Model

The system is reused by deploying the same codebase with different environment sets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- App-level theme and branding tokens

Backward compatibility during migration:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` maps to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` maps to `SUPABASE_SECRET_KEY`

Isolation rule:

- Each deployed app should use a separate Supabase project/environment so user pools and data remain isolated.
- Product-specific behavior must be config-driven, not hardcoded.

### 8) UI and Design System Direction

- Component system: Tailwind + shadcn/ui + lucide-react.
- Base visual language: neutral + blue trust/security theme.
- Support both light and dark mode; admin UX optimized for dark mode.
- App-specific accents are token-based (for example, teal or orange) while shared spacing/typography/radius tokens remain common.

### 9) Operational and Reliability Considerations

- Pagination is mandatory for user lists and history endpoints.
- Query performance for history is index-driven.
- Admin APIs should return stable error contracts for frontend handling.
- OTP abuse monitoring should track request spikes by phone and IP.
- Add telemetry hooks for:
  - OTP request count
  - OTP verify success/failure ratio
  - Admin disable/delete action counts

### 10) Delivery Plan by EPIC

1. EPIC 1: OTP authentication and standardized OTP errors.
2. EPIC 2: Admin login and user management operations.
3. EPIC 3: Login history and initial device metadata exposure.
4. EPIC 5: Security hardening and abuse controls.
5. EPIC 4: Multi-app packaging and deployment templates (applied continuously, validated at release).

### 11) Database Evolution Strategy (Future Separate Database)

Current baseline:

- Keep one primary Supabase Postgres database per deployed app for speed and simplicity in current phase.

Future-ready decision:

- The architecture must allow selected domains/features to move into separate databases without rewriting auth core.

Separation triggers (when a separate DB should be considered):

1. A feature introduces sustained high read/write load that degrades auth/admin core performance.
2. Compliance, retention, or data residency requirements differ from core auth data.
3. A feature team needs independent release cadence and operational ownership.
4. Reporting and analytical queries become too heavy for the transactional auth database.

Design rules to enable future split now:

- Keep clear bounded context ownership (for example: `auth_core`, `admin_audit`, `future_feature_x`).
- Avoid cross-context direct joins in application business logic.
- Access data via domain services/repositories, not scattered SQL across UI handlers.
- Emit domain events (`USER_CREATED`, `USER_DISABLED`, `LOGIN_SUCCESS`, and related events) for downstream projections.
- Maintain versioned migrations per context and per database target.

Migration path for a future feature DB split:

1. Isolate feature logic behind a module boundary and stable interface.
2. Add outbox/event publishing from the current database.
3. Provision new database and build event consumer/projection.
4. Migrate read path to the new database while keeping writes on current path.
5. Migrate write path to the new database and decommission old coupling.

Non-goal in current phase:

- Do not introduce distributed transactions across multiple databases.
- Prefer eventual consistency for non-auth-critical feature projections.

## Consequences

### Positive

- Fast delivery through one aligned stack and one codebase.
- Clear security boundary: browser never receives admin credentials.
- Reusability is first-class via environment-driven deployment.
- Auditability improves incident response and admin transparency.
- A defined path exists to split future high-growth domains into separate databases without breaking auth core.

### Tradeoffs

- Coupling public and admin apps in one repo may increase deployment blast radius without proper CI gates.
- OTP reliability and cost depend on provider behavior and anti-abuse tuning.
- Device identity remains best-effort unless stronger fingerprinting is introduced (not required in current phase).
- Future multi-database operation increases complexity in data consistency, observability, and incident response.

### Risks and Mitigations

- Risk: OTP abuse increases SMS cost.
  - Mitigation: cooldown, attempt windows, IP/phone throttles, observability alerts.
- Risk: admin access leaks through weak checks.
  - Mitigation: layered route + API checks, strict server-only key handling, security tests.
- Risk: cross-app contamination.
  - Mitigation: separate Supabase projects/env per app and no hardcoded app logic.

## Alternatives Considered

1. Separate admin service from start
   - Rejected for current phase due to higher complexity and slower delivery.
2. Custom auth instead of Supabase Auth
   - Rejected due to higher implementation/security burden and lower time-to-value.
3. Single shared Supabase project for all apps
   - Rejected because requirement prioritizes isolation and clean multi-deploy separation.

## Follow-Up Decisions (Future ADRs)

- ADR for concrete OTP policy parameters (TTL, resend cooldown, limits per IP/phone/device).
- ADR for exact RLS policy SQL and migration governance.
- ADR for observability stack integration and incident response workflow.
- ADR for event contract schema and outbox processing standards for cross-database synchronization.
