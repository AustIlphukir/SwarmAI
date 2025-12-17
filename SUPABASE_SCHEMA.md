Supabase tables & App Settings for protected preview

App Settings (Static Web App / Functions)
- SUPABASE_URL = https://<your-project>.supabase.co
- SUPABASE_SERVICE_ROLE_KEY = <service-role-key> (keep secret)
- PREVIEW_PASSWORD_HASH = <bcrypt-hash-of-preview-password>
- SESSION_SIGNING_KEY = <random-secret>

Minimal tables (optional but recommended)

1) public_content
 - slug: text (primary key)
 - content: jsonb

Example row:
 - slug: 'home'
 - content: { "hero": { "title": "Safe Sky", "subtitle": "..." }, "tiles": [...] }

2) sessions (optional, for revocable sessions)
 - id: uuid (primary key)
 - created_at: timestamptz
 - expires_at: timestamptz
 - meta: jsonb

3) auth_logs (optional)
 - id: uuid
 - ts: timestamptz
 - ip_hash: text
 - event: text ('login_success'|'login_fail')
 - meta: jsonb

Notes
- Use Supabase SQL editor to create these tables. Keep `SUPABASE_SERVICE_ROLE_KEY` only in Functions settings.
- For IP hashing, use a server-side salt (env) before storing to reduce PII.
