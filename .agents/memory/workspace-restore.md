---
name: Workspace restore verification
description: Added route files can disappear after a workspace reconciliation, so verify the filesystem and final route manifest after restoration.
---

When a build or workspace reconciliation follows a large change, verify that newly added route files still exist before trusting the route manifest.

**Why:** During stabilization, several untracked route and component files disappeared between validation steps while older tracked files remained, producing a misleading successful build with missing routes.

**How to apply:** Run `find`/`git status --untracked-files=all`, then run TypeScript, HTTP route checks, and a final build after restoring any missing files. Avoid clearing generated output until source-file persistence is confirmed.