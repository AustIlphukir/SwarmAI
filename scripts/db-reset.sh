#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
TOKEN="${ADMIN_TOKEN:-changeme}"

echo "Resetting DB at $BASE_URL ..."
curl -sS -X POST "$BASE_URL/api/admin/db/reset" \
  -H "x-admin-token: $TOKEN" \
  -H "content-type: application/json" \
  -d '{}' | jq .
