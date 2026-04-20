import prisma from "@backend/lib/prisma";

export const ReviewService = {
  async getReviews(childId: string) {
    return prisma.review.findMany({
      where: { childId },
      orderBy: { createdAt: "desc" },
    });
  },

  async createReview(parentId: string, childId: string, text: string, date: string) {
    return prisma.review.create({
      data: { parentId, childId, text, date, read: false },
    });
  },

  async deleteReview(id: string) {
    return prisma.review.delete({ where: { id } });
  },

  async findById(id: string) {
    return prisma.review.findUnique({ where: { id } });
  },
};
