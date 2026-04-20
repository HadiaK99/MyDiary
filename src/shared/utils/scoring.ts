import { ActivityCategory, POINTS } from "@shared/constants/activities";

export interface DayData {
  activities: Record<string, boolean>;
  goodThings: Record<string, boolean>;
  badThings: Record<string, boolean>;
}

export type PerformanceRating = "Excellent" | "Good" | "Fair" | "Poor";

export const calculateScore = (data: DayData, categories: ActivityCategory[]) => {
  let totalScore = 0;

  // Calculate activity points
  categories.forEach(category => {
    category.activities.forEach(activity => {
      const actName = typeof activity === 'string' ? activity : activity.name;
      if (data.activities[actName]) {
        totalScore += category.pointsPerItem;
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
  return categories.reduce((total, cat) => total + (cat.activities.length * cat.pointsPerItem), 0);
};

export const getPerformanceRating = (score: number, maxScore: number): { rating: PerformanceRating, color: string, message: string } => {
  if (maxScore === 0) return { rating: "Fair", color: "#f59e0b", message: "Let's start your journey!" };
  
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 80) return { rating: "Excellent", color: "#10b981", message: "Amazing! You're a Superstar! 🌟" };
  if (percentage >= 60) return { rating: "Good", color: "#6366f1", message: "Great job! Keep it up! ✨" };
  if (percentage >= 30) return { rating: "Fair", color: "#f59e0b", message: "Doing good! Aim a bit higher tomorrow! 💪" };
  return { rating: "Poor", color: "#ef4444", message: "Remember, self-care is a journey. Let's try harder! ❤️" };
};
