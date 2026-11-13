# Empire of Forex Backend API

Complete backend API for the Empire of Forex platform built with Node.js, Express, and SQLite.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (already set in `.env`):
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
FRONTEND_URL=http://localhost:3000
DATABASE_PATH=./empire_forex.db
```

3. Start the server in development mode:
```bash
npm run dev
```

The server will be available at `http://localhost:5000/api`

### Build for Production

```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Investments
- `GET /api/investments` - Get all investments
- `POST /api/investments` - Create investment
- `GET /api/investments/:id` - Get investment by ID
- `PUT /api/investments/:id` - Update investment

### Signals
- `GET /api/signals` - Get all signals
- `POST /api/signals` - Create signal
- `GET /api/signals/:id` - Get signal by ID
- `PUT /api/signals/:id` - Update signal

### Health Check
- `GET /health` - Server health status

## 📝 Example Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Database

SQLite database is automatically created on first run at `empire_forex.db`

### Tables
- **users** - User accounts with authentication
- **sessions** - User sessions and tokens
- **investments** - User investments
- **signals** - Forex trading signals

## 🔐 Authentication

All endpoints except auth endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## 📊 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | development | Environment mode |
| PORT | 5000 | Server port |
| JWT_SECRET | secret | JWT signing secret |
| FRONTEND_URL | http://localhost:3000 | Frontend URL for CORS |
| DATABASE_PATH | ./empire_forex.db | SQLite database path |

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3
- **Authentication:** JWT + bcryptjs
- **Language:** TypeScript
- **CORS:** Enabled for frontend

## 📦 Dependencies

- `express` - Web framework
- `cors` - Cross-origin support
- `sqlite3` - Database
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `uuid` - Unique ID generation
- `dotenv` - Environment variables
- `typescript` - Type safety

## 🧪 Testing

The API can be tested using Postman, cURL, or any REST client.

## 📝 Notes

- Passwords are hashed using bcrypt (10 rounds)
- JWTs expire in 7 days
- Database is created in the root directory automatically
- CORS is configured for the frontend URL
- All responses follow a consistent JSON structure with `success`, `message`, and `data` fields

## 🚀 Deployment

For production:
1. Update `JWT_SECRET` to a strong random string
2. Set `NODE_ENV=production`
3. Use a production database (PostgreSQL recommended)
4. Configure proper HTTPS
5. Set up environment variables securely

## Office RBAC

The office RBAC layer uses the existing PostgreSQL/Prisma database. After deploying
the migration, generate the Prisma client and seed the system roles and editable
default permission matrix:

```bash
npm run prisma:generate
npm run prisma:seed
```

Edit the typed matrix in `src/modules/rbac/permissions.config.ts`, then run the
seed again to reconcile the role-permission mappings. System role names are
stable; the seed does not rename or delete them.

Apply pending migrations with `npx prisma migrate deploy` before generating the
client and seeding. Office user-management endpoints are under
`/api/office/users`; scoped team members are returned from `GET /api/office/team`.
Effective UI permissions are returned from `GET /api/me/permissions`; the Next.js `<Can>`
component is only a presentation helper, and all authorization is enforced by
the backend. User-management requests require a bearer access token, and creating
an Admin, changing a role, or activating/deactivating a user requires
`passwordConfirm`.

Access tokens contain the RBAC identity claims (`userId`, `roleId`, and
`permissionsVersion`, in addition to standard JWT metadata). Admin tokens also
contain a session ID (`sid`); refresh-token rotation preserves it.

## Admin access logs

Apply the `20261106120000_admin_access_logs` Prisma migration before deploying
the updated API, then regenerate Prisma Client. The Super Admin-only Access
Logs page is available at `/super-admin/access-logs`. Existing administrators
must sign in again after deployment to receive a session-bound token.

Configure `TRUST_PROXY_HOPS` to the number of trusted reverse proxies in front
of the Render service (normally `1` when Render is the only proxy). The API
uses the configured CORS origins for its Socket.IO presence channel. The
frontend must have `NEXT_PUBLIC_API_URL` set to the API base URL (with or
without `/api`); no additional credentials are needed.

Admin sessions are timed out after two minutes without a heartbeat and the
socket disconnect grace period is 60 seconds. Page-visit details are retained
for 90 days; sessions and activities for one year. Sensitive-action logs only
record a fixed action name, target identifier, IP, and timestamp—not request
bodies or credentials. Suspicious admin sign-ins create in-app security
notifications for active Super Admin accounts.

```bash
npx prisma migrate deploy
npm run prisma:generate
npm run build
```

### Render sleep behavior

Render Free web services sleep after a period without traffic. The API cannot
prevent this from inside the same service because the process is suspended
while it is idle. To keep the service warm, create an external uptime monitor
(for example, UptimeRobot or Better Uptime) with these settings:

- Monitor type: HTTP(s)
- URL: `https://YOUR-RENDER-SERVICE.onrender.com/health`
- Method: GET
- Interval: every 5 minutes (10 minutes is also acceptable)

The endpoint is public and does not require authentication. The first request
after a sleep may still take longer while Render starts the service. A paid
Render instance avoids the free-tier spin-down behavior.
