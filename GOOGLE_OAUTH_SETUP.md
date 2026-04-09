# Google OAuth Setup Guide

Follow these steps to enable Google Sign-In for your Empire of Forex platform:

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Enter project name: `Empire of Forex`
4. Click "Create"

## Step 2: Enable Google OAuth 2.0

1. In the Cloud Console, go to **APIs & Services** > **Credentials**
2. Click **+ Create Credentials** > **OAuth 2.0 Client ID**
3. Choose **Web application**
4. For Authorized JavaScript origins, add:
   - `http://localhost:3000` (development)
   - `http://127.0.0.1:3000`
   - Your production domain (e.g., `https://empireofforex.com`)

5. For Authorized redirect URIs, add:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `http://127.0.0.1:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (production)

6. Click "Create"
7. Copy your **Client ID** and **Client Secret**

## Step 3: Update Environment Variables

Update your `.env.local` file in the frontend folder:

```env
GOOGLE_CLIENT_ID=your-client-id-from-step-2
GOOGLE_CLIENT_SECRET=your-client-secret-from-step-2
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with: openssl rand -base64 32
```

## Step 4: Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output and paste it into `.env.local` as the `NEXTAUTH_SECRET` value.

## Step 5: Backend Google OAuth Endpoint (Optional)

If you want to create profiles in your database on first Google login, add this endpoint to your backend:

**File: `backend/src/routes/auth.ts`**

```typescript
import express from 'express';
const router = express.Router();

// Google OAuth callback endpoint
router.post('/auth/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    // Check if user exists
    let user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    // If user doesn't exist, create one
    if (!user) {
      const hashedPassword = await bcrypt.hash(googleId, 10);
      await db.run(
        'INSERT INTO users (email, name, password, role, created_at) VALUES (?, ?, ?, ?, ?)',
        [email, name, hashedPassword, 'user', new Date().toISOString()]
      );
      user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'OAuth login failed' });
  }
});

export default router;
```

## Step 6: Test Google Login

1. Start your development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Go to http://localhost:3000/login
3. Click the "Google" button
4. You should be redirected to Google's login
5. After authentication, you'll be logged in and redirected to your dashboard

## Troubleshooting

### Error: "Invalid redirect_uri"
- Make sure your redirect URI in the code matches exactly with Google Cloud Console
- Include the full path: `/api/auth/callback/google`

### Error: "Client not authenticated"
- Verify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check that `.env.local` is in the frontend folder (not backend)
- Restart the development server after changing env variables

### Session not persisting
- Make sure `SessionProvider` is in your layout (already done in `providers.tsx`)
- Check browser cookies are enabled
- Verify `NEXTAUTH_SECRET` is set

### Still having issues?
Check the NextAuth documentation: https://next-auth.js.org/providers/google
