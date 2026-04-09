import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

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
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const { data } = response;
          const { token, ...user } = data;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            token: token,
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
      }
      
      // Handle Google OAuth - exchange for backend token
      if (account?.provider === "google" && user?.email) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
            {
              email: user.email,
              name: user.name,
              googleId: user.id,
            }
          );

          const { data } = response;
          const { token: backendToken, ...userData } = data;

          token.role = userData.role;
          token.id = userData.id;
          token.accessToken = backendToken;
        } catch (error) {
          console.error("Failed to authenticate with backend:", error);
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
