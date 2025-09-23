import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const ALLOW_DB_RESET = process.env.ALLOW_DB_RESET === 'true';
const DB_URL = process.env.SUPABASE_DB_URL || '';

function json(body: any, init?: number | ResponseInit) {
  const res = NextResponse.json(body, init);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export async function POST(req: NextRequest) {
  // AuthN
  const token = req.headers.get('x-admin-token') || '';
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return json({ error: 'unauthorized' }, { status: 401 });
  }

  // Safety in prod
  if (!ALLOW_DB_RESET && process.env.NODE_ENV === 'production') {
    return json({ error: 'reset_disabled_in_production' }, { status: 403 });
  }

  if (!DB_URL) return json({ error: 'no_db_url' }, { status: 500 });

  const pool = new Pool({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false }, // Supabase requires SSL
  });

  const SQL = `
begin;

create extension if not exists pgcrypto;

-- Drop & recreate clean
drop table if exists public.subscribers cascade;

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  email text,
  email_norm text generated always as (nullif(lower(trim(email)), '')) stored,
  consent boolean not null default false,
  consent_text text,
  consent_ts timestamptz,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- NEW: allow same email across roles, but unique per (email_norm, role)
alter table public.subscribers
  add constraint subscribers_email_role_uniq unique (email_norm, role);

commit;
`;

  const client = await pool.connect();
  try {
    await client.query(SQL);
    return json({ ok: true, action: 'reset' }, { status: 200 });
  } catch (e: any) {
    // try cleanup if failed mid-transaction
    try { await client.query('rollback'); } catch {}
    console.error('[db:reset] error:', e);
    return json({ error: 'reset_failed', detail: e?.message }, { status: 500 });
  } finally {
    client.release();
    await pool.end();
  }
}
