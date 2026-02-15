# EPIC 004 Technical Design - Login History and Device Tracking

- Status: Draft
- Related Requirements: `docs/requirements/epic-004-login-history-device-tracking.md`
- Related ADR: `docs/adr/adr-0001-auth-platform-architecture.md`

## Objective
Provide reliable login audit history and device/session visibility for admin investigations.

## Scope
- `US-301`, `US-302`, `US-303`, `US-304`

## API Design
- `GET /api/admin/users/:id/login-events`

## Data Design
- `auth_login_events` schema:
  - Event type (`LOGIN_SUCCESS`, `LOGIN_FAILED`, `OTP_REQUESTED`)
  - `occurred_at`, `failure_reason`
  - `ip`, `user_agent`, optional `device_id`
  - `metadata` JSONB
- Indexes:
  - `(user_id, occurred_at desc)`
  - `(event_type, occurred_at desc)`

## Behavior Design
- Write success/failed events as part of auth flow.
- Expose admin paginated history sorted newest-first.
- Best-effort event writes do not block login result.

## Security Considerations
- History endpoint remains admin-only.
- Event data access constrained by RLS/policies.

## Testing Strategy
- Integration tests for event creation paths.
- Integration tests for history pagination/sorting.
- Fault-injection tests for best-effort logging behavior.

## Risks and Mitigations
- Risk: history growth impacts query performance.
  - Mitigation: indexes, pagination, and retention policy planning.

## Open Questions
- Retention period for login event data.
