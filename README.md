[![Azure Web App CI/CD](https://github.com/AustIlphukir/SwarmAI-Homepage/actions/workflows/azure-web-app-deploy.yml/badge.svg)](https://github.com/AustIlphukir/SwarmAI-Homepage/actions/workflows/azure-web-app-deploy.yml)

# SwarmAI Homepage

A minimal Next.js 14 application with passkey-protected marketing homepage. Users unlock access with a passkey, and their session persists via HttpOnly cookies and localStorage.

## Overview

- **Framework:** Next.js 14 (App Router)
- **Runtime:** Node.js (Next.js standalone runtime for API routes)
- **Styling:** Tailwind CSS with custom design tokens
- **Database:** Supabase (for subscriber management)
- **Deployment:** Azure Static Web Apps with GitHub Actions

The homepage features:
- ✅ Passkey-protected unlock flow (`/api/unlock`)
- ✅ Newsletter subscription modal with snooze/max-shows logic (`/api/subscribe`)
- ✅ Persisted unlock state (localStorage + HttpOnly cookie)
- ✅ Video background hero section
- ✅ Feature cards and internal navigation
- ✅ Admin database management endpoints

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/                    # Next.js API routes
│   │   │   ├── unlock/             # POST: Unlock homepage with passkey
│   │   │   ├── subscribe/          # POST: Newsletter subscription
│   │   │   ├── lock/               # POST: Lock homepage (clear cookie)
│   │   │   ├── status/             # GET: Check unlock status
│   │   │   └── admin/db/           # POST: DB migrations & resets
│   │   ├── page.tsx                # Homepage (passkey + CTA modal)
│   │   ├── about/                  # About page
│   │   ├── contact/                # Contact page
│   │   ├── product/                # Product page
│   │   ├── services/               # Services page
│   │   └── __tests__/              # Component tests
│   ├── components/                 # Reusable React components
│   ├── middleware.ts               # Next.js middleware (optional route protection)
│   └── globals.css                 # Global styles
├── public/                         # Static assets (images, videos)
├── scripts/                        # Shell scripts for DB management
├── .github/workflows/              # GitHub Actions CI/CD
├── jest.config.ts                  # Test configuration
├── jest.setup.ts                   # Jest setup (matchers, mocks)
├── staticwebapp.config.json        # Azure SWA runtime config
├── tailwind.config.js              # Tailwind CSS config
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies & scripts
└── deploy.sh                       # Interactive deployment script
```

## API Routes

All endpoints are Next.js API routes in `src/app/api/`:

### Public Endpoints

- **POST `/api/unlock`** - Unlock homepage with passkey
  - Request body: `{ key: string }`
  - Response: `{ success: boolean, error?: string }`
  - Sets HttpOnly cookie `swarm_home_unlocked=1`

- **POST `/api/subscribe`** - Subscribe to product updates
  - Request body: `{ role: string, email?: string, consent: boolean }`
  - Response: `{ ok: boolean, note?: string }`
  - Stores subscriber data in Supabase (with IP hash for telemetry)

- **POST `/api/lock`** - Clear unlock session
  - Response: `{ ok: boolean }`
  - Clears `swarm_home_unlocked` cookie

- **GET `/api/status`** - Check if user is unlocked
  - Response: `{ unlocked: boolean }`
  - Reads from HttpOnly cookie (server-side validation)

### Admin Endpoints

- **POST `/api/admin/db/migrate`** - Run database migrations
  - Requires: `Authorization: Bearer {ADMIN_TOKEN}`

- **POST `/api/admin/db/reset`** - Reset database schema
  - Requires: `Authorization: Bearer {ADMIN_TOKEN}`

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with:
#   HOMEPAGE_PASSKEY=your-test-key
#   SUPABASE_URL=your-supabase-url
#   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Run development server
npm run dev
# Open http://localhost:3000

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Environment Variables

### Required (Server-side)

- **`HOMEPAGE_PASSKEY`** or **`NEXT_PUBLIC_HOMEPAGE_PASSKEY`** - Plaintext passkey for `/api/unlock`
- **`SUPABASE_URL`** - Supabase project URL (for `/api/subscribe`)
- **`SUPABASE_SERVICE_ROLE_KEY`** - Supabase service role key (must run on Node runtime)

### Optional

- **`IP_HASH_SALT`** - Random 32+ char string for privacy-preserving IP hashing in subscriber telemetry
- **`ADMIN_TOKEN`** - Token for admin DB management endpoints
- **`NODE_ENV`** - Set to `production` for secure cookie flags in `/api/unlock`

## Key Features & Behaviors

### 1. Passkey Unlock Flow

Users enter a passkey on the locked homepage. Once verified via `/api/unlock`:
- ✅ HttpOnly cookie `swarm_home_unlocked=1` is set (30 days max-age)
- ✅ Client stores `'1'` in localStorage under key `swarm_home_unlocked`
- ✅ Homepage content is revealed
- ✅ On future visits, localStorage prevents re-prompting

**File:** `src/app/page.tsx`

### 2. Newsletter Subscription Modal

The modal follows these rules (stored in localStorage under `swarm_role_modal_meta`):
- Shows only if less than 3 times shown (`MAX_SHOWS=3`)
- "Not now" button snoozes for 14 days (`SNOOZE_DAYS=14`)
- On subscribe, data is upserted to Supabase with:
  - Email (normalized to lowercase, optional)
  - Role (required, 1-64 chars)
  - Consent flag (required if email provided)
  - IP hash (privacy-preserving telemetry)

**File:** `src/app/page.tsx`

### 3. Local Storage Keys

| Key | Purpose | Value Type |
|-----|---------|------------|
| `swarm_home_unlocked` | Unlock state persistence | `'1'` or empty |
| `swarm_role_modal_meta` | CTA modal visibility tracking | JSON: `{ totalShows, lastShowTs, lastDismissTs }` |

### 4. Database Schema (Supabase)

The `subscribers` table structure (managed via migrations):
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_norm TEXT UNIQUE,
  role TEXT NOT NULL,
  consent BOOLEAN,
  ip_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email_norm, role)
);
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/app/__tests__/HomePage.test.tsx

# Generate coverage report
npm test -- --coverage
```

**Test Files:**
- `src/app/__tests__/HomePage.test.tsx` - Homepage unlocked state
- `src/app/__tests__/page.unlock.test.tsx` - Unlock flow
- `src/app/__tests__/page.cta.test.tsx` - CTA modal logic
- `src/app/__tests__/page.unlocked.test.tsx` - Unlocked view
- `src/__tests__/middleware.test.ts` - Route middleware

**Coverage:** ~71% statements, ~76% lines (41 tests passing)

**Testing best practices:**
- Use `jest.useFakeTimers()` for timer-dependent tests
- Mock `global.fetch` for API calls to avoid real network requests
- Clear localStorage in `beforeEach` to avoid test pollution
- Use `@testing-library/react` with `getByRole()` for accessible selectors

## Deployment

### Azure Web App (Recommended)

This project is configured for automatic deployment via GitHub Actions to Azure Web App.

**Quick Deploy:**
```bash
./scripts/deploy.sh
```

This will:
- Check git status and prompt for commit
- Push to `main` branch
- Trigger GitHub Actions workflow
- Automatically deploy to Azure Web App

**Manual Deployment:**
```bash
git add .
git commit -m "Your changes"
git push origin main
# GitHub Actions automatically builds, tests, and deploys to Azure Web App
```

### GitHub Actions Workflow

Located in `.github/workflows/azure-web-app-deploy.yml`. The workflow:

1. ✅ Checks out code
2. ✅ Sets up Node.js 22
3. ✅ Installs dependencies (`npm ci`)
4. ✅ Runs tests (`npm test`)
5. ✅ Builds Next.js app (`npm run build`)
6. ✅ Deploys to Azure Web App via publish profile

### Azure Web App Configuration

**Node.js Runtime:**
- Runtime: Node.js 22 LTS
- App type: Web App (Linux/Windows compatible)
- Startup command: `npm start` (or configure in Azure Portal)

**Application Settings (Azure Portal):**
- `NEXT_PUBLIC_HOMEPAGE_PASSKEY` - Homepage passkey
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `IP_HASH_SALT` - Random salt for IP hashing
- `ADMIN_TOKEN` - Admin API token
- `NODE_ENV` - Set to `production`
- `PORT` - Usually 8080 (default for Web App)

### Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

- **`AZURE_WEB_APP_NAME`** - Name of your Azure Web App
- **`AZURE_PUBLISH_PROFILE`** - Publish profile from Azure Portal
  - Get from: Azure Portal → Web App → Overview → "Download publish profile"
- **`HOMEPAGE_PASSKEY`** - Passkey for homepage unlock
- **`SUPABASE_URL`** - Supabase project URL
- **`SUPABASE_SERVICE_ROLE_KEY`** - Supabase service role key
- **`IP_HASH_SALT`** - Random salt for IP hashing (optional)
- **`ADMIN_TOKEN`** - Token for admin API routes (optional)

### Local Testing

Test the build locally before deploying:

```bash
npm run build
npm start
# Open http://localhost:3000
```

## Build & Production

```bash
# Build the application
npm run build

# Start production server locally
npm start

# Export as static site (if needed)
npm run export
```

**Build artifacts:**
- `.next/` - Next.js compiled output (standalone build)
- `.next/static/` - JavaScript, CSS, images
- `public/` - Public assets (copied to output)

## Project Conventions

### Code Style

- **Client Components:** Use `"use client"` at top of files that need browser APIs
- **Server Components:** Default for route handlers and server-only logic
- **Styling:** Tailwind CSS utility classes + design tokens (`bg-card`, `text-accent1`)
- **Components:** Live under `src/components/` or co-located in `src/app/[route]/`

### Naming Conventions

- Local storage keys: `snake_case` prefixed with `swarm_` (e.g., `swarm_home_unlocked`)
- API routes: lowercase, descriptive (e.g., `/api/unlock`, `/api/subscribe`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_SHOWS`, `SNOOZE_DAYS`)
- Environment variables: `UPPER_SNAKE_CASE` with underscore separators

### Accessibility

- All interactive elements have proper ARIA labels
- Modals use `role="dialog"` and `aria-modal="true"`
- Color contrast meets WCAG AA standards
- Keyboard navigation fully supported

## Troubleshooting

### Unlock Not Working

1. **Check environment variable:** Verify `HOMEPAGE_PASSKEY` is set in `.env.local` or Azure
2. **Check browser console:** Network errors in `/api/unlock` call?
3. **Clear localStorage:** Open DevTools → Application → Clear Storage
4. **Verify cookie:** Check DevTools → Application → Cookies for `swarm_home_unlocked`

### Subscribe Endpoint Failing

1. **Verify Supabase credentials:** Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
2. **Check database:** Ensure `subscribers` table exists in Supabase (run migrations)
3. **Email validation:** Verify email format matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
4. **Consent requirement:** Email subscriptions require `consent: true`

### Tests Failing

1. **Clear coverage:** `rm -rf coverage/`
2. **Reinstall packages:** `rm -rf node_modules package-lock.json && npm install`
3. **Check Node version:** Requires Node.js 18+ (or use `nvm`)
4. **Run with verbose:** `npm test -- --verbose`

## Contributing

Before pushing changes:
1. Run tests: `npm test`
2. Check coverage: Coverage report in `coverage/lcov-report/index.html`
3. Build locally: `npm run build`
4. Use the deploy script: `./deploy.sh`

## License

Proprietary — SwarmAI Technologies GmbH

## Support

For issues or questions:
- Create a GitHub issue
- Check existing documentation in `.github/copilot-instructions.md`
- Review test files for usage examples
