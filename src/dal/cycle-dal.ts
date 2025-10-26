// src/dal/cycle-dal.ts
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  query, where, getDoc, writeBatch, documentId
} from 'firebase/firestore';
import { db, cyclesCollection } from '@/lib/firebase';
import { Cycle } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import defaultData from "@/lib/mock-data";

const LOCAL_STORAGE_KEY = 'flowtime_guest_cycles';

// --- Local Storage Helpers ---

const getLocalCycles = (): Cycle[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return [];
  }
};

const saveLocalCycles = (cycles: Cycle[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cycles));
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};


// --- Core Data Access Logic ---

/**
 * Adds a new cycle.
 * - For guests, saves to Local Storage.
 * - For logged-in users, saves to Firestore.
 */
export const addCycle = async (cycle: Cycle, userId?: string): Promise<Cycle> => {
  if (!userId) {
    // GUEST
    const localCycles = getLocalCycles();
    const cycleWithId = { ...cycle, id: cycle.id || uuidv4() };
    saveLocalCycles([...localCycles, cycleWithId]);
    return cycleWithId;
  }

  // LOGGED-IN USER
  try {
    const { id, ...firestoreData } = cycle;
    const docRef = await addDoc(cyclesCollection, firestoreData);
    return { ...cycle, id: docRef.id };
  } catch (error) {
    console.error("Error adding cycle to Firestore:", error);
    throw error;
  }
};

/**
 * Fetches cycles.
 * - For guests: returns public Firestore cycles + local cycles.
 * - For users: returns public Firestore cycles + user's own Firestore cycles.
 */
export const getCycles = async (userId?: string): Promise<Cycle[]> => {
  const publicCyclesQuery = query(cyclesCollection, where('isPublic', '==', true));
  const localCycles = getLocalCycles();
  
  try {
    const publicSnapshot = await getDocs(publicCyclesQuery);
    let publicCycles = publicSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cycle));

    // Fallback to mock data if Firestore is empty
    if (publicCycles.length === 0) {
      publicCycles = defaultData.mockCycles.filter(c => c.isPublic);
    }

    if (!userId) {
      // GUEST: Public cycles from DB + their own from Local Storage
      const guestCycleIds = new Set(localCycles.map(c => c.id));
      // Filter out any public cycles that the guest has a local version of
      const uniquePublicCycles = publicCycles.filter(c => !guestCycleIds.has(c.id));
      return [...uniquePublicCycles, ...localCycles];
    }

    // LOGGED-IN USER: Public cycles + their own private cycles
    const privateCyclesQuery = query(cyclesCollection, where('authorId', '==', userId));
    const privateSnapshot = await getDocs(privateCyclesQuery);
    const privateCycles = privateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cycle));
    
    // Combine and deduplicate, giving preference to the user's private versions.
    const privateCycleIds = new Set(privateCycles.map(c => c.id));
    const uniquePublicCycles = publicCycles.filter(c => !privateCycleIds.has(c.id));

    return [...uniquePublicCycles, ...privateCycles];

  } catch (error) {
    console.error('Error fetching cycles:', error);
    // Return local cycles and mocks as a fallback
    return [...defaultData.mockCycles.filter(c => c.isPublic), ...localCycles];
  }
};

/**
 * Ensures a cycle is editable by the current user.
 * If the user doesn't own the cycle (e.g., a public template), it clones it.
 * - For guests, clones to Local Storage.
 * - For logged-in users, clones to their Firestore collection.
 * Returns the editable cycle (either the original or the new clone).
 */
export const makeCycleEditable = async (cycle: Cycle, userId?: string, userDisplayName?: string): Promise<Cycle> => {
  const isOwned = userId ? cycle.authorId === userId : cycle.authorId === 'guest';

  if (isOwned) {
    return cycle; // Already editable, return as is.
  }

  // If not owned, we need to clone it.
  const newClone: Cycle = {
    ...cycle,
    id: uuidv4(), // Give it a new ID
    name: `${cycle.name} (Copy)`,
    authorId: userId ?? 'guest',
    authorName: userDisplayName ?? 'Guest',
    isPublic: false, // Clones are always private
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0,
    shares: 0,
    originalId: cycle.id // Keep track of the original template
  };

  return addCycle(newClone, userId);
};

/**
 * Updates a cycle that the user owns.
 */
export const updateCycle = async (cycleId: string, updates: Partial<Cycle>, userId?: string): Promise<void> => {
  const updatePayload = { ...updates, updatedAt: new Date().toISOString() };

  if (!userId) {
    // GUEST: Update in local storage
    const localCycles = getLocalCycles();
    const updatedCycles = localCycles.map(c =>
      c.id === cycleId ? { ...c, ...updatePayload } : c
    );
    saveLocalCycles(updatedCycles);
    return;
  }

  // LOGGED-IN USER: Update in Firestore
  try {
    const cycleRef = doc(db, 'cycles', cycleId);
    await updateDoc(cycleRef, updatePayload);
  } catch (error) {
    console.error('Error updating cycle:', error);
    throw error;
  }
};

/**
 * Deletes a cycle that the user owns.
 */
export const deleteCycle = async (cycleId: string, userId?: string): Promise<void> => {
  if (!userId) {
    // GUEST: Delete from local storage
    const localCycles = getLocalCycles();
    saveLocalCycles(localCycles.filter(c => c.id !== cycleId));
    return;
  }

  // LOGGED-IN USER: Delete from Firestore
  try {
    // We should add a security rule in Firestore to ensure users can only delete their own.
    await deleteDoc(doc(db, 'cycles', cycleId));
  } catch (error) {
    console.error('Error deleting cycle:', error);
    throw error;
  }
};

/**
 * Moves all cycles from local storage to a user's Firestore account upon login.
 */
export const mergeGuestCyclesToFirestore = async (userId: string, userDisplayName: string): Promise<void> => {
  const localCycles = getLocalCycles();
  if (localCycles.length === 0) return;

  const batch = writeBatch(db);
  localCycles.forEach(cycle => {
    const { id, ...cycleData } = cycle; // Discard local UUID
    const newDocRef = doc(cyclesCollection); // Get a new Firestore ID
    batch.set(newDocRef, {
      ...cycleData,
      authorId: userId,
      authorName: userDisplayName,
    });
  });

  try {
    await batch.commit();
    saveLocalCycles([]); // Clear local storage on success
    console.log("Successfully merged guest cycles to user account.");
  } catch (error) {
    console.error("Error merging guest cycles:", error);
    // We don't clear local storage if the merge fails.
    throw error;
  }
};
