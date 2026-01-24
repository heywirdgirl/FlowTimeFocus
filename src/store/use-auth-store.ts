
import { create } from 'zustand';
import { auth } from "@/shared/lib/firebase";
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  initialize: () => {
    // Prevent multiple listeners
    if (get().isInitialized) {
      return () => {};
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, isLoading: false });
    });
    set({ isInitialized: true });
    return unsubscribe;
  },
}));
