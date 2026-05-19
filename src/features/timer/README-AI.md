# Timer Feature Notes

Purpose: XState-driven timer for running cycles and phases.

Key files:
- `machines/timer-machine.ts` — machine logic
- `components/timer-display.tsx` — UI
- `store/timer-store.ts` — non-critical UI state

Checks for changes:
- Test transitions: start → pause → resume → finish
- Ensure UI reflects machine state; do not duplicate timer logic in Zustand
