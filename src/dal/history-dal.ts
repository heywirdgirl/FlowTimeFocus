// src/dal/history-dal.ts - FINAL VERSION (Oct 25, 2025)
import { 
  doc, getDocs, addDoc, deleteDoc, query, where, orderBy, getDoc 
} from 'firebase/firestore';
import { trainingHistoriesCollection } from '@/lib/firebase';
import { TrainingHistory } from '@/lib/types';

// 🔥 CREATE TRAINING HISTORY ENTRY
export async function createTrainingHistory(
  userId: string, // Yêu cầu userId làm tham số
  history: Omit<TrainingHistory, 'id' | 'userId'> // Loại bỏ userId khỏi Omit
): Promise<TrainingHistory> {
  if (!userId) throw new Error('User not authenticated');

  const newHistory: TrainingHistory = {
    ...history,
    id: `hist_${Date.now()}`,
    userId, // Gán userId từ tham số
  };

  const docRef = await addDoc(trainingHistoriesCollection, newHistory);
  return { ...newHistory, id: docRef.id };
}

// 🔥 GET ALL TRAINING HISTORY OF CURRENT USER
export async function getTrainingHistory(userId: string): Promise<TrainingHistory[]> {
  if (!userId) return [];

  const q = query(
    trainingHistoriesCollection, 
    where('userId', '==', userId),
    orderBy('completedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TrainingHistory));
}

// 🔥 GET TRAINING HISTORY BY CYCLE ID
export async function getHistoryByCycle(userId: string, cycleId: string): Promise<TrainingHistory[]> {
  if (!userId || !cycleId) return [];

  const q = query(
    trainingHistoriesCollection,
    where('userId', '==', userId),
    where('cycleId', '==', cycleId),
    orderBy('completedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TrainingHistory));
}

// 🔥 DELETE TRAINING HISTORY ENTRY
export async function deleteTrainingHistory(userId: string, historyId: string): Promise<void> {
  if (!userId) throw new Error('User not authenticated');

  // Kiểm tra quyền sở hữu trước khi xóa
  const docRef = doc(trainingHistoriesCollection, historyId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('History entry not found');
  const historyData = docSnap.data() as TrainingHistory;
  if (historyData.userId !== userId) throw new Error('Unauthorized: User does not own this history entry');

  await deleteDoc(docRef);
}

// 🔥 GET STATS (Total completed, total time, etc.)
export interface HistoryStats {
  totalSessions: number;
  totalTime: number; // minutes
  completedSessions: number;
  avgSessionTime: number;
}

export async function getHistoryStats(userId: string): Promise<HistoryStats> {
  const history = await getTrainingHistory(userId);
  const completed = history.filter(h => h.status === 'completed');
  
  return {
    totalSessions: history.length,
    totalTime: history.reduce((sum, h) => sum + h.totalDuration, 0),
    completedSessions: completed.length,
    avgSessionTime: completed.length > 0 
      ? Math.round(completed.reduce((sum, h) => sum + h.totalDuration, 0) / completed.length)
      : 0
  };
}