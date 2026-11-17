#!/usr/bin/env bash
# Runs the visual suite in the pinned Playwright image so local baselines match CI pixel for pixel.
set -euo pipefail
cd "$(dirname "$0")/.."
version=$(node -p 'require("@playwright/test/package.json").version')
if [ -n "${CI:-}" ] || [ -n "${VISUAL_NO_DOCKER:-}" ]; then
  exec npx playwright test "$@"
fi
exec docker run --rm --ipc=host --network host --user "$(id -u):$(id -g)" -e HOME=/tmp \
  -v "$PWD:/work" -w /work \
  -e VISUAL_PAGES -e VISUAL_SNAPSHOTS -e VISUAL_URL -e VISUAL_CATALOG \
  "mcr.microsoft.com/playwright:v${version}-noble" npx playwright test "$@"
