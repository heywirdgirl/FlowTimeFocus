// src/dal/user-dal.ts - FINAL VERSION (Oct 19, 2025)
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getUserDoc } from '@/lib/firebase';
import { UserProfile, AudioAsset } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';

// 🔥 GET USER PROFILE
export async function getUserProfile(): Promise<UserProfile | null> {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!user) return null;

  const snap = await getDoc(getUserDoc(user.uid));
  return snap.exists() ? snap.data() as UserProfile : null;
}

// 🔥 CREATE/UPDATE USER PROFILE
export async function createOrUpdateUserProfile(profile: Partial<UserProfile>): Promise<void> {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const fullProfile: UserProfile = {
    userId: user.uid,
    email: user.email || '',
    displayName: user.displayName || 'Anonymous',
    privateCycles: [],
    audioLibrary: [],
    createdAt: new Date().toISOString(),
    ...profile
  };

  await setDoc(getUserDoc(user.uid), fullProfile, { merge: true });
}

// 🔥 ADD PRIVATE CYCLE ID
export async function addPrivateCycleToUser(cycleId: string): Promise<void> {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  await updateDoc(getUserDoc(user.uid), {
    privateCycles: arrayUnion(cycleId)
  });
}

// 🔥 REMOVE PRIVATE CYCLE ID
export async function removePrivateCycleFromUser(cycleId: string): Promise<void> {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  await updateDoc(getUserDoc(user.uid), {
    privateCycles: arrayRemove(cycleId)
  });
}

// 🔥 ADD AUDIO ASSET
export async function addAudioAsset(asset: AudioAsset): Promise<void> {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  await updateDoc(getUserDoc(user.uid), {
    audioLibrary: arrayUnion(asset)
  });
}

// 🔥 GET PRIVATE CYCLE IDS
export async function getPrivateCycleIds(): Promise<string[]> {
  const profile = await getUserProfile();
  return profile?.privateCycles || [];
}