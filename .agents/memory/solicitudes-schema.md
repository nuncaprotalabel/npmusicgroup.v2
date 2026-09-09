---
name: Solicitudes schema
description: Durable constraint for request status updates and database assumptions.
---

The `solicitudes` table currently tracks `created_at` but does not have `updated_at`. Status transitions must update only the existing `estado` field and retain the current-state guard for concurrency.

**Why:** Writing an assumed timestamp column caused every approve/reject action to fail after the request had already passed authentication and authorization.

**How to apply:** Check the live development schema before adding fields to request mutations; if timestamps are needed later, add them through the normal schema migration flow rather than assuming they exist.