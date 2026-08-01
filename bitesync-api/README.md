# bitesync-api

Backend REST API for BiteSync — Express + TypeScript + Prisma + PostgreSQL.

## Endpoints

- `GET /health` — health check
- `GET /meals` — list all meals (optionally `?date=YYYY-MM-DD` to filter)
- `POST /meals` — create a meal (`{ name, calories, protein, carbs, fat }`)
- `GET /meals/summary?date=YYYY-MM-DD` — aggregated totals for that day

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a free Postgres database on Neon

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string it gives you (starts with `postgresql://`)

### 3. Configure environment variables

```bash
cp .env.example .env
```

Paste your Neon connection string into `.env` as `DATABASE_URL`.

### 4. Run the first migration

```bash
npx prisma migrate dev --name init
```

This creates the `Meal` table in your Neon database and generates the Prisma client.

### 5. Start the dev server

```bash
npm run dev
```

Server runs at `http://localhost:4000`.

### 6. (Optional) Browse your data visually

```bash
npm run prisma:studio
```

Opens Prisma Studio at `http://localhost:5555` — a GUI for viewing/editing rows.

## Testing it quickly

```bash
curl -X POST http://localhost:4000/meals \
  -H "Content-Type: application/json" \
  -d '{"name":"Chicken & Rice","calories":540,"protein":45,"carbs":50,"fat":12}'

curl http://localhost:4000/meals

curl "http://localhost:4000/meals/summary?date=2026-07-24"
```
