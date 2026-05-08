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
    async jwt({ token, user }) {

      const email = user?.email || token.email;

      if (email) {

        const dbUser = await prisma.user.findUnique({
          where: { email }
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role as any;
          token.username = dbUser.username || undefined;
          token.onboarded = dbUser.onboarded;
        }
      }

      return token;
    },
    async session({ session, token }) {

      if (session.user) {

        session.user.id = token.id!;
        session.user.role = token.role;
        session.user.username = token.username;
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
