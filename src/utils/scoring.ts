import { ACTIVITY_CATEGORIES, POINTS } from "@/constants/activities";

export interface DayData {
  activities: Record<string, boolean>;
  goodThings: Record<string, boolean>;
  badThings: Record<string, boolean>;
}

export type PerformanceRating = "Excellent" | "Good" | "Fair" | "Poor";

export const calculateScore = (data: DayData) => {
  let totalScore = 0;

  // Calculate activity points
  ACTIVITY_CATEGORIES.forEach(category => {
    category.activities.forEach(activity => {
      if (data.activities[activity]) {
        totalScore += category.pointsPerItem;
      }
    });
  });

  // Calculate Good Things points
  Object.keys(data.goodThings).forEach(thing => {
    if (data.goodThings[thing]) {
      totalScore += POINTS.GOOD_THING;
    }
  });

  // Calculate Bad Things points
  Object.keys(data.badThings).forEach(thing => {
    if (data.badThings[thing]) {
      totalScore += POINTS.BAD_THING;
    }
  });

  return totalScore;
};

export const getPerformanceRating = (score: number): { rating: PerformanceRating, color: string } => {
  if (score >= 50) return { rating: "Excellent", color: "#10b981" };
  if (score >= 30) return { rating: "Good", color: "#6366f1" };
  if (score >= 10) return { rating: "Fair", color: "#f59e0b" };
  return { rating: "Poor", color: "#ef4444" };
};
