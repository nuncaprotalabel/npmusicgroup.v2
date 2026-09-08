---
name: Contract schema source of truth
description: Contract email values are derived from the related application, not stored on contracts.
---

The `contracts` table does not store an `email` column; contract queries must select the related application email and return it as a derived field.

**Why:** The onboarding flow previously attempted to insert and return `contracts.email`, causing runtime failures even though the canonical applicant email already existed on `solicitudes`.

**How to apply:** Keep `solicitudes` as the source for contract email projections and keep contract INSERT/UPDATE/RETURNING statements aligned with the live schema.