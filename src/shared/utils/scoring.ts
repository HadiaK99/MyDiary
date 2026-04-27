import { ActivityCategory, POINTS } from "@shared/constants/activities";

export interface DayData {
  activities: Record<string, boolean>;
  goodThings: Record<string, boolean>;
  badThings: Record<string, boolean>;
}

export type PerformanceRating = "Superstar" | "Doing Great" | "Solid Start" | "Needs Focus" | "Fair" | "None";

export const calculateScore = (data: DayData, categories: ActivityCategory[]) => {
  let totalScore = 0;

  // Calculate activity points
  categories.forEach(category => {
    category.activities.forEach(activity => {
      const actName = activity.name;
      if (data.activities[actName]) {
        totalScore += activity.effectivePoints ?? category.pointsPerItem;
      }
    });
  });

  // Good/Bad things are fixed points (optional additions/subtractions)
  Object.keys(data.goodThings || {}).forEach(thing => {
    if (data.goodThings[thing]) totalScore += POINTS.GOOD_THING;
  });
  Object.keys(data.badThings || {}).forEach(thing => {
    if (data.badThings[thing]) totalScore += POINTS.BAD_THING;
  });

  return totalScore;
};

export const calculateMaxScore = (categories: ActivityCategory[]) => {
  return categories.reduce((total, cat) => {
    const catTotal = cat.activities.reduce((sum, act) => sum + (act.effectivePoints ?? cat.pointsPerItem), 0);
    return total + catTotal;
  }, 0);
};

export const getPerformanceRating = (score: number, maxScore?: number): { rating: PerformanceRating, color: string, message: string } => {
  if (!maxScore || maxScore === 0) return { rating: "Fair", color: "#f59e0b", message: "Let's start your journey! ✨" };
  
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 85) return { rating: "Superstar", color: "#8b5cf6", message: "Incredible! You're a Superstar! 🌟" };
  if (percentage >= 65) return { rating: "Doing Great", color: "#10b981", message: "Amazing work! You're doing great! ✨" };
  if (percentage >= 40) return { rating: "Solid Start", color: "#6366f1", message: "Good progress! Keep building your habits! 💪" };
  return { rating: "Needs Focus", color: "#f97316", message: "Every day is a new chance to grow. Let's aim higher! ❤️" };
};
