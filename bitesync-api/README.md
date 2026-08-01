# bitesync-api

Backend REST API for BiteSync — Express + TypeScript + Prisma + PostgreSQL.

## Endpoints

All `/meals` endpoints require an `Authorization: Bearer <token>` header —
get a token from `/auth/register` or `/auth/login` first.

- `GET /health` — health check (no auth)
- `POST /auth/register` — create an account, `{ email, password }` → `{ token, user }`
- `POST /auth/login` — `{ email, password }` → `{ token, user }`
- `GET /meals` — paginated list, `?limit=20&cursor=<mealId>`, or `?date=YYYY-MM-DD` to filter by day
- `POST /meals` — create a meal (`{ name, calories, protein, carbs, fat }`)
- `GET /meals/summary?date=YYYY-MM-DD` — aggregated totals for that day (computed in Postgres via `aggregate`, not pulled row-by-row)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Postgres

Use Neon or the Prisma Postgres database already provisioned for this
project in the Prisma Console — either works, just make sure `DATABASE_URL`
points at whichever one is your source of truth.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in `DATABASE_URL` and generate a `JWT_SECRET`:

```bash
openssl rand -hex 32
```

### 4. Run the first migration

```bash
npx prisma migrate dev --name add_users_and_auth
```

This creates the `User` and `Meal` tables and generates the Prisma client.
Note: this migration adds a required `userId` on `Meal` — if you already
have meal rows in your database from before auth existed, you'll need to
either wipe the table or backfill a `userId` before this migration will
apply cleanly.

### 5. Start the dev server

```bash
npm run dev
```

Server runs at `http://localhost:4000`.

### 6. (Optional) Browse your data visually

```bash
npm run prisma:studio
```

## Running tests

```bash
npm test        # run once
npm run test:watch   # watch mode
```

Tests cover `MealsService` and `AuthService` against in-memory fake
repositories — no database or network required, and they run in a few
seconds.

## Testing the API manually

```bash
# Register
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"a-strong-password"}'

# Copy the token from the response, then:
TOKEN="paste-token-here"

curl -X POST http://localhost:4000/meals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Chicken & Rice","calories":540,"protein":45,"carbs":50,"fat":12}'

curl http://localhost:4000/meals \
  -H "Authorization: Bearer $TOKEN"

curl "http://localhost:4000/meals/summary?date=2026-08-01" \
  -H "Authorization: Bearer $TOKEN"
```

## Rate limits

- General API: 300 requests / 15 min per IP
- `/auth/login` and `/auth/register`: 10 requests / 15 min per IP (stricter, since these are the highest-value brute-force target)

## Logging

Structured logs via `pino`. Pretty-printed in development, JSON in
production (`NODE_ENV=production`) so they're easy to ship to a log
aggregator later.
