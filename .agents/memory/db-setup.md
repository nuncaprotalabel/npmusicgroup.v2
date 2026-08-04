---
name: Database setup
description: NP Music Group V2 — Replit PostgreSQL schema applied and initial SUPER_ADMIN seeded.
---

## Status
Schema applied. Seed user created.

## Tables created
`users`, `permissions`, `role_permissions`, `sessions`, `invitations`, `audit_log`
Also: `user_role` ENUM, `update_updated_at()` trigger on `users`.

## Seed user
- username: `npmusicadmin`
- role: `SUPER_ADMIN`
- password: `NPAdmin2026!` (bcrypt 12 rounds)

**Why:** DATABASE_PLAN.md defines this as the installation seed. The password must be communicated to the admin after setup.

## How to apply
The schema was applied via the `executeSql` callback. The `DATABASE_URL` environment variable is auto-provisioned by Replit — no additional setup needed.

## Important constraint
Any future schema changes must be documented in `docs/DATABASE_PLAN.md` before being applied, per PROJECT_RULES.md.
