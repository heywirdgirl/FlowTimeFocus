# AGENTS.md — FlowTime Focus

Agent guidance for working in this codebase.

---

## Project Overview

FlowTime Focus is a Next.js 15 (App Router) Pomodoro/flow-time timer app.

**Stack:**
- **Framework:** Next.js 15 with App Router, TypeScript
- **State:** Zustand (stores) + XState v5 (timer state machine)
- **Backend:** Firebase (Firestore for data, Auth for users, Storage for audio)
- **UI:** Shadcn UI components + Tailwind CSS
- **Dev server:** `npm run dev` — runs on port 9003

---

## Architecture

```
src/
├── app/           # Next.js App Router entry (layout, page, globals.css)
├── core/          # App-wide initializers (ClientInitializer, SyncStoreGate)
├── features/      # Feature modules (self-contained)
│   ├── auth/      # Firebase Auth, useAuthStore
│   ├── cycles/    # Cycle/phase CRUD, Firebase sync, useCycleStore
│   ├── settings/  # Theme + sound prefs, useSettingsStore
│   ├── theme/     # ThemeProvider wrapper
│   └── timer/     # XState machine, useTimerStore, TimerDisplay
└── shared/        # Cross-feature code
    ├── components/ # Shadcn UI components + layout (Header, Footer, Homepage)
    ├── hooks/      # use-mobile, use-toast
    ├── lib/        # firebase.ts, utils.ts
    └── types/      # Shared TypeScript types
```

### Feature module structure

Each feature follows this layout:
```
features/<name>/
├── components/    # React components
├── hooks/         # Public hook API (e.g. useCycles, useTimer)
├── store/         # Zustand store(s)
├── types.ts       # Feature-specific types
└── index.ts       # Public barrel export
```

Always import features through their `index.ts` barrel, not internal paths.

---

## Key Patterns

### Timer state machine (XState v5)
The timer is driven by `src/features/timer/machines/timer-machine.ts`.

States: `idle → running ⇄ paused → finished`

Global events (work from any state):
- `SELECT_PHASE` — load a phase and start immediately
- `SELECT_CYCLE` — load a cycle's first phase, stay idle
- `STOP_FOR_EDIT` — return to idle

The XState actor lives in `useTimerStore`. Components interact via `useTimer()` hook, never the store directly.

### Cross-store communication
Stores communicate via `require()` at call time to avoid circular import issues:
```ts
// Inside cycle-store.ts
require('@/features/timer').useTimerStore.getState().send({ type: 'STOP_FOR_EDIT' });
```
This is intentional. Do not refactor to static imports without resolving the circular dependency.

### Auth + sync lifecycle
1. `SyncStoreGate` (rendered in layout) calls `useAuthStore.initialize()` once.
2. On auth state change: authenticated → `startSync(uid)`, guest → `stopSync()` + load guest templates.
3. `ClientInitializer` initializes the timer actor and loads guest data on first render.

### Guest vs. authenticated users
- Guests use in-memory cycle templates (no persistence beyond `localStorage` for settings).
- Authenticated users sync cycles to Firestore under `users/{uid}/cycles`.
- Check `user.isGuest` before any Firestore write.

### Zustand persist
- `cycle-storage`: persists `currentCycleId`, `currentPhaseIndex`, `playSounds` only (not full cycle data).
- `settings-storage`: persists `theme`, `playSounds`.

---

## Development Commands

```bash
npm run dev        # Start dev server (port 9003, Turbopack)
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

---

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
```

---

## Conventions

- **Imports:** Use `@/` path aliases. Import features via their barrel `index.ts`.
- **Components:** All interactive components need `"use client"` directive.
- **Types:** Feature-local types in `features/<name>/types.ts`. Shared types in `shared/types/index.ts`.
- **Hooks:** Hooks in `features/<name>/hooks/` are the public API. Components should not import stores directly.
- **Firestore:** All Firestore operations are in `features/cycles/store/firebase-sync.ts`. Keep DB logic out of components and hooks.
- **UI components:** Use existing Shadcn components from `shared/components/ui/`. Do not add new UI libraries without discussion.
- **Commit messages:** Short, lowercase, imperative (e.g. `fix timer auto-next on last phase`).

---

## Known Issues / Gotchas

- `playSounds` exists in both `useSettingsStore` and `useCycleStore`. The cycle store's copy is the one actually used by the timer. This duplication should be resolved.
- `firebase-sync.ts` queries `users/{uid}/cycles` but the Firestore rules define the subcollection as `privateCycles`. Verify the correct collection name before writing new sync logic.
- `ClientInitializer` calls `loadGuestData()` unconditionally on mount, which may briefly overwrite synced data before `SyncStoreGate` establishes the auth listener. The ordering is fragile.
- Temporary migration scripts (`migrate-phase1.sh`, `migrate-phase2-timer.sh`, `update-imports-phase1.js`, etc.) are still present in the repo root and should be removed.
