# Supabase Project

A Supabase project with Edge Functions, database schemas, and automated testing.

## Project Structure

```
.
├── config.toml                 # Supabase project configuration
├── deno.json                   # Deno runtime configuration
├── deno.lock                   # Deno dependency lock file
├── functions/                  # Supabase Edge Functions
│   ├── helpers/
│   │   └── supabase.ts        # Shared Supabase client utilities
│   └── seed_users/            # User seeding function
│       ├── handler.ts         # Business logic
│       └── index.ts           # Function entry point
├── migrations/                 # Database migrations
│   └── 20251203173009_restore_pg_net.sql
├── schemas/                    # Database schema definitions
│   └── user.sql               # User table schema
└── tests/                      # Test files
    ├── database/
    │   └── user.test.sql      # Database schema tests
    └── seed_users/
        └── handler.test.ts    # Edge Function tests
```

## Getting Started

### Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- [Deno](https://deno.land/) runtime (for local Edge Function development)
- PostgreSQL client (optional, for direct database access)

### Installation

1. Clone the repository
2. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

3. Start the local Supabase instance:
   ```bash
   supabase start
   ```

### Development

#### Running Edge Functions Locally

```bash
supabase functions serve seed_users
```

#### Applying Migrations

```bash
supabase db reset  # Reset and apply all migrations
# or
supabase db push   # Apply pending migrations
```

#### Running Tests

**Database Tests:**
```bash
supabase test db
```

**Edge Function Tests:**
```bash
deno test --allow-all tests/seed_users/handler.test.ts
```

## Edge Functions

### seed_users

Seeds user data into the database.

**Endpoint:** `/functions/v1/seed_users`

**Usage:**
```bash
curl -X POST 'http://localhost:54321/functions/v1/seed_users' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

## Database Schema

The `user.sql` schema defines the user table structure. Apply it using migrations or by running:

```bash
supabase db execute --file schemas/user.sql
```

## Deployment

### Deploy Edge Functions

```bash
supabase functions deploy seed_users
```

### Deploy Database Changes

```bash
supabase db push
```

### Link to Remote Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

## Configuration

Configuration is managed in `config.toml`. Update this file to customize your local development environment settings.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Write tests for new functionality
4. Run tests to ensure everything passes
5. Submit a pull request
