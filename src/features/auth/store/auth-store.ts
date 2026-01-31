import { create } from 'zustand';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/shared/lib/firebase';
import type { PublicProfile } from '@/schemas';

// Helper to map Firebase user to our app's PublicProfile schema
function mapFirebaseUser(user: FirebaseUser | null): PublicProfile | null {
  if (!user) return null;

  // Note: Firestore security rules should enforce that `username` and `displayName`
  // are properly set during user creation/update.
  return {
    uid: user.uid,
    username: user.displayName || 'Anonymous', // Fallback, should be set in profile
    displayName: user.displayName || 'Anonymous', // Fallback
    avatarUrl: user.photoURL || undefined,
    bio: undefined, // Not available from Firebase Auth user object
  };
}

// Interface for the store's state and actions
interface AuthState {
  user: PublicProfile | null;
  isGuest: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => () => void; // Action to start the auth listener
}

/**
 * Zustand store for authentication state management.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isGuest: true, // Assume guest until user is confirmed
  isLoading: true,
  isInitialized: false,
  error: null,

  /**
   * Initializes the Firebase Auth state listener.
   */
  initialize: () => {
    if (get().isInitialized) {
      console.warn('Auth listener is already initialized.');
      return () => {}; // Return a no-op unsubscribe function
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        const user = mapFirebaseUser(firebaseUser);
        set({
          user,
          isGuest: !user,
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        console.error('Firebase Auth Error:', error);
        set({
          user: null,
          isGuest: true,
          isLoading: false,
          error: 'Failed to initialize authentication.',
        });
      }
    );

    set({ isInitialized: true, isLoading: true });

    // Return the unsubscribe function for cleanup
    return unsubscribe;
  },
}));
