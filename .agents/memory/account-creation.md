---
name: Secure account creation
description: Constraint for creating accounts before email delivery and password activation are complete.
---

New accounts must not receive a plaintext or temporary password. They are created inactive with a bcrypt hash of an in-memory random value, and a one-time setup token is persisted through the existing invitation infrastructure.

**Why:** The project has no email delivery system, and exposing credentials in responses, logs, or source would weaken the private-access model.

**How to apply:** Keep account creation server-authorized, never audit tokens or hashes, and complete password activation only in the dedicated invitation/contract phase.