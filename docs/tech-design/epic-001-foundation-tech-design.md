# EPIC 001 Technical Design - Foundation

- Status: Draft
- Related Requirements: `docs/requirements/epic-001-foundation.md`
- Related ADR: `docs/adr/adr-0001-auth-platform-architecture.md`

## Objective
Define foundational implementation patterns for structure, environment safety, and server-side access boundaries.

## Scope
- `US-001`, `US-002`, `US-003`, `US-004`

## Design Overview
- Standard route groups for public/admin/api domains.
- Dedicated Supabase clients for browser, server, and admin contexts.
- Centralized environment validation on boot.
- Middleware and server-side admin role checks for all admin paths.

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
  - `createAdminClient()` for service-role privileged operations (server-only).
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
3. Add env schema validation and fail-fast behavior.
4. Implement admin middleware and `assertAdmin` guard utilities.

## Security Considerations
- Service role key must never be importable from client code.
- All admin APIs must call role guard before business logic.

## Testing Strategy
- Unit tests for env validation and role guard logic.
- Integration tests for admin route/API access denial and allow paths.

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
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
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
- OTP provider set to deterministic fake mode for repeatable results.

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
2. Keep service-role key server-only.
3. Enable operational monitoring for OTP errors and admin action anomalies.
4. Roll back through deployment controls if auth or security regressions are detected.

## Testing Execution Matrix

### Local (Developer machine)
- Unit tests: run on each feature change.
- Integration tests: run before PR and before merging risky auth/security changes.

### CI (Pull Request)
- Mandatory: unit tests + integration tests for affected auth/admin modules.
- Mandatory: security checks for admin guard and service-role leakage patterns.
- Gate rule: failing integration/security checks block merge.

### Staging Validation
- Smoke tests: OTP request/verify success/failure, admin access, user disable behavior.
- Data checks: login events are written and queryable in admin history.

### Production Verification
- Post-deploy checks: login success ratio, OTP failure spikes, admin API error rates.
- Incident trigger: if auth failure or authorization anomalies exceed threshold, start rollback protocol.

## Risks and Mitigations
- Risk: route protection drift across new APIs.
  - Mitigation: enforce shared middleware + guard utility usage.

## Open Questions
- None at this stage.
