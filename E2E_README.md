# E2E Integration Tests

End-to-end tests for the SwarmAI homepage unlock and subscription flows.

## Prerequisites

- Node.js 18+ installed
- `.env.local` configured with test credentials (see Configuration below)

## Running E2E Tests

```bash
# Run E2E function tests (direct API handler invocation)
npm run e2e:functions

# Run unit tests with coverage
npm test

# Run tests in watch mode
npm test -- --watch
```

## Configuration

Create a `.env.local` file in the repository root:

```bash
# Test passkey for unlock flow
HOMEPAGE_PASSKEY=test-passkey-123

# Supabase test credentials (optional for subscribe tests)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
IP_HASH_SALT=your-random-salt-32chars-or-more

# Admin token for DB management endpoints
ADMIN_TOKEN=your-admin-token-123
```

## Test Coverage

The test suite covers:
- **Unlock flow** - Passkey validation via `/api/unlock`
- **Subscribe flow** - Newsletter signup via `/api/subscribe`
- **Lock/Status** - Session management via `/api/lock` and `/api/status`
- **CTA Modal** - localStorage-based visibility tracking
- **Accessibility** - ARIA labels, keyboard navigation

Current coverage: ~71% statements, ~76% lines (41 tests passing)

Target thresholds (jest.config.ts):
- Branches: 70%
- Functions: 70%
- Lines: 75%
- Statements: 70%

## Notes

- Tests use `jest-environment-jsdom` for component testing with DOM APIs
- API tests mock `global.fetch` to avoid real network calls
- localStorage is cleared in `beforeEach` to prevent test pollution
- Timers use `jest.useFakeTimers()` for deterministic async testing
- See `jest.setup.ts` for test environment configuration
