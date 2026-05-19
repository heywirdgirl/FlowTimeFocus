# API Contract

Current: app uses Firestore directly (no public REST API in v1).

Planned minimal contracts (if adding API later):
- `POST /api/sync` — body: { userId, cycles[] } → merges cycles
- `GET /api/user/:id` — returns user profile

Keep contracts simple JSON; prefer idempotent sync operations.
