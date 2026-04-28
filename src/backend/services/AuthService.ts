// Updated AuthService for multi-child support
import prisma from "@backend/lib/prisma";
import bcrypt from "bcryptjs";
import type { UserRole } from "@shared/types";

export const AuthService = {
  async signup(username: string, password: string, role: UserRole) {
    if (!username) throw new Error("Username is required");
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashed, role },
    });

    return { id: user.id, username: user.username, role: user.role };
  },

  async login(username: string, password: string) {
    console.log("Login attempt for:", username);
    if (!username) throw new Error("Username is required");
    const user = await prisma.user.findUnique({ 
      where: { username }
    });
    if (!user) throw new Error("Invalid username or password");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid username or password");

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
