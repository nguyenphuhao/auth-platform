# EPIC 004 - Login History and Device Tracking

## Goal
Provide audit visibility for login activity and basic device/session metadata for admin investigation.

## Included Scope
- Persist login success/failure events.
- Include timestamp and contextual metadata.
- Provide paginated, time-sorted login history to admin.
- Keep logging best effort so auth flow remains stable.

## Success Criteria
- Admin can investigate user access history efficiently.
- Event records support security auditing and support operations.
- Logging failures do not break core login behavior.

## User Stories and Acceptance Criteria

### US-301 (P0) - Log Login Events
**User Story**  
As a System, I want to log login success and failure events so that admin can audit user access.

**Acceptance Criteria**  
1. `LOGIN_SUCCESS` and `LOGIN_FAILED` are persisted.  
2. Event includes timestamp and user context when available.  
3. Failures include reason code/category.

### US-302 (P0) - View Login History
**User Story**  
As an Admin, I want paginated login history per user so that I can investigate account activity.

**Acceptance Criteria**  
1. History API supports pagination and newest-first sorting.  
2. UI shows event type, time, and reason (if failed).  
3. Queries are index-backed for stable response time.

### US-303 (P1) - View Device Metadata
**User Story**  
As an Admin, I want device/session metadata visibility so that suspicious behavior is easier to spot.

**Acceptance Criteria**  
1. User agent is shown when available.  
2. IP is shown when available.  
3. Optional device identifier is shown when captured.

### US-304 (P0) - Best-Effort Logging
**User Story**  
As a System, I want best-effort event logging so that auth flow never breaks due to logging failures.

**Acceptance Criteria**  
1. Login verify result is returned even if event insert fails.  
2. Logging failures are captured to server logs/telemetry.  
3. No user-facing crash from logging errors.
