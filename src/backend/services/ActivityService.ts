import prisma from "@backend/lib/prisma";

export const ActivityService = {
  async getEffectiveActivities(userId: string, isParent: boolean = false) {
    // 1. Fetch all global and user-specific activities/categories
    const allCategories = await prisma.activityCategory.findMany({
      where: {
        OR: [
          { userId: null },
          { userId: userId }
        ]
      },
      include: {
        activities: {
          where: {
            OR: [
              { userId: null },
              { userId: userId }
            ]
          }
        }
      }
    });

    // 2. Fetch configs for this user
    const userCategoryConfigs = await prisma.userCategoryConfig.findMany({
      where: { userId }
    });
    const userActivityConfigs = await prisma.userActivityConfig.findMany({
      where: { userId }
    });

    // 3. Merge and filter
    const effectiveCategories = allCategories
      .map(cat => {
        const config = userCategoryConfigs.find(c => c.categoryId === cat.id);
        
        // If not parent: If category is disabled, return null (to be filtered out)
        const isCategoryEnabled = config?.enabled ?? true;
        if (!isParent && !isCategoryEnabled) return null;

        const effectivePointsPerItem = config?.pointsPerItem ?? cat.pointsPerItem;
        const scoringMode = config?.scoringMode ?? cat.scoringMode ?? "GROUP";
        
        const effectiveActivities = cat.activities
          .map(act => {
            const actConfig = userActivityConfigs.find(c => c.activityId === act.id);
            const isActivityEnabled = actConfig?.enabled ?? true;
            
            // If not parent: If activity is disabled, return null
            if (!isParent && !isActivityEnabled) return null;

            return {
              ...act,
              enabled: isActivityEnabled,
              effectivePoints: (scoringMode === "INDIVIDUAL" && actConfig?.points !== undefined) 
                ? actConfig.points 
                : effectivePointsPerItem
            };
          })
          .filter(Boolean) as any[];

        // If not parent: If no activities left, hide category
        if (!isParent && effectiveActivities.length === 0) return null;

        return {
          ...cat,
          enabled: isCategoryEnabled,
          pointsPerItem: effectivePointsPerItem,
          scoringMode,
          activities: effectiveActivities
        };
      })
      .filter(Boolean) as any[];

    return effectiveCategories;
  },

  async addCustomCategory(userId: string, name: string, pointsPerItem: number) {
    return prisma.activityCategory.create({
      data: {
        name,
        pointsPerItem,
        userId
      }
    });
  },

  async addCustomActivity(userId: string, categoryId: string, name: string) {
    return prisma.activity.create({
      data: {
        name,
        categoryId,
        userId
      }
    });
  },

  async updateCategoryConfig(userId: string, categoryId: string, enabled: boolean, pointsPerItem?: number, scoringMode?: string) {
    return prisma.userCategoryConfig.upsert({
      where: { userId_categoryId: { userId, categoryId } },
      update: { enabled, pointsPerItem, scoringMode },
      create: { userId, categoryId, enabled, pointsPerItem, scoringMode }
    });
  },

  async updateActivityConfig(userId: string, activityId: string, enabled: boolean, points?: number) {
    return prisma.userActivityConfig.upsert({
      where: { userId_activityId: { userId, activityId } },
      update: { enabled, points },
      create: { userId, activityId, enabled, points }
    });
  }
};
