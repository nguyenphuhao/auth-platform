# EPIC 003 - Admin Portal User Management

## Goal
Provide secure and efficient admin capabilities to manage users through a dedicated portal.

## Included Scope
- Admin sign-in with email/password.
- Paginated user listing.
- Search users by phone/email.
- Disable user accounts.
- Delete users with explicit confirmation.

## Success Criteria
- Only admins can access admin capabilities.
- Admin can find users quickly and operate safely.
- Critical user management actions are reliable and reflected in UI state.

## User Stories and Acceptance Criteria

### US-201 (P0) - Admin Sign-in
**User Story**  
As an Admin, I want to sign in with email/password so that I can manage users securely.

**Acceptance Criteria**  
1. Valid admin credentials access `/admin`.  
2. Non-admin credentials cannot access admin pages.  
3. Session persistence works across protected admin routes.

### US-202 (P0) - User List with Pagination
**User Story**  
As an Admin, I want a paginated user list so that I can manage large user sets efficiently.

**Acceptance Criteria**  
1. API supports page, size, total count.  
2. UI supports next/prev page without full reload.  
3. Loading/empty/error states are displayed.

### US-203 (P0) - Search Users
**User Story**  
As an Admin, I want to search users by phone/email so that I can find users quickly.

**Acceptance Criteria**  
1. Search accepts phone or email keywords.  
2. Search returns relevant results with pagination.  
3. Search response meets performance target.

### US-204 (P0) - Disable User
**User Story**  
As an Admin, I want to disable a user so that they cannot create new login sessions.

**Acceptance Criteria**  
1. Disable action updates user status to `disabled`.  
2. Disabled user cannot start new successful login.  
3. UI reflects disabled state immediately after action.

### US-205 (P0) - Delete User
**User Story**  
As an Admin, I want to delete a user with confirmation so that accidental deletion is prevented.

**Acceptance Criteria**  
1. Confirmation dialog is required before deletion.  
2. User is removed (or soft-deleted per policy) successfully.  
3. Deleted user no longer appears in default active list.
