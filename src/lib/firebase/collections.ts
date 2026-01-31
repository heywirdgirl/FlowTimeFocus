import { collection, CollectionReference, DocumentReference, doc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import type { 
  Cycle, 
  PublicCycle, 
  PublicProfile, 
  OfficialTemplate,
  UserActivity 
} from '@/schemas';

// ✅ Type-safe collection references

export const collections = {
  // User collections
  users: () => collection(db, 'users') as CollectionReference<PublicProfile>,
  
  userCycles: (userId: string) => 
    collection(db, 'users', userId, 'privateCycles') as CollectionReference<Cycle>,
  
  // Public collections
  publicCycles: () => 
    collection(db, 'publicCycles') as CollectionReference<PublicCycle>,
  
  officialTemplates: () => 
    collection(db, 'officialTemplates') as CollectionReference<OfficialTemplate>,
  
  userActivity: () => 
    collection(db, 'userActivity') as CollectionReference<UserActivity>,
};

// ✅ Type-safe document references

export const documents = {
  user: (userId: string) => 
    doc(db, 'users', userId) as DocumentReference<PublicProfile>,
  
  userCycle: (userId: string, cycleId: string) => 
    doc(db, 'users', userId, 'privateCycles', cycleId) as DocumentReference<Cycle>,
  
  publicCycle: (cycleId: string) => 
    doc(db, 'publicCycles', cycleId) as DocumentReference<PublicCycle>,
};
