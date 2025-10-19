// src/dal/index.ts - EXPORT TẤT CẢ
export * from './cycle-dal';
export * from './history-dal';
export * from './user-dal';

// 🔥 RE-EXPORT TYPES CHO DỄ DÙNG
export type { Cycle, Phase, TrainingHistory, UserProfile, AudioAsset } from '@/lib/types';
export type { HistoryStats } from './history-dal';