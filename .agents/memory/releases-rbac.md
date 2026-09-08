---
name: Releases RBAC readiness
description: Dependency between the administrative releases endpoints, their RBAC permission, and the development database schema.
---

The administrative releases endpoints must remain server-side permission guarded. Artist-facing release access is separate from admin access: even if an ARTIST has a read permission for their own module, admin guards must reject the role with `403`. The development schema includes `releases`, `tracks`, and `track_credits`.

**Why:** The code routes existed before the development database had the catalog tables. A shared permission name made an ARTIST session reach an administrative listing, while removing the artist-facing permission would break the separate ownership-scoped release flow.

**How to apply:** Preserve the server-side admin-role guard and verify `ARTIST` gets `403`; an authorized admin should now reach the catalog tables successfully. Production receives the schema through the normal publish-time database diff.