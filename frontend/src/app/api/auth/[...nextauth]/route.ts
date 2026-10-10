import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { getApiBaseUrl } from "@/lib/apiUrl";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          const response = await axios.post(
            `${getApiBaseUrl()}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const { data } = response.data;
          const { token, refreshToken, ...user } = data;

          return {
            id: user.id || user.userId,
            email: user.email,
            name: user.name,
            role: user.role,
            token,
            refreshToken,
          };
        } catch (error) {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.accessToken = (user as any).token;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;
      }
      
      // Handle Google OAuth - exchange for backend token
      if (account?.provider === "google" && user?.email) {
        try {
          const response = await axios.post(
            `${getApiBaseUrl()}/auth/google`,
            {
              idToken: account.id_token,
            }
          );

          const { data } = response.data;
          const { token: backendToken, refreshToken, ...userData } = data;

          token.role = userData.role;
          token.id = userData.id || userData.userId;
          token.accessToken = backendToken;
          token.refreshToken = refreshToken;
          token.accessTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;
        } catch (error) {
          console.error("Failed to authenticate with backend:", error);
        }
      }

      if (token.accessToken && token.refreshToken && Number(token.accessTokenExpires) <= Date.now()) {
        try {
          const response = await axios.post(`${getApiBaseUrl()}/auth/refresh`, {
            refreshToken: token.refreshToken,
          });
          token.accessToken = response.data.data.token;
          token.refreshToken = response.data.data.refreshToken;
          token.accessTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;
          delete token.error;
        } catch {
          token.error = 'RefreshAccessTokenError';
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
      }
      if (token.error) (session as any).error = token.error;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
