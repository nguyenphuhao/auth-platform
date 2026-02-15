# EPIC 006 - Multi-App Reusability

## Goal
Deploy the same codebase to multiple apps using configuration only, without code forks.

## Included Scope
- Env-driven deployment per app.
- Isolated Supabase project/environment per app.
- App-specific branding through theme tokens.

## Success Criteria
- At least two app deployments run from one repository.
- No cross-app user/data contamination.
- Product-specific behavior remains config-driven.

## User Stories and Acceptance Criteria

### US-401 (P1) - Config-Driven Multi-App Deploy
**User Story**  
As a Product Owner, I want the same codebase deployable to multiple apps via env/theme config so that we maximize reuse without forks.

**Acceptance Criteria**  
1. At least two app deployments run from same repository.  
2. Each deployment uses isolated Supabase project/env.  
3. Branding/theme differences are token-based, not hardcoded logic.
4. Supabase env naming is standardized across app deployments:
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`

## Backward Compatibility Note
- Legacy key names can be temporarily supported during migration:
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` -> `SUPABASE_SECRET_KEY`
