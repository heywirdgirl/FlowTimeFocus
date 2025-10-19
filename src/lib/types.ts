// src/lib/types.ts - FINAL VERSION (Oct 19, 2025) - TRAININGHISTORY RIÊNG!

// 🔥 CORE - KHÔNG THAY ĐỔI
export interface Phase {
  id: string;
  title: string;
  duration: number; // in minutes
  soundFile: { url: string; name?: string; type?: string } | null;
  removable?: boolean;
}

// 🔥 CYCLE - XÓA trainingHistory!
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
  // 🔥 XÓA trainingHistory - BÂY GIỜ LÀ COLLECTION RIÊNG!
}

// 🔥 TRAINING HISTORY - RIÊNG BIỆT - KHÔNG THUỘC CYCLE
export interface TrainingHistory {
  id: string;
  cycleId: string;
  name: string;
  startTime: string;
  endTime: string;
  totalDuration: number; // in minutes
  cycleCount: number;
  completedAt: string;
  status: "completed" | "interrupted";
  notes?: string;
  userId: string; // 🔥 THÊM - để query theo user
  // 🔥 COLLECTION RIÊNG: trainingHistories/{id}
}

// 🔥 AUDIO - GIỮ NGUYÊN
export interface AudioAsset {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
    size?: number; // in bytes
    type?: string; // MIME type
    isPublic?: boolean;
}

// 🔥 USERPROFILE - XÓA trainingHistory HOÀN TOÀN
export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  privateCycles: string[]; // 🔥 ĐỔI THÀNH ARRAY CYCLE IDs (không phải full objects)
  audioLibrary: AudioAsset[];
  createdAt: string;
  lastLogin?: string;
  // 🔥 XÓA trainingHistory - BÂY GIỜ LÀ COLLECTION RIÊNG!
}

// 🔥 TEMPLATES - GIỮ NGUYÊN
export interface PhaseTemplate {
  id: string;
  title: string;
  duration: number;
  soundFile: { url: string; name?: string; type?: string } | null;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  removable?: boolean;
}

export interface CycleTemplate extends Omit<Cycle, 'isPublic' | 'authorId' | 'authorName' | 'likes' | 'shares'> {
  isOfficial?: boolean;
}

// 🔥 EXPORTS
export type { 
  Phase, 
  Cycle, 
  TrainingHistory, 
  AudioAsset, 
  UserProfile 
};