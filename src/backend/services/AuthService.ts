// Updated AuthService for multi-child support
import prisma from "@backend/lib/prisma";
import bcrypt from "bcryptjs";
import type { UserRole } from "@shared/types";

export const AuthService = {
  async signup(
    username: string,
    password?: string,
    role: UserRole = "CHILD",
    childIds?: string[],
    email?: string
  ) {

    if (!username) {
      throw new Error("Username is required");
    }

    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
        ...(email ? {
          NOT: { email }
        } : {})
      }
    });

    if (existingUsername) {
      throw new Error("Username already taken");
    }

    const hashed = password
      ? await bcrypt.hash(password, 10)
      : null;

    return prisma.$transaction(async (tx) => {

      let user;
      // OAuth onboarding flow
      if (email) {
        user = await tx.user.update({
          where: { email },
          data: {
            username,
            password: hashed,
            role,
            onboarded: true,
          },
        });
      } else {
        // credentials signup
        user = await tx.user.create({
          data: {
            username,
            password: hashed,
            role,
            onboarded: true,
          },
        });
      }

      if (role === "PARENT" && childIds?.length) {
        await tx.user.updateMany({
          where: {
            id: { in: childIds }
          },
          data: {
            parentId: user.id
          }
        });
      }

      return {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
      };
    });
  },

  async login(username: string, password: string) {
    if (!username) throw new Error("Username is required");
    const user = await prisma.user.findUnique({
      where: { username }
    });
    if (!user) {
      throw new Error("Invalid username or password");
    }

    if (!user.password) {
      throw new Error("This account uses Google Login. Please sign in with Google or reset your password.");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid username or password");
    }

    const children = await prisma.user.findMany({
      where: { parentId: user.id },
      select: { id: true, username: true }
    });

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      children: children
    };
  },

  async getById(id: string) {
    if (!id) return null;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true
      },
    });

    if (user && user.role === "PARENT") {
      const children = await prisma.user.findMany({
        where: { parentId: user.id },
        select: { id: true, username: true }
      });
      return { ...user, children };
    }

    return user;
  },

  async updateUser(id: string, data: { username?: string; password?: string }) {
    const updateData: { username?: string; password?: string } = {};
    if (data.username) updateData.username = data.username;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, role: true },
    });
  },

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },
};
