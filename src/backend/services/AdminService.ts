import prisma from "@backend/lib/prisma";
import type { ActivityCategory } from "@shared/constants/activities";

export const AdminService = {
  async getAllUsers() {
    return prisma.user.findMany({
      select: { id: true, username: true, role: true, childId: true, createdAt: true },
    });
  },

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async createUser(data: { username: string; password: string; role: string; childId?: string }) {
    const { username, password, role, childId } = data;
    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash(password, 10);
    
    return prisma.user.create({
      data: {
        username,
        password: hashed,
        role: role as any,
        childId
      },
      select: { id: true, username: true, role: true, childId: true }
    });
  },

  async getActivities() {
    return prisma.activityCategory.findMany({
      include: { activities: true },
    });
  },

  async updateActivities(categories: { name: string; pointsPerItem: number; activities: { name: string }[] }[]) {
    await prisma.activity.deleteMany({});
    await prisma.activityCategory.deleteMany({});
    for (const cat of categories) {
      await prisma.activityCategory.create({
        data: {
          name: cat.name,
          pointsPerItem: cat.pointsPerItem,
          activities: {
            create: cat.activities.map((act) => ({
              name: act.name,
            })),
          },
        },
      });
    }
  },
};
