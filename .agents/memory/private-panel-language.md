---
name: Private panel language boundary
description: Why private-panel pages need client-rendered translation shells when language changes must apply without refresh.
---

Private-panel page copy that must change immediately with the language selector belongs in a client-rendered component under the language provider; Server Component text is rendered on the server and will otherwise remain stale until navigation or refresh.

**Why:** The language preference is held in client context and local storage, while server-rendered page markup is not re-executed by a context state update.

**How to apply:** Keep database/session reads server-side, pass only real data into a focused client presentation component, and preserve the old route with a redirect when consolidating duplicated private entry points.