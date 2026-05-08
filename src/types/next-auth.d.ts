import NextAuth, { DefaultSession } from "next-auth"
import { UserRole } from "@shared/types"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: UserRole
      username?: string
      onboarded?: boolean
      children?: { id: string; username: string }[]
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role?: UserRole
    username?: string
    onboarded?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: UserRole
    username?: string
    onboarded?: boolean
  }
}