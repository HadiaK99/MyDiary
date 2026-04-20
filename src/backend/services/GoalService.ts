import prisma from "@backend/lib/prisma";

export const GoalService = {
  async getGoals(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async createGoal(userId: string, text: string) {
    return prisma.goal.create({
      data: { userId, text, completed: false },
    });
  },

  async toggleGoal(id: string, completed: boolean) {
    return prisma.goal.update({
      where: { id },
      data: { completed },
    });
  },

  async deleteGoal(id: string) {
    return prisma.goal.delete({ where: { id } });
  },
};
