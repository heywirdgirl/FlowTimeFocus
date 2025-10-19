// src/dal/history-dal.ts - FINAL VERSION (Oct 19, 2025)
import { 
  doc, getDocs, addDoc, deleteDoc, query, where, orderBy 
} from 'firebase/firestore';
import { trainingHistoriesCollection } from '@/lib/firebase';
import { TrainingHistory } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';

// 🔥 CREATE TRAINING HISTORY ENTRY
export async function createTrainingHistory(history: Omit<TrainingHistory, 'id'>): Promise<TrainingHistory> {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const newHistory: TrainingHistory = {
    ...history,
    id: `hist_${Date.now()}`,
    userId: user.uid
  };

  const docRef = await addDoc(trainingHistoriesCollection, newHistory);
  return { ...newHistory, id: docRef.id };
}

// 🔥 GET ALL TRAINING HISTORY OF CURRENT USER
export async function getTrainingHistory(): Promise<TrainingHistory[]> {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!user) return [];

  const q = query(
    trainingHistoriesCollection, 
    where('userId', '==', user.uid),
    orderBy('completedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TrainingHistory));
}

// 🔥 GET TRAINING HISTORY BY CYCLE ID
export async function getHistoryByCycle(cycleId: string): Promise<TrainingHistory[]> {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!user) return [];

  const q = query(
    trainingHistoriesCollection,
    where('userId', '==', user.uid),
    where('cycleId', '==', cycleId),
    orderBy('completedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TrainingHistory));
}

// 🔥 DELETE TRAINING HISTORY ENTRY
export async function deleteTrainingHistory(historyId: string): Promise<void> {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  await deleteDoc(doc(trainingHistoriesCollection, historyId));
}

// 🔥 GET STATS (Total completed, total time, etc.)
export interface HistoryStats {
  totalSessions: number;
  totalTime: number; // minutes
  completedSessions: number;
  avgSessionTime: number;
}

export async function getHistoryStats(): Promise<HistoryStats> {
  const history = await getTrainingHistory();
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