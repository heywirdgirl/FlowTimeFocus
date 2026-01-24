import { User as FirebaseUser } from 'firebase/auth';

/**
 * A simplified User object for use within the application.
 * This helps decouple the app from the underlying Firebase User type.
 */
export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
}

/**
 * Represents the state of the authentication store.
 */
export interface AuthState {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => () => void; // Returns the unsubscribe function
}

/**
 * Maps a FirebaseUser object to our application's User type.
 * @param firebaseUser The user object from Firebase.
 * @returns A simplified User object or null.
 */
export const mapFirebaseUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) {
    return null;
  }
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
  };
};
