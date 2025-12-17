E2E Function Tests (Direct Invocation)

This small test runs the serverless function handlers directly (no SWA proxy required) to validate the login → me → content flow.

Prerequisites
- Node.js installed (any modern version works because we call the handlers directly)

Run

```bash
# from repository root
npm run e2e:functions
```

Notes
- This test reads `api/local.settings.json` if present to load `PREVIEW_PASSWORD_HASH` and `SESSION_SIGNING_KEY` for local testing.
- The test uses the sample password `password123` that is present in the example local.settings file created during setup.
