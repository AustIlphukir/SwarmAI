import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; 
import crypto from 'crypto';

// This route runs server-side only. Set these in your deployment environment.
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Supabase env vars not found for /api/subscribe');
}

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';
    const body = await req.json();
    const { role, email, consent } = body;

    if (!role) return NextResponse.json({ error: 'role required' }, { status: 400 });

    if (email && !consent) {
      return NextResponse.json({ error: 'consent required for email updates' }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'invalid email' }, { status: 400 });
    }

    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 32);

    if (!supabase) {
      // For local/dev mode fallback: return success but don't persist
      console.log('Would insert into supabase:', { role, email, consent, ipHash, userAgent });
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabase.from('subscribers').insert([{
      role,
      email: email || null,
      consent: !!consent,
      consent_text: 'Opt-in to product updates v1',
      consent_ts: new Date().toISOString(),
      ip_hash: ipHash,
      user_agent: userAgent,
    }]);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}
