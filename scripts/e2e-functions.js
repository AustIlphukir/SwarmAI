const fs = require('fs');
const path = require('path');

// Load local.settings.json into process.env if present
try {
  const settings = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'api', 'local.settings.json'), 'utf8'));
  if (settings && settings.Values) Object.assign(process.env, settings.Values);
} catch (e) {
  // ignore
}

const login = require(path.join(__dirname, '..', 'api', 'auth', 'login.js'));
const me = require(path.join(__dirname, '..', 'api', 'auth', 'me.js'));
const home = require(path.join(__dirname, '..', 'api', 'content', 'home.js'));

async function run() {
  const context = { log: console };

  console.log('Running E2E function tests (direct invocation)');

  const r1 = await login(context, { body: { password: 'password123' }, headers: {} });
  console.log('login status:', r1.status);
  console.log('login headers:', r1.headers && Object.keys(r1.headers));
  if (!r1.headers || !r1.headers['Set-Cookie']) throw new Error('login did not set cookie');
  const cookie = r1.headers['Set-Cookie'];

  const r2 = await me(context, { headers: { cookie } });
  console.log('me status:', r2.status, 'body:', r2.body);
  if (r2.status !== 200 || !r2.body || !r2.body.authenticated) throw new Error('me failed');

  const r3 = await home(context, { headers: { cookie } });
  console.log('home status:', r3.status);
  console.log('home body sample:', JSON.stringify(r3.body, null, 2));
  if (r3.status !== 200) throw new Error('home failed');

  console.log('E2E function tests passed');
  // Negative test: wrong password should return 401
  try {
    const bad = await login(context, { body: { password: 'not-the-password' }, headers: {} });
    if (bad.status !== 401) throw new Error('expected 401 for bad password, got ' + bad.status);
    console.log('negative test (bad password) passed');
  } catch (err) {
    console.error('negative test (bad password) failed', err);
    throw err;
  }

  // Negative test: expired token
  try {
    // generate a short-lived token by signing directly
    const jwt = require('jsonwebtoken');
    const signingKey = process.env.SESSION_SIGNING_KEY;
    if (!signingKey) throw new Error('no signing key for expired token test');
    const short = jwt.sign({ scope: 'preview' }, signingKey, { expiresIn: '1s' });
    const cookieShort = `session=${short}`;
    // wait for token to expire
    await new Promise(resolve => setTimeout(resolve, 1500));
    const rExpired = await me(context, { headers: { cookie: cookieShort } });
    if (rExpired.status !== 401) throw new Error('expected 401 for expired token, got ' + rExpired.status);
    console.log('negative test (expired token) passed');
  } catch (err) {
    console.error('negative test (expired token) failed', err);
    throw err;
  }
}

run().catch(err => { console.error(err); process.exit(1); });
