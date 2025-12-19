# Supabase Schema & Configuration

Database setup for SwarmAI homepage subscriber management.

## Environment Variables

Configure these in your Supabase project and GitHub/Azure:

```bash
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # Keep secret!
IP_HASH_SALT=<random-32+-char-string>         # For IP hashing
```

## Database Schema

### `subscribers` Table (Required)

Stores newsletter subscribers and product interest signups.

```sql
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_norm TEXT,
  role TEXT NOT NULL,
  consent BOOLEAN DEFAULT FALSE,
  ip_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(email_norm, role)
);

-- Enable RLS (Row Level Security) if desired
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for anon users to INSERT
CREATE POLICY "Allow anon inserts" ON public.subscribers
  FOR INSERT WITH CHECK (TRUE);
```

**Fields:**
- `id` - Unique subscriber identifier
- `email_norm` - Lowercase normalized email (optional, indexed)
- `role` - Product interest category (e.g., "security", "management", "operations")
- `consent` - Email consent flag (required if email provided)
- `ip_hash` - SHA256 hash of client IP + salt (privacy-preserving telemetry)
- `created_at` - Subscription timestamp

### Optional Audit Tables

For enhanced tracking, optionally create:

```sql
CREATE TABLE public.subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES public.subscribers(id),
  event TEXT NOT NULL,  -- 'created', 'updated', 'failed'
  error_msg TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Integration

The `/api/subscribe` endpoint:
1. Validates request body: `{ role: string, email?: string, consent: boolean }`
2. Normalizes email to lowercase
3. Hashes client IP with `IP_HASH_SALT`
4. UPSERTs into `subscribers` table
5. Returns `{ ok: true, note?: 'already_subscribed' }`

## Security Notes

- **Service Role Key:** Only used server-side in Node.js API routes (never exposed to browser)
- **IP Hashing:** Reduces PII storage while enabling IP-based duplicate detection
- **Email Validation:** Simple regex check: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **RLS Policies:** Enable Row Level Security for production to restrict data access

## Migrations

Run database migrations via:

```bash
ADMIN_TOKEN=your-token npm run db:migrate
```

See `scripts/db-migrate.sh` for implementation.
