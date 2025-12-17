const fs = require('fs');
const path = require('path');

// Load local settings if present
try {
  const settings = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'api', 'local.settings.json'), 'utf8'));
  if (settings && settings.Values) Object.assign(process.env, settings.Values);
} catch (e) {
  // ignore
}

const login = require(path.join(__dirname, '..', 'api', 'auth', 'login.js'));

async function run() {
  const context = { log: console, log: { error: console.error } };
  const req = { body: { password: 'password123' }, headers: {} };
  const res = await login(context, req);
  console.log('response status:', res.status);
  console.log('headers:', res.headers);
  console.log('body:', res.body);
}

run().catch(e => { console.error(e); process.exit(1); });
