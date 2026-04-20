export type UserRole = "CHILD" | "PARENT" | "ADMIN";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  childId?: string | null;
}

export interface DiaryEntry {
  id: string;
  date: string;
  userId: string;
  data: string;
  score: number;
  rating: string;
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
