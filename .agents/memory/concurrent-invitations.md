---
name: Concurrent invitation writes
description: Safe association of newly created invitation records during account setup.
---

Use the row identity returned by the invitation INSERT when subsequent work needs to reference that invitation. Do not locate a newly created invitation by email, role, or MAX(created_at).

**Why:** Concurrent account creation can interleave transactions and cause a follow-up lookup to select another user's invitation.

**How to apply:** Keep account and invitation creation in the same transaction, use `RETURNING id` when the invitation identity is needed, and keep raw activation secrets out of persistent records.