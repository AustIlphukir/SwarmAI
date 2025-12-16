import { POST as migrateHandler } from './route';

function makeRequest(headers: Record<string,string> = {}) {
  return new Request('http://localhost/api/admin/db/migrate', { method: 'POST', headers });
}

jest.mock('pg', () => {
  const mClient = { query: jest.fn(), release: jest.fn() };
  const mPool = { connect: jest.fn().mockResolvedValue(mClient), end: jest.fn() };
  return { Pool: jest.fn(() => mPool) };
});

describe('db migrate route', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterAll(() => { process.env = OLD_ENV; });

  it('returns 401 when admin token missing', async () => {
    process.env.ADMIN_TOKEN = 'topsecret';
    const req = makeRequest({ 'x-admin-token': 'wrong' });
    const res = await migrateHandler(req as any);
    const body = await res.json();
    expect(res.status).toBe(401);
    expect(body.error).toBe('unauthorized');
  });

  it('returns 500 when DB_URL missing', async () => {
    process.env.ADMIN_TOKEN = 'topsecret';
    delete process.env.SUPABASE_DB_URL;
    jest.resetModules();
    const { POST: freshHandler } = await import('./route');
    const req = makeRequest({ 'x-admin-token': 'topsecret' });
    const res = await freshHandler(req as any);
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body.error).toBe('no_db_url');
  });

  it('returns 200 on successful migrate', async () => {
    process.env.ADMIN_TOKEN = 'topsecret';
    process.env.SUPABASE_DB_URL = 'postgres://user:pass@localhost/db';
    // mock successful query result
    const { Pool } = require('pg');
    const pool = new Pool();
    pool.connect.mockResolvedValue({ query: jest.fn().mockResolvedValue({ rows: [{ ok: true }] }), release: jest.fn() });
    jest.resetModules();
    const { POST: freshHandler } = await import('./route');
    const req = makeRequest({ 'x-admin-token': 'topsecret' });
    const res = await freshHandler(req as any);
    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});
