# Empire of Forex Web Project

Empire of Forex is a full-stack fintech and trading platform that combines a public marketing site, authentication, investor dashboard, signal marketplace, account dashboard, transaction and withdrawal flows, and an administrative control surface.

## Project Scope

This repository contains:

- Backend: Express.js + TypeScript + Prisma + PostgreSQL-ready API
- Frontend: Next.js + TypeScript + App Router + Tailwind styling
- Docker compose setup for local or production-style orchestration

## Main Product Areas

1. Public landing pages for services, trading signals, investment plans, and blog content
2. Authenticated investor dashboard for portfolio, transactions, investments, funds, and signals
3. Admin dashboard for user management, signal management, support, withdrawals, and notifications
4. Broker, withdrawal, notification, support, and analysis features for complete customer lifecycle management

## Repository Layout

- `backend/` node API resources and Prisma schema
- `frontend/` Next.js UI and app routes
- `docs/` project documentation

## Documentation

- Developer guide: `docs/DEVELOPER_GUIDE.md`
- User guide: `docs/USER_GUIDE.md`

## Backend Quick Start

```bash
cd backend
npm install
npm run dev
```

## Frontend Quick Start

```bash
cd frontend
npm install
npm run dev
```

## Docker Compose

```bash
docker compose -f frontend/docker-compose.yml up --build
```

## Production Notes

The API uses Express middleware for security, CORS, rate limiting, uploads, and error handling. The Prisma schema is the source of truth for the database model layer, and PostgreSQL is the intended production data store.
