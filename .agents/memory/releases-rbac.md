---
name: Releases RBAC readiness
description: Dependency between the administrative releases endpoints, their RBAC permission, and the development database schema.
---

The administrative releases endpoints must remain server-side permission guarded. `ARTIST` must not receive `releases.view`; the permission is intended for explicitly authorized administrative roles. The development schema now includes `releases`, `tracks`, and `track_credits`.

**Why:** The code routes existed before the development database had the catalog tables. Granting the permission alone made an authorized admin request reach a database error, while bypassing the guard would expose an unfinished module to artists.

**How to apply:** Preserve the server-side guard and verify `ARTIST` gets `403`; an authorized admin should now reach the catalog tables successfully. Production receives the schema through the normal publish-time database diff.