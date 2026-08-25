---
name: Dependency restoration
description: Environment-specific dependency state after workspace restores
---

The project can retain dependency declarations while the local `node_modules` directory is incomplete after a workspace restore. Server routes that import database or auth packages then fail at runtime with module-not-found errors.

**Why:** The application workflow may compile the frontend successfully while only discovering missing backend dependencies when an API route is first requested.

**How to apply:** Before diagnosing a new API route as a code or database problem, verify the declared runtime packages are installed and restore them through the package-management workflow when needed.