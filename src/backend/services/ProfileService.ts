import prisma from "@backend/lib/prisma";

export const ProfileService = {
  async getProfile(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
    });
  },

  async updateProfile(userId: string, data: any) {
    return prisma.profile.upsert({
      where: { userId },
      update: {
        ...data,
      },
      create: {
        userId,
        ...data,
      },
    });
  },
};
