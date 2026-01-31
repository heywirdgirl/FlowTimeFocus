// src/features/cycles/services/cycle.service.ts

import { setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { CycleCreateSchema, type CycleCreate, CycleSchema, Cycle } from '@/schemas';
import { documents } from '@/lib/firebase/collections';
import { validate } from '@/lib/firebase/validators';

export async function createCycle(
  userId: string,
  cycleData: CycleCreate
): Promise<void> {
  // ✅ Validate BEFORE writing
  const validated = validate(CycleCreateSchema, cycleData);
  
  const cycleId = uuidv4();
  const cycleRef = documents.userCycle(userId, cycleId);
  
  await setDoc(cycleRef, {
    ...validated,
    id: cycleId,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getCycle(
  userId: string,
  cycleId: string
): Promise<Cycle | null> {
  const cycleRef = documents.userCycle(userId, cycleId);
  const snap = await getDoc(cycleRef);
  
  if (!snap.exists()) return null;
  
  // ✅ Validate data from Firestore
  const data = snap.data();
  return validate(CycleSchema, data);
}
