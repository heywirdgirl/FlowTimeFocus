export interface PublicCycle {
  id: string;
  name: string;
  description: string;
  phases: Phase[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorUsername: string;
  category: "work" | "meditation" | "fitness" | "custom";
  clones: number;
  publishedAt: number;
  updatedAt: number;
}

export interface Phase {
  id: string;
  title: string;
  duration: number;
}

export interface OfficialTemplate {
  id: string;
  name: string;
  description: string;
  phases: Phase[];
  category: string;
  featured: boolean;
  createdAt: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: number;
}
