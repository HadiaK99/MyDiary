export type UserRole = "CHILD" | "PARENT" | "ADMIN";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  parentId?: string | null;
  children?: { id: string, username: string }[];
}

export interface SessionPayload {
  userId: string;
  username: string;
  role: UserRole;
  expires: Date;
  children?: { id: string, username: string }[];
}

export interface DiaryEntry {
  id: string;
  date: string;
  userId: string;
  data: string;
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
  effectivePoints?: number;
}

export interface ActivityCategory {
  id: string;
  name: string;
  pointsPerItem: number;
  activities: Activity[];
  userId?: string | null;
}
