export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = NextResponse.json({ ok: true });
    // Clear the unlock cookie by setting it with Max-Age=0
    const cookie = `swarm_home_unlocked=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
    res.headers.set('Set-Cookie', cookie);
    return res;
  } catch (err) {
    console.error('lock route error', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
