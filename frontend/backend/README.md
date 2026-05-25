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
- `GET /api/health` - Server health status

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
