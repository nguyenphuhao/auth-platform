# EPIC 005 - Security and Safety

## Goal
Enforce strict security boundaries for admin access, credential handling, and database policy controls.

## Included Scope
- Protect admin routes and APIs with server-side checks.
- Enforce RLS on auth-related tables.
- Ensure service-role key remains server-only.
- Keep OTP abuse controls active as platform baseline.

## Success Criteria
- Unauthorized users cannot access admin capabilities.
- Data access is policy-enforced at DB level.
- Sensitive credentials never appear in client-side code.

## User Stories and Acceptance Criteria

### US-501 (P0) - Enable RLS
**User Story**  
As a Security Engineer, I want RLS enabled for auth-related tables so that data access is policy-enforced.

**Acceptance Criteria**  
1. RLS is enabled on `profiles` and `auth_login_events`.  
2. Policies prevent unauthorized reads/writes.  
3. Policy behavior is validated in test/staging.

### US-502 (P0) - Keep Service Key Server-Only
**User Story**  
As a Security Engineer, I want the service-role key to remain server-only so that privileged credentials are never leaked.

**Acceptance Criteria**  
1. Service-role env var is never referenced in client code.  
2. Admin operations run only via server handlers.  
3. CI security check flags accidental client exposure.
