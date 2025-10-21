// src/dal/user-dal.ts
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getUserDoc } from '@/lib/firebase';
import { UserProfile, AudioAsset } from '@/lib/types';

/**
 * Retrieves a user's profile from Firestore.
 * @param uid The user's unique ID.
 * @returns A promise that resolves to the UserProfile object or null if not found.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid) {
    console.error("getUserProfile called without a uid.");
    return null;
  }
  const userDocRef = getUserDoc(uid);
  const snap = await getDoc(userDocRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

/**
 * Creates a new user profile document in Firestore.
 * @param uid The user's unique ID.
 * @param email The user's email address.
 * @param displayName The user's display name.
 * @returns A promise that resolves to the newly created UserProfile object.
 */
export async function createUserProfile(
  uid: string, 
  email: string | null, 
  displayName: string | null
): Promise<UserProfile> {
    if (!uid) throw new Error("User ID is required to create a profile.");

    const newUserProfile: UserProfile = {
        userId: uid,
        email: email || '',
        displayName: displayName || 'Anonymous User',
        privateCycles: [],
        audioLibrary: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
    };

    await setDoc(getUserDoc(uid), newUserProfile);
    return newUserProfile;
}

/**
 * Updates an existing user profile in Firestore.
 * @param uid The user's unique ID.
 * @param profile The partial profile data to merge.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
  if (!uid) throw new Error('User ID is required to update a profile');
  await setDoc(getUserDoc(uid), profile, { merge: true });
}

// NOTE: Other functions like addPrivateCycle would also be updated to accept UID.
