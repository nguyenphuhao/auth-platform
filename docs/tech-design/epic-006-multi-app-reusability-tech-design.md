# EPIC 006 Technical Design - Multi-App Reusability

- Status: Draft
- Related Requirements: `docs/requirements/epic-006-multi-app-reusability.md`
- Related ADR: `docs/adr/adr-0001-auth-platform-architecture.md`

## Objective
Run multiple product deployments from one codebase using environment and token configuration only.

## Scope
- `US-401`

## Deployment Design
- One repository and one app architecture.
- Separate environment sets per app:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Separate Supabase projects/environments per deployment target.

## Configuration Design
- App-specific branding through theme tokens only.
- No product-specific hardcoded logic in business flows.

## Validation Plan
- Deploy at least two app variants from the same revision.
- Verify data isolation between app environments.
- Verify auth/admin flows behave identically across variants.

## Risks and Mitigations
- Risk: cross-app contamination via shared credentials/config.
  - Mitigation: strict environment separation and deployment checklists.

## Open Questions
- Final naming convention for app environment groups in Vercel.
