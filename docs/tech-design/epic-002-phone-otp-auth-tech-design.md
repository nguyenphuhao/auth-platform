# EPIC 002 Technical Design - Phone OTP Authentication

- Status: Draft
- Related Requirements: `docs/requirements/epic-002-phone-otp-auth.md`
- Related ADR: `docs/adr/adr-0001-auth-platform-architecture.md`

## Objective
Implement secure and reliable phone OTP authentication with clear error behavior and anti-abuse controls.

## Scope
- `US-101`, `US-102`, `US-103`, `US-104`

## API Design
- `POST /api/auth/otp/request`
- `POST /api/auth/otp/verify`

## Behavior Design
- Validate phone input format before OTP request.
- Enforce resend cooldown and request/verify attempt windows.
- Map OTP failures to stable categories:
  - `OTP_EXPIRED`
  - `OTP_INVALID`
  - `OTP_RATE_LIMITED`
- Auto-create `profiles` row on first successful login.

## Data Touchpoints
- Supabase Auth OTP endpoints.
- `profiles` table for role/status bootstrap.
- `auth_login_events` for request/verify outcomes (best effort).

## Security Considerations
- Anti-abuse limits by phone and IP.
- Disabled users are blocked from completing login.

## Testing Strategy
- Unit tests for OTP policy decisions.
- Integration tests for request/verify success and failure paths.
- Regression tests for error message mapping.

## Risks and Mitigations
- Risk: SMS abuse cost spikes.
  - Mitigation: cooldown, limits, and telemetry monitoring.

## Open Questions
- Final TTL and retry threshold values.
