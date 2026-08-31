import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/backend/lib/prisma";
import { AuthService } from "@/backend/services/AuthService";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: undefined,
          username: undefined,
          onboarded: false,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        try {
          const user = await AuthService.login(credentials.username, credentials.password);
          return {
            id: user.id,
            name: user.username,
            email: user.email || null,
            role: user.role,
            username: user.username,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        console.log("NextAuth: signIn callback for", user.email);
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email as string }
          });

          if (!existingUser) {
            const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
            // Ensure we use an absolute URL and double-check it's not undefined
            const email = user.email as string;
            const name = user.name || "";
            const redirectUrl = `${baseUrl}/signup?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;

            console.log("NextAuth: New user detected, redirecting to:", redirectUrl);
            return redirectUrl;
          }
          console.log("NextAuth: Existing user found, allowing sign-in");
        }
        return true;
      } catch (error) {
        console.error("NextAuth: Error in signIn callback:", error);
        return "/login?error=CallbackError";
      }
    },
    async jwt({ token, user }) {

      const email = user?.email || token.email;
      const userId = user?.id || token.sub;

      let dbUser = null;

      if (email) {
        dbUser = await prisma.user.findUnique({ where: { email } });
      }

      if (!dbUser && userId) {
        dbUser = await prisma.user.findUnique({ where: { id: userId } });
      }

      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role as any;
        token.username = dbUser.username || undefined;
        token.email = dbUser.email || undefined;
        token.onboarded = dbUser.onboarded;
      }

      return token;
    },
    async session({ session, token }) {

      if (session.user) {

        session.user.id = token.id!;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.email = token.email || session.user.email;
        session.user.onboarded = token.onboarded;

        if (token.role === "PARENT") {

          const children = await prisma.user.findMany({
            where: {
              parentId: token.id
            },
            select: {
              id: true,
              username: true,
            }
          });

          session.user.children = children;
        }
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
