#!/usr/bin/env bash
set -euo pipefail

curl -X POST http://localhost:3000/api/subscribe \
  -H 'content-type: application/json' \
  -d '{"role":"founder","email":"test@example.com","consent":true}'


curl -X POST http://localhost:3000/api/subscribe \
  -H 'content-type: application/json' \
  -d '{"role":"founder","email":"test@example.com","consent":true}'


curl -X POST http://localhost:3000/api/subscribe \
  -H 'content-type: application/json' \
  -d '{"role":"user","email":"test_user@example.com","consent":true}'

curl -X POST http://localhost:3000/api/subscribe \
  -H 'content-type: application/json' \
  -d '{"role":"founder","email":"test_user@example.com","consent":true}'


  curl -X POST http://localhost:3000/api/subscribe \
  -H 'content-type: application/json' \
  -d '{"role":"founder","email":"test_user3@example.com","consent":true}'