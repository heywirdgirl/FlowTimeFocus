import { useAuthStore } from '../store/auth-store';

/**
 * A custom hook to access authentication state and actions.
 *
 * This hook simplifies interaction with the `useAuthStore` by providing a clean,
 * memoized, and selector-based API. It helps prevent unnecessary re-renders
 * in components that only need a subset of the authentication state.
 *
 * @returns An object with the current user, authentication status, and actions.
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isGuest = useAuthStore((state) => state.isGuest);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Computed properties based on the auth state
  const isAuthenticated = !isGuest && !!user;

  return {
    // State
    user,
    isGuest,
    isLoading,
    isInitialized,
    isAuthenticated, // Derived state: is the user authenticated?

    // Actions are accessed via the store if needed, or we can expose them here
    // For now, we keep actions separate to encourage using them within specific contexts
    // e.g., calling a signIn function from a form component.
  };
}
