// src/lib/types.ts - FINAL VERSION (Oct 18, 2025)

// 🔥 CORE - KHÔNG THAY ĐỔI
export interface Phase {
  id: string;
  title: string;
  duration: number; // in minutes
  soundFile: { url: string; name?: string; type?: string } | null;
  removable?: boolean;
}

// 🔥 CYCLE - THÊM trainingHistory!
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
  // 🔥 THÊM NÀY - TrainingHistory TRONG Cycle!
  trainingHistory: TrainingHistory[];
}

// 🔥 TRAINING HISTORY - XÓA phaseRecords!
export interface TrainingHistory {
  id: string;  // 🔥 THÊM id
  cycleId: string;
  name: string;
  startTime: string;
  endTime: string;
  totalDuration: number; // in minutes
  cycleCount: number;
  completedAt: string;
  status: "completed" | "interrupted"; // 🔥 BẮT BUỘC
  notes?: string;
  // 🔥 XÓA phaseRecords!
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

// 🔥 USERPROFILE - XÓA trainingHistory (vì đã trong Cycle!)
export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  privateCycles: Cycle[]; // Đã có trainingHistory trong mỗi Cycle
  // 🔥 XÓA trainingHistory!
  audioLibrary: AudioAsset[];
  createdAt: string;
  lastLogin?: string;
}

// 🔥 TEMPLATES - GIỮ NGUYÊN (KHÔNG DÙNG CHO MOCK)
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

// 🔥 XÓA HOÀN TOÀN - KHÔNG CẦN NỮA
// export interface PhaseRecord { ... } // 🔥 XÓA!

// 🔥 EXPORTS CHO MOCK DATA
export type { 
  Phase, 
  Cycle, 
  TrainingHistory, 
  AudioAsset, 
  UserProfile 
};