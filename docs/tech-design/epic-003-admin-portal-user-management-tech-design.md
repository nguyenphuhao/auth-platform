# EPIC 003 Technical Design - Admin Portal User Management

- Status: Draft
- Related Requirements: `docs/requirements/epic-003-admin-portal-user-management.md`
- Related ADR: `docs/adr/adr-0001-auth-platform-architecture.md`

## Objective
Deliver secure admin capabilities for user discovery and account control operations.

## Scope
- `US-201`, `US-202`, `US-203`, `US-204`, `US-205`

## API Design
- `GET /api/admin/users`
- `POST /api/admin/users/:id/disable`
- `DELETE /api/admin/users/:id/delete`

## Behavior Design
- Admin sign-in with session persistence.
- Paginated user listing and search by phone/email.
- Disable flow prevents new login sessions.
- Delete flow requires explicit confirmation in UI.

## Data Touchpoints
- `profiles` for user role/status and search fields.
- Supabase Admin API for privileged account operations.

## Security Considerations
- All APIs are admin-only with server-side checks.
- No privileged operations from client directly.

## Testing Strategy
- Integration tests for list/search/pagination.
- Integration tests for disable/delete action outcomes.
- Authorization tests for non-admin rejection.

## Risks and Mitigations
- Risk: accidental destructive admin actions.
  - Mitigation: confirm dialogs + clear action state feedback.

## Open Questions
- Soft delete vs hard delete final policy.
