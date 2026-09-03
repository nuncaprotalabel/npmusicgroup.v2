---
name: Database setup
description: NP Music Group V2 — Replit PostgreSQL auth schema applied and SUPER_ADMIN bootstrapped securely.
---

## Status
Authentication schema applied. SUPER_ADMIN created through environment secrets.

## Tables created
`users`, `sessions`, `audit_log`
Also: `user_role` ENUM, auth indexes, and `update_users_updated_at()` trigger on `users`.

## Seed user
- username: `npmusicadmin`
- role: `SUPER_ADMIN`

**Why:** Authentication requires a real privileged account without storing credentials in the repository.

## How to apply
The schema was applied via the database tool. The `DATABASE_URL` environment variable is auto-provisioned by Replit. Bootstrap credentials are provided through Replit Secrets and are never printed or persisted as plaintext.

## Important constraint
Any future schema changes must be documented in `docs/DATABASE_PLAN.md` before being applied, per PROJECT_RULES.md.
