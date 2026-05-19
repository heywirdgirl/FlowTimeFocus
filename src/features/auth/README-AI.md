# Auth Feature Notes

Purpose: Email-based auth (Firebase). Support guest-to-user merge.

Key files:
- `hooks/use-auth.ts` — auth helpers
- `store/auth-store.ts` — user session state
- `components/email-auth-dialog.tsx` — UI

Important: preserve guest cycles on login; merge strategy must avoid duplicates.
