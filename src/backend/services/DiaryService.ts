import prisma from "@backend/lib/prisma";

export const DiaryService = {
  async getEntry(userId: string, date: string) {
    if (!userId || !date) return null;
    return prisma.diaryEntry.findUnique({
      where: { userId_date: { userId, date } },
    });
  },

  async getEntries(userId: string) {
    return prisma.diaryEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
  },

  async upsertEntry(userId: string, date: string, data: object, score: number, rating: string) {
    return prisma.diaryEntry.upsert({
      where: { userId_date: { userId, date } },
      update: { data: JSON.stringify(data), score, rating },
      create: { userId, date, data: JSON.stringify(data), score, rating },
    });
  },

  async deleteEntry(userId: string, date: string) {
    return prisma.diaryEntry.delete({
      where: { userId_date: { userId, date } },
    });
  },
};
