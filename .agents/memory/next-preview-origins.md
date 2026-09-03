---
name: Next.js preview origins
description: Host authorization required for Next.js development previews behind the Replit proxy
---

Next.js development previews behind Replit's proxy need explicit development origins for `localhost`, `127.0.0.1`, and the current `REPLIT_DEV_DOMAIN`; a wildcard alone may still block proxied assets and HMR.

**Why:** The imported app's preview rendered, but Next.js rejected proxied `/_next/*` requests and the HMR WebSocket until the concrete development hosts were allowed.

**How to apply:** Build the `allowedDevOrigins` list from stable local hosts plus `process.env.REPLIT_DEV_DOMAIN`, filtering out missing environment values instead of hardcoding a project-specific domain.