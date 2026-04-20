export type UserRole = "CHILD" | "PARENT" | "ADMIN";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  childId?: string | null;
}

export interface SessionPayload {
  userId: string;
  username: string;
  role: UserRole;
  expires: Date;
}

export interface DiaryEntry {
  id: string;
  date: string;
  userId: string;
  data: string; // JSON string
  score: number;
  rating: string;
}

export interface DiaryEntryData {
  activities: Record<string, boolean>;
  water: number;
  sleep: number;
  mood: string;
  notes?: string;
}

export interface Goal {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
}

export interface Review {
  id: string;
  childId: string;
  parentId: string;
  text: string;
  date: string;
  read: boolean;
}

export interface Activity {
  id: string;
  name: string;
  categoryId: string;
}

export interface ActivityCategory {
  id: string;
  name: string;
  pointsPerItem: number;
  activities: Activity[];
}
