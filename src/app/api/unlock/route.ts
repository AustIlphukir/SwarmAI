export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const key = body?.key;
    const passkey = process.env.HOMEPAGE_PASSKEY || process.env.NEXT_PUBLIC_HOMEPAGE_PASSKEY;

    if (!passkey) {
      return new Response(JSON.stringify({ success: false, error: 'server passkey not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    if (typeof key !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'missing key' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (key === passkey) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({ success: false, error: 'incorrect passkey' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    console.error('unlock route error', err);
    return new Response(JSON.stringify({ success: false, error: 'invalid request' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
}
