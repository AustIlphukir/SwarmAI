export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const keyRaw = body?.key;
    const passkeyRaw = process.env.HOMEPAGE_PASSKEY || process.env.NEXT_PUBLIC_HOMEPAGE_PASSKEY;
    const key = typeof keyRaw === 'string' ? keyRaw.trim() : undefined;
    const passkey = typeof passkeyRaw === 'string' ? passkeyRaw.trim() : undefined;

    if (!passkey) {
      return NextResponse.json({ success: false, error: 'server passkey not configured' }, { status: 500 });
    }
    if (typeof key !== 'string') {
      return NextResponse.json({ success: false, error: 'missing key' }, { status: 400 });
    }
    if (key === passkey) {
      const res = NextResponse.json({ success: true }, { status: 200 });

      const isProd = process.env.NODE_ENV === 'production';
      const maxAge = 60 * 60 * 24 * 30; // 30 days
      const secureFlag = isProd ? '; Secure' : '';
      const cookie = `swarm_home_unlocked=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`;
      res.headers.set('Set-Cookie', cookie);
      return res;
    } else {
      return NextResponse.json({ success: false, error: 'incorrect passkey' }, { status: 401 });
    }
  } catch (err) {
    console.error('unlock route error', err);
    return NextResponse.json({ success: false, error: 'invalid request' }, { status: 400 });
  }
}
