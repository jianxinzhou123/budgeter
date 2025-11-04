import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db, { initDb } from "./db";

// Initialize database
initDb();

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").get(credentials.email) as
            | {
                id: number;
                email: string;
                name: string;
                password: string;
                role: "admin" | "user";
                is_banned: number;
                ban_reason: string | null;
                banned_until: string | null;
              }
            | undefined;

          if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            return null;
          }

          // Check if user is banned
          if (user.is_banned) {
            const now = new Date();
            const bannedUntil = user.banned_until ? new Date(user.banned_until) : null;

            // If banned permanently or ban is still active, deny login
            if (!bannedUntil || now < bannedUntil) {
              console.log(`Login denied for banned user: ${user.email}`);
              return null;
            }

            // If ban has expired, automatically unban the user
            if (bannedUntil && now >= bannedUntil) {
              db.prepare("UPDATE users SET is_banned = 0, ban_reason = NULL, banned_until = NULL WHERE id = ?").run(
                user.id
              );
              console.log(`Auto-unbanned expired ban for user: ${user.email}`);
            }
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, credentials }) {
      // If user is null, it means authentication failed (possibly due to ban)
      if (!user && credentials?.email) {
        // Check if user exists but is banned
        const bannedUser = db
          .prepare("SELECT is_banned, ban_reason, banned_until FROM users WHERE LOWER(email) = LOWER(?)")
          .get(credentials.email) as
          | {
              is_banned: number;
              ban_reason: string | null;
              banned_until: string | null;
            }
          | undefined;

        if (bannedUser?.is_banned) {
          console.log(`Banned user attempted login: ${credentials.email}`);
          // Return false to prevent sign in
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
