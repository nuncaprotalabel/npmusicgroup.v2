#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Keep post-merge setup non-interactive and reproducible.
npm ci --no-audit --no-fund
npm run build