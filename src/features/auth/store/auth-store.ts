import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/shared/lib/firebase';
import type { AuthState } from '../types';
import { mapFirebaseUser } from '../types';

/**
 * Zustand store for authentication state management.
 *
 * This store handles the user's authentication status, providing a reactive way to
 * track the current user, loading states, and initialization.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isGuest: true, // Assume guest until user is confirmed
  isLoading: true,
  isInitialized: false,
  error: null,

  /**
   * Initializes the authentication listener.
   *
   * This method sets up a listener with Firebase Authentication to respond to changes
   * in the user's sign-in state. It should be called once when the app loads.
   *
   * @returns A function to unsubscribe from the auth state listener.
   */
  initialize: () => {
    // Prevent setting up multiple listeners
    if (get().isInitialized) {
      console.warn('Auth listener is already initialized.');
      return () => {}; // Return a no-op unsubscribe function
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const user = mapFirebaseUser(firebaseUser);
      set({
        user,
        isGuest: !user,
        isLoading: false,
        error: null, // Clear any previous errors on auth state change
      });
    }, (error) => {
      console.error('Firebase Auth Error:', error);
      set({
        user: null,
        isGuest: true,
        isLoading: false,
        error: 'Failed to initialize authentication.', // Set a user-friendly error
      });
    });

    set({ isInitialized: true, isLoading: true });

    // Return the unsubscribe function to be called on cleanup
    return unsubscribe;
  },
}));
