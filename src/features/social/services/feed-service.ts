import { collection, query, where, orderBy, limit, getDocs, getDoc, doc, updateDoc, increment, setDoc, addDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import type { Cycle as PublicCycle, Cycle as PrivateCycle } from '@/schemas';

// Represents a template curated by the platform owners
export interface OfficialTemplate extends PublicCycle {
  featured?: boolean; 
}

// Fetch featured templates
export async function fetchFeaturedTemplates(): Promise<OfficialTemplate[]> {
  const q = query(
    collection(db, 'officialTemplates'),
    where('featured', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as OfficialTemplate[];
}

// Fetch public cycles (with filters)
export async function fetchPublicCycles(category: string, searchQuery: string): Promise<PublicCycle[]> {
  let q;
  const cyclesCollection = collection(db, 'publicCycles');

  if (category && category !== 'all') {
    q = query(
      cyclesCollection,
      where('category', '==', category),
      orderBy('publishedAt', 'desc'),
      limit(20)
    );
  } else {
    q = query(
      cyclesCollection,
      orderBy('publishedAt', 'desc'),
      limit(20)
    );
  }
  
  const snapshot = await getDocs(q);
  let cycles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PublicCycle[];
  
  // Client-side search filter
  if (searchQuery) {
    cycles = cycles.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  return cycles;
}

// Clone cycle to user's account
export async function cloneCycle(userId: string, cycleId: string): Promise<PrivateCycle> {
  // 1. Fetch public cycle
  const cycleDoc = await getDoc(doc(db, 'publicCycles', cycleId));
  if (!cycleDoc.exists()) {
    throw new Error("Cycle not found");
  }
  const publicCycle = cycleDoc.data() as PublicCycle;
  
  // 2. Create private copy
  const newCycle: PrivateCycle = {
    id: uuidv4(),
    name: `${publicCycle.name} (Copy)`,
    description: publicCycle.description,
    phases: publicCycle.phases.map(p => ({ ...p, id: uuidv4() })),
    category: publicCycle.category,
    isPublic: false,
    userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  await setDoc(doc(db, `users/${userId}/privateCycles`, newCycle.id), newCycle);
  
  // 3. Increment clone count
  await updateDoc(doc(db, 'publicCycles', cycleId), {
    clones: increment(1)
  });
  
  // 4. Log activity
  await addDoc(collection(db, 'userActivity'), {
    userId,
    username: '...', // fetch from user profile
    type: 'clone',
    cycleId,
    cycleName: publicCycle.name,
    createdAt: Date.now(),
  });
  
  return newCycle;
}
