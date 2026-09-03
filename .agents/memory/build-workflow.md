---
name: Isolated production builds
description: Next.js build validation in this workspace requires separating the production build from the running dev workflow.
---

Run production build validation only while the dev workflow is stopped, because both processes write to `.next` and concurrent access can produce misleading Webpack or prerender failures.

**Why:** The development server and `next build` share the same generated output directory.

**How to apply:** Stop the workflow for the build, then restart it after validation.