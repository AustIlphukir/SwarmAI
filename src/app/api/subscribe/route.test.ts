import { POST as subscribeHandler, OPTIONS as optionsHandler } from './route';
import * as supabaseModule from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');

function makeRequest(body: any, headers: Record<string,string> = {}) {
  return new Request('http://localhost/api/subscribe', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

describe('subscribe route', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    // default to no supabase keys (dev fallback)
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('responds to OPTIONS with CORS headers', async () => {
    const res = await optionsHandler();
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('returns 400 when role missing', async () => {
    const req = makeRequest({ email: null, consent: false });
    const res = await subscribeHandler(req as any);
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toBeTruthy();
  });

  it('dev fallback when no supabase configured', async () => {
    const req = makeRequest({ role: 'founder', email: 'test@example.com', consent: true });
    const res = await subscribeHandler(req as any);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.dev).toBe(true);
  });

  it('upserts into supabase when configured', async () => {
    // Mock createClient -> returns client with from().upsert()
    const upsertMock = jest.fn().mockResolvedValue({ error: null });
    const fromMock = jest.fn().mockReturnValue({ upsert: upsertMock });
    (supabaseModule.createClient as jest.Mock).mockReturnValue({ from: fromMock });

    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

    const req = makeRequest({ role: 'founder', email: 't@example.com', consent: true });
    const res = await subscribeHandler(req as any);
    const body = await res.json();
    expect(res.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(fromMock).toHaveBeenCalledWith('subscribers');
    expect(upsertMock).toHaveBeenCalled();
  });
});
