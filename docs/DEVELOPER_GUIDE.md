# Developer Guide

## 1. Project Purpose

Empire of Forex is a full-stack web platform for a forex education, analysis, signal, and investment product. It includes a public marketing experience, a user dashboard, an investment lifecycle, account support, and an admin capability for automated operations.

## 2. Stack Summary

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL-compatible database configuration
- JWT authentication and role-based access middleware
- Express-rate-limit and security middleware
- multer-based uploads
- WebSocket support handler

### Frontend

- Next.js App Router
- React 19
- TypeScript
- Tailwind and custom CSS styling
- Radix UI primitives and shadcn-style component patterns
- Zustand state management
- NextAuth provider wiring

## 3. Repository Layout

```text
backend/
  src/
    controllers/
    middleware/
    models/
    routes/
    services/
    types/
    websocket/
  prisma/
  package.json
  Dockerfile

frontend/
  src/
    app/
    components/
    hooks/
    lib/
    services/
    store/
    types/
  package.json
  Dockerfile
  docker-compose.yml
```

## 4. Main Backend Modules

### Route Domains

The backend registers Express route groups in the server bootstrap:

- `/api/auth` for registration, login, verification, and user session identity
- `/api/investments` for investing and portfolio record creation
- `/api/transactions` for user transaction history and related records
- `/api/signals` for signal records and signal signal metadata
- `/api/admin` and `/api/admin/management` for admin operations
- `/api/analysis` for market analysis content and comments
- `/api/brokers` for broker reviews and broker account linking
- `/api/withdrawals` for withdrawal processing
- `/api/notifications` for push and inbox notification management
- `/api/support` for ticketing and support messages
- `/api/users` for user management
- `/api/blog` for blog or article content

### Middleware and Security

The backend uses:

- `helmet` for headers
- `hpp` for parameter pollution prevention
- `rateLimiter` for general API throttle protection
- `cors` configuration for frontend origin control
- JWT-based auth middleware and admin/superadmin middleware checks

### Domain Models

The Prisma schema defines models for realistic fintech operations including `User`, `Role`, `Permission`, `RolePermission`, `AdminPermission`, `AdminUser`, `AdminAction`, `Investment`, `Transaction`, `Signal`, `Campaign`, `Withdrawal`, `BrokerAccount`, `BrokerReview`, `Analysis`, `Notification`, `SupportTicket`, and support-heavy records.

## 5. Main Frontend Modules

The frontend is organized around route groups:

- `(landing)` public marketing path for home, services, signals, pricing, terms, privacy, blog, loans, and investment plans
- `(auth)` login and register pages
- `(dashboard)` real app experience for user account, transactions, investments, signals, support, settings, portfolio, and notifications
- `(admin)` admin dashboard, user management, signal admin, support admin, and deposit management

The UI uses a `store/authStore` and route-based runtime guards. Components are organized in separate feature folders such as `components/admin`, `components/auth`, `components/dashboard`, `components/landing`, `components/signals`, and `components/User`.

## 6. Local Setup

### Backend

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 7. Environment Variables

### Backend

Recommended variables:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=change_me
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/empire_forex
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/empire_forex
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change_me
```

## 8. Database and Prisma

The database is modeled in `backend/prisma/schema.prisma`. The project is designed around Prisma and PostgreSQL. Run migrations with:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## 9. Build and Deployment

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

### Docker Compose

A frontend Docker Compose file exists and wires a PostgreSQL service, backend service, frontend service, and optional nginx reverse proxy service. Production workflow should run from the root and use environment variables for secrets and service endpoints.

## 10. Code Conventions

- Backend TypeScript code uses Express route and controller/model separation.
- Prisma models and migrations are the persistence source of truth.
- Frontend uses App Router folder-based pages and shared route-level layout components.
- Styling is mostly Tailwind-based with CSS variables and custom global CSS in the frontend.

## 11. Testing and Hardening

Follow this checklist before production:

1. Rotate all sample secrets and JWT tokens.
2. Run Prisma migrations against a clean database.
3. Confirm production environment includes `DATABASE_URL` and `DIRECT_URL` correctly.
4. Verify CORS origin allowlist and CSRF/HTTPS configuration.
5. Review rate limiting and request validation settings.
6. Validate admin and super-admin permission flows.
7. Confirm upload and static asset storage use an external or secure volume in production.

## 12. Known Implementation Notes

The repo is organized around functional routes rather than a heavily generated service-level architecture. The UI and API are collaborative but not perfectly separated physically. The Prisma schema is significantly more complete than the initial backend README from the original repository and should be treated as the canonical model.
