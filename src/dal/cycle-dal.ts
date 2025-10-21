// src/dal/cycle-dal.ts - NEW DATA STRUCTURE (Oct 21, 2025)
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Cycle } from '@/lib/types';

export const getCycles = async (userId?: string): Promise<Cycle[]> => {
  try {
    const cyclesCollection = collection(db, 'cycles');
    let q = cyclesCollection;
    
    // 🔥 NEW: Filter cycles based on userId (private) or isPublic (public)
    if (userId) {
      q = query(cyclesCollection, where('userId', 'in', [userId, null]), where('isPublic', '==', false));
    } else {
      q = query(cyclesCollection, where('isPublic', '==', true));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Cycle));
  } catch (error) {
    console.error('Error fetching cycles:', error);
    return [];
  }
};

export const createCycle = async (cycle: Omit<Cycle, 'id'>, userId?: string): Promise<Cycle> => {
  try {
    const cyclesCollection = collection(db, 'cycles');
    const newCycle = {
      ...cycle,
      userId: cycle.isPublic ? null : userId, // 🔥 NEW: Set userId for private cycles
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(cyclesCollection, newCycle);
    return { id: docRef.id, ...newCycle };
  } catch (error) {
    console.error('Error creating cycle:', error);
    throw error;
  }
};

export const deleteCycle = async (cycleId: string, userId?: string): Promise<void> => {
  try {
    const cycleDoc = doc(db, 'cycles', cycleId);
    // 🔥 NEW: Optional check for userId to ensure only owner deletes
    if (userId) {
      const cycleSnap = await getDoc(cycleDoc);
      if (cycleSnap.exists() && cycleSnap.data().userId !== userId) {
        throw new Error('Unauthorized to delete this cycle');
      }
    }
    await deleteDoc(cycleDoc);
  } catch (error) {
    console.error('Error deleting cycle:', error);
    throw error;
  }
};