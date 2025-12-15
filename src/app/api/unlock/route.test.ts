import { POST as unlockHandler } from './route';

function makeRequest(body: any) {
  return new Request('http://localhost/api/unlock', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('unlock route', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('returns 500 when passkey not configured', async () => {
    delete process.env.HOMEPAGE_PASSKEY;
    delete process.env.NEXT_PUBLIC_HOMEPAGE_PASSKEY;
    const req = makeRequest({ key: 'x' });
    const res = await unlockHandler(req as any);
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
  });

  it('returns 200 when key matches', async () => {
    process.env.HOMEPAGE_PASSKEY = 'secret123';
    const req = makeRequest({ key: 'secret123' });
    const res = await unlockHandler(req as any);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it('returns 401 when key wrong', async () => {
    process.env.HOMEPAGE_PASSKEY = 'secret123';
    const req = makeRequest({ key: 'nope' });
    const res = await unlockHandler(req as any);
    const body = await res.json();
    expect(res.status).toBe(401);
    expect(body.success).toBe(false);
  });
});
