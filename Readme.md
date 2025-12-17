## API Routes

All API endpoints are Next.js API routes in `src/app/api/`:

- **`/api/unlock`** - POST: Unlock homepage with passkey (sets HttpOnly cookie + localStorage)
- **`/api/lock`** - POST: Lock homepage (clears cookie)
- **`/api/status`** - GET: Check unlock status (reads cookie)
- **`/api/subscribe`** - POST: Subscribe to product updates (stores in Supabase)
- **`/api/admin/db/migrate`** - POST: Run DB migrations (requires ADMIN_TOKEN)
- **`/api/admin/db/reset`** - POST: Reset DB schema (requires ADMIN_TOKEN)

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

