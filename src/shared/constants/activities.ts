export interface ActivityCategory {
  id?: string;
  name: string;
  activities: string[];
  pointsPerItem: number;
}

export const POINTS = {
  HABIT: 1,
  GOOD_THING: 10,
  BAD_THING: -15
};

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
