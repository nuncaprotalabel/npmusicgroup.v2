---
name: Preview workflow stability
description: Environment-specific guidance for recovering an imported Next.js preview after launch conflicts or corrupted development manifests.
---

Keep the preview on one managed web workflow. If a restored workspace reports `EADDRINUSE` or `Unexpected end of JSON input` from Next.js, stop the workflow before running a production build, then restart it after the build completes. Clear only the generated `.next` cache if the preview still serves a broken manifest.

**Why:** A stale Next.js process or concurrent writers can leave generated development files incomplete even when the source code and route build are valid.

**How to apply:** Check the managed workflow list before adding another launcher; use the existing `Start application` workflow and verify both the server log and an app preview after a clean restart.