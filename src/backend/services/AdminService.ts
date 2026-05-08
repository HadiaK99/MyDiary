// Updated AdminService for multi-child support
import prisma from "@backend/lib/prisma";
import bcrypt from "bcryptjs";

export const AdminService = {
  async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        parentId: true,
        createdAt: true
      },
    });

    // Manually attach children for parents to avoid relation include issues
    return Promise.all(users.map(async (u) => {
      if (u.role === "PARENT") {
        const children = await prisma.user.findMany({
          where: { parentId: u.id },
          select: { id: true, username: true }
        });
        return { ...u, children };
      }
      return u;
    }));
  },

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  },

  async createUser(data: { username: string; password?: string; role: string; childrenIds?: string[]; email: string }) {
    const { username, password, role, childrenIds, email } = data;
    const hashed = password ? await bcrypt.hash(password, 10) : null;
    let user;

    const existingEmailUser = email
      ? await prisma.user.findUnique({
        where: { email }
      })
      : null;

    if (existingEmailUser) {

      user = await prisma.user.update({
        where: { email },
        data: { username, role, onboarded: true },
        select: { id: true, username: true, role: true }
      });
    } else {
      user = await prisma.user.create({
        data: { username, password: hashed, role, email, onboarded: true },
        select: { id: true, username: true, role: true }
      });
    }

    if (role === "PARENT" && childrenIds && childrenIds.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: childrenIds } },
        data: { parentId: user.id }
      });
    }

    return user;
  },

  async updateUser(id: string, data: { username?: string; password?: string; role?: string; childrenIds?: string[] }) {
    const { username, password, role, childrenIds } = data;
    const updateData: any = { username, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, role: true }
    });

    if (role === "PARENT" && childrenIds !== undefined) {
      // Unlink previous children
      await prisma.user.updateMany({
        where: { parentId: id },
        data: { parentId: null }
      });

      // Link new children
      if (childrenIds.length > 0) {
        await prisma.user.updateMany({
          where: { id: { in: childrenIds } },
          data: { parentId: id }
        });
      }
    }

    return user;
  },

  async getActivities() {
    return prisma.activityCategory.findMany({
      include: { activities: true },
    });
  },

  async updateActivities(categories: { name: string; pointsPerItem: number; scoringMode: string; activities: { name: string; points?: number | null }[] }[]) {
    return await prisma.$transaction(async (tx) => {
      await tx.activity.deleteMany({ where: { userId: null } });
      await tx.activityCategory.deleteMany({ where: { userId: null } });

      for (const cat of categories) {
        await tx.activityCategory.create({
          data: {
            name: cat.name,
            pointsPerItem: cat.pointsPerItem,
            scoringMode: cat.scoringMode,
            activities: {
              create: cat.activities.map((act) => ({
                name: act.name,
                points: act.points,
              })),
            },
          },
        });
      }
    });
  },
};
