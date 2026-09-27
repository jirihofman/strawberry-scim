#!/usr/bin/env bash
set -euo pipefail

./node_modules/.bin/cypress run --component
npm run test:build
npm run test:start &
server_pid=$!
trap 'kill "$server_pid" 2>/dev/null || true' EXIT
./node_modules/.bin/wait-on --timeout 120000 http://127.0.0.1:5041
npm run test:cy:run
