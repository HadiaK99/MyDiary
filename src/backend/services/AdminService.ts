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

  async createUser(data: { username: string; password: string; role: string; childrenIds?: string[] }) {
    const { username, password, role, childrenIds } = data;
    const hashed = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
        role,
      },
      select: { id: true, username: true, role: true }
    });

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

  async updateActivities(categories: { name: string; pointsPerItem: number; activities: { name: string }[] }[]) {
    await prisma.activity.deleteMany({ where: { userId: null } });
    await prisma.activityCategory.deleteMany({ where: { userId: null } });
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
