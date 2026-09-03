---
name: Database setup
description: NP Music Group V2 — Replit PostgreSQL auth/RBAC schema applied and SUPER_ADMIN bootstrapped securely.
---

## Status
Authentication and RBAC schema applied. SUPER_ADMIN created through environment secrets.

## Tables created
`users`, `sessions`, `audit_log`, `permissions`, `role_permissions`
Also: `user_role` ENUM, auth/RBAC indexes, and `update_users_updated_at()` trigger on `users`.

## Seed user
- username: `npmusicadmin`
- role: `SUPER_ADMIN`

**Why:** Authentication requires a real privileged account without storing credentials in the repository.

## How to apply
The schema was applied via the database tool. The `DATABASE_URL` environment variable is auto-provisioned by Replit. Bootstrap credentials are provided through Replit Secrets and are never printed or persisted as plaintext.

## Important constraint
Any future schema changes must be documented in `docs/DATABASE_PLAN.md` before being applied, per PROJECT_RULES.md.

## Restoration check
After a workspace/database restore, verify the public tables and active SUPER_ADMIN before debugging application code. A reachable PostgreSQL instance can still be completely empty.

**Why:** The login route reports a generic 500 when its first `users` query hits a missing relation, which can look like an application regression even though the source code is valid.

**How to apply:** Check table existence first, restore the documented idempotent schema when needed, then run the secure bootstrap flow if the user account is absent.
