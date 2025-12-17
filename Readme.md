## API Routes

All API endpoints are Next.js API routes in `src/app/api/`:

- **`/api/unlock`** - POST: Unlock homepage with passkey (sets HttpOnly cookie + localStorage)
- **`/api/lock`** - POST: Lock homepage (clears cookie)
- **`/api/status`** - GET: Check unlock status (reads cookie)
- **`/api/subscribe`** - POST: Subscribe to product updates (stores in Supabase)
- **`/api/admin/db/migrate`** - POST: Run DB migrations (requires ADMIN_TOKEN)
- **`/api/admin/db/reset`** - POST: Reset DB schema (requires ADMIN_TOKEN)

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

**Environment Setup:**
1. Copy `.env` with required variables (see Azure SWA section below)
2. Update `NEXT_PUBLIC_HOMEPAGE_PASSKEY` for local testing
3. Configure Supabase credentials if using subscribe feature

## Deployment

### Quick Deploy (Recommended)

```bash
./deploy.sh
```

This interactive script will:
- Check git status
- Prompt for commit & push
- Automatically merge to `main` if needed
- Trigger GitHub Actions deployment to Azure SWA

### Manual Deploy

```bash
git add .
git commit -m "Your message"
git push origin main  # Triggers automatic Azure deployment
```

The GitHub Actions workflow will automatically:
- Run all tests
- Build the Next.js app
- Deploy to Azure Static Web Apps

## Azure Static Web Apps Deployment

This project is configured for Azure Static Web Apps with Next.js:

1. Build command: `npm run build`
2. Output location: `.next` (Next.js standalone build)
3. API routes are handled by Next.js runtime (Node.js 18)
4. Runtime configuration: `staticwebapp.config.json`

### GitHub Actions Workflow

The deployment workflow (`.github/workflows/azure-static-web-apps-*.yml`) does:

1. ✅ Checkout code
2. ✅ Setup Node.js 18
3. ✅ Install dependencies (`npm ci`)
4. ✅ Run tests (`npm test`)
5. ✅ Build Next.js app (`npm run build`)
6. ✅ Deploy to Azure Static Web Apps

**Deployment Status:** [View on GitHub Actions](https://github.com/AustIlphukir/SwarmAI/actions)

### Required GitHub Secrets

Configure these in your GitHub repository settings (Settings → Secrets and variables → Actions):

- **`AZURE_STATIC_WEB_APPS_API_TOKEN_HAPPY_POND_0CC717910`** - Azure SWA deployment token (auto-generated)
- **`HOMEPAGE_PASSKEY`** - Passkey for unlocking the homepage
- **`SUPABASE_URL`** - Supabase project URL
- **`SUPABASE_SERVICE_ROLE_KEY`** - Supabase service role key (for subscribe endpoint)
- **`IP_HASH_SALT`** - Salt for IP hashing (optional, for privacy)
- **`ADMIN_TOKEN`** - Token for admin API routes (DB management)

### Azure Static Web Apps Environment Variables

After deployment, also configure these in Azure Portal (Static Web App → Configuration):

- `HOMEPAGE_PASSKEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `IP_HASH_SALT`
- `ADMIN_TOKEN`
- `NODE_ENV=production`

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API routes
│   │   │   ├── unlock/       # Homepage unlock endpoint
│   │   │   ├── subscribe/    # Newsletter subscription
│   │   │   └── admin/        # Admin endpoints (DB management)
│   │   ├── page.tsx          # Homepage with passkey protection
│   │   ├── about/            # About page
│   │   ├── contact/          # Contact page
│   │   └── product/          # Product page
│   ├── components/           # Reusable React components
│   └── middleware.ts         # Next.js middleware (route protection)
├── public/                   # Static assets (images, videos)
├── .github/workflows/        # GitHub Actions deployment config
├── staticwebapp.config.json  # Azure SWA runtime configuration
├── deploy.sh                 # Interactive deployment script
└── jest.config.ts            # Test configuration
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- path/to/test.test.tsx
```

**Test Coverage:**
- Current coverage: ~71% statements, ~76% lines
- All 41 tests passing
- Coverage thresholds configured in `jest.config.ts`

