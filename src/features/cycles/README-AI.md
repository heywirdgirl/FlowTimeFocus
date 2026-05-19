# Cycles Feature Notes

Purpose: Create, edit, manage cycles (templates + user cycles).

Key files:
- `store/cycle-store.ts` — CRUD + sync logic
- `components/cycle-list.tsx`, `cycle-card.tsx`, `phase-editor.tsx`

Notes: Keep client-side validation (>=1 phase, positive duration). Merge local cycles on login.
