import prisma from "@backend/lib/prisma";
import bcrypt from "bcryptjs";
import type { UserRole } from "@shared/types";

export const AuthService = {
  async signup(username: string, password: string, role: UserRole, childId?: string) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashed, role, childId },
    });

    return { id: user.id, username: user.username, role: user.role, childId: user.childId };
  },

  async login(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error("Invalid username or password");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid username or password");

    return { id: user.id, username: user.username, role: user.role, childId: user.childId };
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, role: true, childId: true },
    });
  },
};
