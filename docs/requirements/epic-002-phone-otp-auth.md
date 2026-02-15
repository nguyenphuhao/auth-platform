# EPIC 002 - Phone OTP Authentication

## Goal
Enable passwordless login with phone SMS OTP and clear failure handling, while preventing OTP abuse.

## Included Scope
- Request OTP by phone number.
- Verify OTP and create authenticated session.
- Auto-create user profile for first-time users.
- Standardized OTP error messages.
- OTP anti-abuse controls (resend cooldown and rate limits).

## Success Criteria
- End users can sign in without password.
- OTP failure reasons are explicit and actionable.
- OTP abuse controls reduce spam and cost.

## User Stories and Acceptance Criteria

### US-101 (P0) - Request OTP
**User Story**  
As an End User, I want to request OTP by phone number so that I can sign in without password.

**Acceptance Criteria**  
1. Valid phone submits successfully and triggers OTP send.  
2. Invalid phone returns clear validation error.  
3. Rate-limited requests return specific limit message/code.

### US-102 (P0) - Verify OTP and Login
**User Story**  
As an End User, I want to verify OTP and log in so that I can access the app quickly.

**Acceptance Criteria**  
1. Correct OTP creates authenticated session.  
2. If user does not exist, profile is auto-created.  
3. Disabled users cannot complete login.

### US-103 (P0) - OTP Error Messaging
**User Story**  
As an End User, I want clear OTP failure messages so that I know what to do next.

**Acceptance Criteria**  
1. Expired OTP returns `OTP expired`.  
2. Wrong OTP returns `Invalid code`.  
3. Too many attempts returns rate-limit message with retry guidance.

### US-104 (P0) - OTP Anti-Abuse
**User Story**  
As a Product Owner, I want OTP anti-abuse controls so that SMS cost and abuse are reduced.

**Acceptance Criteria**  
1. Resend cooldown is enforced per phone.  
2. Request/verify attempt window is enforced per phone and IP.  
3. Breaches are logged for monitoring.
