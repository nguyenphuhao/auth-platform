# EPIC 005 Technical Design - Security and Safety

- Status: Draft
- Related Requirements: `docs/requirements/epic-005-security-safety.md`
- Related ADR: `docs/adr/adr-0001-auth-platform-architecture.md`

## Objective
Enforce non-negotiable security controls across admin access, database policy, and credential handling.

## Scope
- `US-501`, `US-502`

## Security Design
- Enable and validate RLS on `profiles` and `auth_login_events`.
- Keep service-role operations isolated in server-only code paths.
- Protect admin routes and APIs with layered checks.

## Implementation Plan
1. Define and apply RLS policies via versioned SQL migrations.
2. Add server-only boundaries for admin client initialization.
3. Add security checks in middleware and route handlers.
4. Add CI checks for client bundle secret leakage.

## Verification Plan
- Policy behavior tests in staging.
- Authorization integration tests for admin endpoints.
- Build-time scan for service-role reference in client code.

## Risks and Mitigations
- Risk: silent policy regressions during schema change.
  - Mitigation: include policy assertions in migration verification.

## Open Questions
- Tooling choice for CI secret exposure checks.
