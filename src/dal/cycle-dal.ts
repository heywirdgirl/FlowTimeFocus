// src/dal/cycle-dal.ts - FINAL VERSION (Oct 19, 2025)
import { 
  doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, where, orderBy, collection 
} from 'firebase/firestore';
import { cyclesCollection } from '@/lib/firebase';
import { Cycle, Phase } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { addPrivateCycleToUser } from './user-dal';

// 🔥 GET ALL PUBLIC CYCLES
export async function getPublicCycles(): Promise<Cycle[]> {
  const q = query(cyclesCollection, where('isPublic', '==', true), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Cycle));
}

// 🔥 GET PRIVATE CYCLES OF CURRENT USER
export async function getPrivateCycles(): Promise<Cycle[]> {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const q = query(
    cyclesCollection, 
    where('authorId', '==', user.uid), 
    where('isPublic', '==', false)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Cycle));
}

// 🔥 GET ALL CYCLES (Public + Private của user)
export async function getAllCycles(): Promise<Cycle[]> {
  const [publicCycles, privateCycles] = await Promise.all([
    getPublicCycles(),
    getPrivateCycles()
  ]);
  return [...publicCycles, ...privateCycles];
}

// 🔥 GET SINGLE CYCLE BY ID (check permission)
export async function getCycleById(cycleId: string): Promise<Cycle | null> {
  const cycleRef = doc(cyclesCollection, cycleId);
  const snap = await getDoc(cycleRef);
  if (!snap.exists()) return null;

  const cycle = { id: snap.id, ...snap.data() } as Cycle;
  
  // Permission check
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!cycle.isPublic && user?.uid !== cycle.authorId) {
    throw new Error('Access denied: Private cycle');
  }
  
  return cycle;
}

// 🔥 CREATE NEW CYCLE
export async function createCycle(cycleData: Omit<Cycle, 'id'>): Promise<Cycle> {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const newCycle: Cycle = {
    ...cycleData,
    id: `cycle_${Date.now()}`,
    authorId: user.uid,
    authorName: user.displayName || 'Anonymous',
    likes: 0,
    shares: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const cycleRef = doc(cyclesCollection, newCycle.id);
  await setDoc(cycleRef, newCycle);

  // Add to user's privateCycles nếu private
  if (!newCycle.isPublic) {
    await addPrivateCycleToUser(newCycle.id);
  }

  return newCycle;
}

// 🔥 UPDATE CYCLE (owner only)
export async function updateCycle(cycleId: string, updates: Partial<Cycle>): Promise<void> {
  const cycle = await getCycleById(cycleId);
  if (!cycle) throw new Error('Cycle not found');

  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (user?.uid !== cycle.authorId) throw new Error('Access denied');

  await updateDoc(doc(cyclesCollection, cycleId), {
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

// 🔥 DELETE CYCLE (owner only)
export async function deleteCycle(cycleId: string): Promise<void> {
  const cycle = await getCycleById(cycleId);
  if (!cycle) throw new Error('Cycle not found');

  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (user?.uid !== cycle.authorId) throw new Error('Access denied');

  await deleteDoc(doc(cyclesCollection, cycleId));

  // Remove from user's privateCycles nếu private
  if (!cycle.isPublic) {
    await removePrivateCycleFromUser(cycleId);
  }
}

// 🔥 ADD PHASE TO CYCLE
export async function addPhaseToCycle(cycleId: string, phase: Phase): Promise<void> {
  const cycle = await getCycleById(cycleId);
  if (!cycle) throw new Error('Cycle not found');

  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (user?.uid !== cycle.authorId) throw new Error('Access denied');

  await updateDoc(doc(cyclesCollection, cycleId), {
    phases: [...cycle.phases, phase],
    updatedAt: new Date().toISOString()
  });
}

// 🔥 REMOVE PHASE FROM CYCLE
export async function removePhaseFromCycle(cycleId: string, phaseId: string): Promise<void> {
  const cycle = await getCycleById(cycleId);
  if (!cycle) throw new Error('Cycle not found');

  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (user?.uid !== cycle.authorId) throw new Error('Access denied');

  const newPhases = cycle.phases.filter(p => p.id !== phaseId);
  await updateDoc(doc(cyclesCollection, cycleId), {
    phases: newPhases,
    updatedAt: new Date().toISOString()
  });
}