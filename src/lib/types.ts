export interface Phase {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  soundFile: { url: string; name?: string; type?: string } | null;
  removable?: boolean;
}

export interface Cycle {
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
  version?: number;
}

export interface PhaseTemplate {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  soundFile: { url: string; name?: string; type?: string } | null;
  isPublic: boolean;
  authorId: string;  // Thay createdBy
  authorName?: string;  // Thêm cho nhất quán
  createdAt: string;
  removable?: boolean;
}

export interface CycleTemplate {
  id: string;
  name: string;
  description: string;
  phases: PhaseTemplate[];  // Sửa từ Phase[]
  isPublic: boolean;
  authorId: string;
  authorName: string;
  likes: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
  version?: number;
  isOfficial?: boolean;
}

export interface TrainingHistory {
  cycleId: string;
  name: string;
  startTime: string;
  endTime: string;
  totalDuration: number; // in minutes
  cycleCount: number;
  completedAt: string;
  status?: "completed" | "interrupted";
  notes?: string;
}

export interface AudioAsset {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
    size?: number; // in bytes
    type?: string; // MIME type
    isPublic?: boolean;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  privateCycles: Cycle[]; // Consider subcollection for scalability
  trainingHistory: TrainingHistory[]; // Consider subcollection for scalability
  audioLibrary: AudioAsset[]; // Consider subcollection for scalability
  createdAt: string;
  lastLogin?: string;
}