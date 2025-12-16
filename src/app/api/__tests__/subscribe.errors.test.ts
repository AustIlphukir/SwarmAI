import { POST as subscribeHandler, OPTIONS as subscribeOptions } from '../subscribe/route';

function makeReq(body: any = {}) {
  return new Request('http://localhost/api/subscribe', { method: 'POST', body: JSON.stringify(body) });
}

describe('subscribe route negative cases', () => {
  test('returns 400 for invalid email', async () => {
    const req = makeReq({ role: 'founder', email: 'not-an-email', consent: true });
    const res = await subscribeHandler(req as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('invalid_email');
  });

  test('returns 400 when consent missing but email present', async () => {
    const req = makeReq({ role: 'founder', email: 'test@example.com', consent: false });
    const res = await subscribeHandler(req as any);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('consent_required');
  });

  test('OPTIONS returns 204 with CORS headers', async () => {
    const res = await subscribeOptions();
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
});
