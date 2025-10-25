// src/dal/cycle-dal.ts
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Cycle, Phase } from '@/lib/types';

export const getCycles = async (userId?: string): Promise<Cycle[]> => {
  try {
    const cyclesCollection = collection(db, 'cycles');
    let q = cyclesCollection;

    if (userId) {
      q = query(cyclesCollection, where('authorId', '==', userId));
    } else {
      q = query(cyclesCollection, where('isPublic', '==', true));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unnamed Cycle',
        phases: (data.phases as Phase[]) || [],
        isPublic: data.isPublic ?? false,
        authorId: data.authorId ?? null,
        authorName: data.authorName ?? 'Unknown',
        likes: data.likes ?? 0,
        shares: data.shares ?? 0,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Cycle;
    });
  } catch (error) {
    console.error('Error fetching cycles:', error);
    return [];
  }
};

export const createCycle = async (cycle: Omit<Cycle, 'id'>, userId?: string, displayName?: string): Promise<Cycle> => {
  try {
    if (!cycle.phases.every((phase) => phase.duration > 0 && phase.title)) {
      throw new Error('Invalid phase data: duration must be positive and title is required');
    }
    const cyclesCollection = collection(db, 'cycles');
    const newCycle = {
      ...cycle,
      authorId: userId ?? null,
      authorName: displayName ?? 'Unknown',
      likes: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(cyclesCollection, newCycle);
    return { id: docRef.id, ...newCycle };
  } catch (error) {
    console.error('Error creating cycle:', error);
    throw error;
  }
};

export const updateCycle = async (cycleId: string, updatedData: Partial<Cycle>, userId?: string): Promise<void> => {
  try {
    const cycleDoc = doc(db, 'cycles', cycleId);
    const cycleSnap = await getDoc(cycleDoc);

    if (!cycleSnap.exists()) {
      throw new Error('Cycle does not exist');
    }

    if (userId && cycleSnap.data().authorId !== userId) {
      throw new Error('Unauthorized to update this cycle');
    }

    const updatePayload = {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(cycleDoc, updatePayload);
  } catch (error) {
    console.error('Error updating cycle:', error);
    throw error;
  }
};

export const deleteCycle = async (cycleId: string, userId?: string): Promise<void> => {
  try {
    const cycleDoc = doc(db, 'cycles', cycleId);
    const cycleSnap = await getDoc(cycleDoc);

    if (!cycleSnap.exists()) {
      throw new Error('Cycle does not exist');
    }

    if (userId && cycleSnap.data().authorId !== userId) {
      throw new Error('Unauthorized to delete this cycle');
    }

    await deleteDoc(cycleDoc);
  } catch (error) {
    console.error('Error deleting cycle:', error);
    throw error;
  }
};