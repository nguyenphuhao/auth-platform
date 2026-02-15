# EPIC 001 - Foundation

## Goal
Establish the baseline architecture, project structure, and security boundaries required before feature EPIC delivery.

## Included Scope
- Standardized Next.js App Router structure for `public`, `admin`, and `api` domains.
- Supabase client separation (`browser`, `server`, `admin`).
- Environment variable validation at startup.
- Admin route and API protection with server-side role checks.

## Success Criteria
- New features follow a consistent project structure.
- Privileged credentials and operations stay server-side.
- Misconfiguration is detected early in all environments.
- Unauthorized users cannot access admin pages or APIs.

## User Stories and Acceptance Criteria

### US-001 (P0) - Standard App Structure
**User Story**  
As a Platform Engineer, I want a standardized Next.js App Router structure for `public`, `admin`, and `api` domains so that implementation stays consistent.

**Acceptance Criteria**  
1. Project has clear route groups for public/admin/api.  
2. Shared libs are separated (`supabase`, `auth`, `logging`).  
3. New features follow this structure without exceptions.

### US-002 (P0) - Supabase Client Separation
**User Story**  
As a Platform Engineer, I want separate Supabase clients (`browser`, `server`, `admin`) so that privileged operations are isolated.

**Acceptance Criteria**  
1. Browser client uses anon key only.  
2. Admin client uses service role key server-side only.  
3. Build/runtime checks confirm no service-role usage in client paths.

### US-003 (P0) - Environment Validation
**User Story**  
As a Platform Engineer, I want env validation at startup so that misconfiguration is detected early.

**Acceptance Criteria**  
1. App fails fast when required env vars are missing.  
2. Required vars are documented.  
3. Validation runs in dev/preview/prod.

### US-004 (P0) - Admin Route Protection
**User Story**  
As a Security Engineer, I want `/admin/*` protected by middleware and server-side role checks so that non-admin users cannot access admin functions.

**Acceptance Criteria**  
1. Non-authenticated users are redirected or denied.  
2. Authenticated non-admin users are denied.  
3. All `/api/admin/*` endpoints enforce admin role checks server-side.
