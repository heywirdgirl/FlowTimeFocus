export interface Phase {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  soundFile: string | null;
}

export interface Cycle {
  id: string;
  name: string;
  description: string;
  phases: Phase[];
  isPublic?: boolean;
  authorId?: string;
  authorName?: string;
  likes?: number;
  shares?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PhaseTemplate {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  soundFile: string | null;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

export interface CycleTemplate {
  id: string;
  name: string;
  description: string;
  phases: Phase[];
  isPublic: boolean;
  authorId: string;
  authorName: string;
  likes: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingHistory {
  cycleId: string;
  name: string;
  startTime: string;
  endTime: string;
  totalDuration: number; // in minutes
  cycleCount: number;
  completedAt: string;
}

export interface AudioAsset {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  privateCycles: Cycle[];
  trainingHistory: TrainingHistory[];
  audioLibrary: AudioAsset[];
}
