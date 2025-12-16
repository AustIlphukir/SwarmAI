// app/api/subscribe/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Ensure Node runtime (supabase-js + service role is not for Edge)
export const runtime = 'nodejs';

// --- ENV & client -----------------------------------------------------------
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const IP_HASH_SALT = process.env.IP_HASH_SALT || ''; // set a random 32+ char string in your env


let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
} else {
  console.warn('[subscribe] Missing Supabase env vars');
}

// --- Helpers ----------------------------------------------------------------
function firstIP(xff: string | null, xri: string | null): string {
  // Typical XFF: "203.0.113.7, 70.41.3.18, 150.172.238.178"
  if (xff) {
    const ip = xff.split(',')[0]?.trim();
    if (ip) return ip;
  }
  return (xri || '').trim() || 'unknown';
}

function hashIP(ip: string, salt: string): string | null {
  if (!salt || ip === 'unknown') return null;
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 64);
}

function normalizeEmail(email?: string): string | null {
  if (!email) return null;
  const e = email.trim().toLowerCase();
  // Simple RFC5322-ish sanity check
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  return ok ? e : '';
}

function isRoleValid(role: unknown): role is string {
  // Keep len + charset conservative; loosen if you maintain an allowlist in DB
  return typeof role === 'string' && role.length > 0 && role.length <= 64;
}

function json(body: any, init?: number | ResponseInit) {
  const initObj: ResponseInit = typeof init === 'number' ? { status: init } : (init ?? {});
  const res = NextResponse.json(body, initObj);
  // helpful caching defaults for API routes
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

// CORS preflight (optional; remove if not needed)
export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'content-type, authorization');
  res.headers.set('Access-Control-Max-Age', '600');
  return res;
}

// --- Handler ----------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const ip = firstIP(req.headers.get('x-forwarded-for'), req.headers.get('x-real-ip'));
    const ipHash = hashIP(ip, IP_HASH_SALT);
    const userAgent = (req.headers.get('user-agent') || '').slice(0, 512);

    // Parse body defensively
    let body: any;
    try {
      body = await req.json();
    } catch {
      return json({ error: 'invalid_json' }, { status: 400 });
    }

    const role = body?.role;
    const consent = Boolean(body?.consent);
    const emailRaw = body?.email;
    const email = normalizeEmail(emailRaw);

    // Validation
    if (!isRoleValid(role)) {
      return json({ error: 'role_required', detail: 'Missing or invalid role' }, { status: 400 });
    }
    if (email === '') {
      return json({ error: 'invalid_email' }, { status: 400 });
    }
    if (email && !consent) {
      return json(
        { error: 'consent_required', detail: 'Consent required when providing email' },
        { status: 400 }
      );
    }

    // Early dev fallback (don’t persist if no Supabase)
    if (!supabase) {
      console.log('[subscribe] DEV fallback (no Supabase):', {
        role,
        email,
        consent,
        ipHash: ipHash ? '[hash-present]' : null,
        userAgentLen: userAgent.length,
      });
      return json({ ok: true, dev: true }, { status: 201 });
    }

    // Prepare row
    const row = {
      role,
      email: email ?? null,
      consent,
      consent_text: 'Opt-in to product updates v1',
      consent_ts: new Date().toISOString(),
      ip_hash: ipHash, // may be null if no salt or unknown ip
      user_agent: userAgent,
    };

    // Prefer idempotency on email: make a unique index on LOWER(email) in DB
    // If your table has a unique constraint on "email_norm" or similar, use upsert:
    const { error } = await supabase
      .from('subscribers')
      .upsert(row, { onConflict: 'email_norm,role', ignoreDuplicates: false });

    if (error) {
      // Surface constraint violations as 409
      if ((error as any).code === '23505') {
        return json({ ok: true, note: 'already_subscribed' }, { status: 200 });
      }
      console.error('[subscribe] supabase error:', error);
      return json({ error: 'db_error' }, { status: 500 });
    }

    return json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('[subscribe] fatal error:', err);
    return json({ error: 'internal' }, { status: 500 });
  }
}
