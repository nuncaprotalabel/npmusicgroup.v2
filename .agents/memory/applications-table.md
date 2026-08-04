---
name: Applications table
description: Artist application flow — table, API, service, form page, and duplicate-detection logic.
---

# Applications feature

## What was built
- Table `applications` in Neon with status defaulting to `PENDIENTE`
- `POST /api/applications` — validates, detects duplicate email+PENDIENTE, inserts row
- `src/services/applicationService.ts` — client-side API wrapper
- `src/types/application.ts` — shared TypeScript types
- `src/app/aplicar/page.tsx` — full-page form at `/aplicar`
- i18n translations added under `apply` key in both `es` and `en`
- `docs/DATABASE_PLAN.md` updated with section 3.7

## Duplicate rule
One PENDIENTE application per email. Server returns 409 if same email + PENDIENTE already exists.

**Why:** Prevents artists from spamming submissions. Status field allows future approval/rejection without blocking re-apply.

## How to apply
Any link to `/aplicar` already works — Navbar, Hero CTA, and FinalCTA all pointed there before this feature was built.
