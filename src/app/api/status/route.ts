export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get('swarm_home_unlocked')?.value;
    const unlocked = cookie === '1';
    return NextResponse.json({ unlocked });
  } catch (err) {
    console.error('status route error', err);
    return NextResponse.json({ unlocked: false });
  }
}
