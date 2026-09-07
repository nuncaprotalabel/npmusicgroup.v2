---
name: Releases RBAC readiness
description: Dependency between the administrative releases endpoints, their RBAC permission, and the development database schema.
---

The administrative releases endpoints must remain server-side permission guarded. `ARTIST` must not receive `releases.view`; the permission is intended for explicitly authorized administrative roles.

**Why:** The code routes exist before the development database has the `releases` and `tracks` tables. Granting the permission alone makes an authorized admin request reach a database error, while bypassing the guard would expose an unfinished module to artists.

**How to apply:** Before enabling or testing administrative releases, apply the project's approved schema setup for `releases` and `tracks`, seed the intended permission rows and role assignments, then verify `ARTIST` gets `403` and an authorized admin gets a valid `200` response.