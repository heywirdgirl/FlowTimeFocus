// Barrel file for the auth feature, providing a single entry point for imports.

// Components
export { EmailAuthDialog } from './components/email-auth-dialog';

// Hooks
export { useAuth } from './hooks/use-auth';

// Store
export { useAuthStore } from './store/auth-store';

// Types
export type { User, AuthState } from './types';
