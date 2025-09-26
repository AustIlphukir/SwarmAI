import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const DB_URL = process.env.SUPABASE_DB_URL || '';

function json(body: any, init?: number | ResponseInit) {
  const res = NextResponse.json(
    body,
    typeof init === 'number' ? { status: init } : init
  );
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token') || '';
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!DB_URL) return json({ error: 'no_db_url' }, { status: 500 });

  const pool = new Pool({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
  });

  const SQL = `
begin;

create extension if not exists pgcrypto;

-- Ensure table
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  email text,
  email_norm text, -- we handle generated/backfill below
  consent boolean not null default false,
  consent_text text,
  consent_ts timestamptz,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Ensure email_norm is present & populated.
-- If column exists and is NOT a generated column, we backfill once.
-- If it doesn't exist, we add it as a generated column.
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='subscribers' and column_name='email_norm'
  ) then
    alter table public.subscribers
      add column email_norm text generated always as (nullif(lower(trim(email)), '')) stored;
  else
    -- Check if it's generated (attgenerated = 's' stored / 'v' virtual).
    if not exists (
      select 1
      from pg_attribute a
      join pg_class c on c.oid = a.attrelid
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = 'subscribers'
        and a.attname = 'email_norm'
        and a.attgenerated in ('s','v')
    ) then
      -- Not generated: backfill current rows
      update public.subscribers
      set email_norm = nullif(lower(trim(email)), '')
      where true;
    end if;
  end if;
end$$;

-- Drop old unique(email_norm) if it exists
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where table_schema='public' and table_name='subscribers'
      and constraint_name='subscribers_email_norm_uniq'
      and constraint_type='UNIQUE'
  ) then
    alter table public.subscribers
      drop constraint subscribers_email_norm_uniq;
  end if;
end$$;

-- Ensure NEW composite unique(email_norm, role)
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_schema='public' and table_name='subscribers'
      and constraint_name='subscribers_email_role_uniq'
      and constraint_type='UNIQUE'
  ) then
    alter table public.subscribers
      add constraint subscribers_email_role_uniq unique (email_norm, role);
  end if;
end$$;

commit;
`;


  const client = await pool.connect();
  try {
    await client.query(SQL);
    return json({ ok: true, action: 'migrate' }, { status: 200 });
  } catch (e: any) {
    try { await client.query('rollback'); } catch {}
    console.error('[db:migrate] error:', e);
    return json({ error: 'migrate_failed', detail: e?.message }, { status: 500 });
  } finally {
    client.release();
    await pool.end();
  }
}
