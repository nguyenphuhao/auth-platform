# EPIC-001 UI Foundation Usage

## Routes
- Public login: `/login`
- Admin dashboard: `/admin`
- Admin users: `/admin/users`
- Swagger docs: `/docs/api`

## Theme and Accent
- Theme is controlled via `data-theme` on `<html>` (`light` or `dark`).
- App accent is controlled via `data-app` on `<html>` (`default`, `health`, `league`).
- Tokens are defined at `src/styles/tokens.css` and consumed through Tailwind semantic colors.

## API Contract Testing (Skeleton)
- OpenAPI spec: `GET /api/openapi`
- OTP request: `POST /api/auth/otp/request`
- OTP verify: `POST /api/auth/otp/verify`
- Admin users: `GET /api/admin/users`
- Admin disable user: `POST /api/admin/users/{id}/disable`
- Admin delete user: `DELETE /api/admin/users/{id}/delete`
- Admin login events: `GET /api/admin/users/{id}/login-events`

## Dev Role Hint
In this foundation stage, admin checks use dev role hints only:
- Header: `x-dev-role: admin`
- Or cookie: `dev_role=admin`

Business/service logic and real auth/session resolution are intentionally not included in this setup.
