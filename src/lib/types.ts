export interface Phase {
  id: string;
  title: string;
  duration: number; // in minutes
  soundFile: { url: string; name?: string; type?: string } | null;
  removable?: boolean;
}

export interface Cycle {
  id: string;
  name: string;
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
  soundFile: { url: string; name?: string; type?: string } | null;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  removable?: boolean;
}

export interface CycleTemplate extends Omit<Cycle, 'isPublic' | 'authorId' | 'authorName' | 'likes' | 'shares'> {
  isOfficial?: boolean;
}

export interface PhaseRecord {
  title: string;
  duration: number;
  completionStatus: 'completed' | 'skipped';
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
  phaseRecords?: PhaseRecord[];
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
