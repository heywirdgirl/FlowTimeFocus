# Auth Flow

Flows
- Guest: local-only state, no persistence
- Email sign-up / sign-in (Firebase Auth)

On sign-in:
- If guest cycles exist → merge into user's Firestore cycles (avoid duplicates)
- Persist user profile in `users/{userId}`

Error handling
- Network/auth errors → show toast, do not wipe local guest data
- Token refresh handled by Firebase SDK; on persistent failure, prompt re-login
