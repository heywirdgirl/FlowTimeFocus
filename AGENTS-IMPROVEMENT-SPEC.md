# AGENTS-IMPROVEMENT-SPEC.md

Concrete improvements identified from auditing the codebase against AGENTS.md.

---

## Audit Summary

### What's good

- **Feature-driven structure** is clean and consistent. Each feature owns its components, hooks, store, and types.
- **XState v5 timer machine** is well-modelled. States, guards, and global events are clearly documented inline.
- **Barrel exports** (`index.ts`) are used consistently, keeping cross-feature imports clean.
- **Firestore rules** are thorough — per-user subcollections, field validation on create/update, public template support.
- **Zustand `partialize`** is used correctly to avoid persisting volatile state.
- **Hook abstraction layer** (`useTimer`, `useCycles`) keeps components decoupled from store internals.
- **README** documents the full project structure and key architectural decisions.

### What's missing

1. **No `AGENTS.md`** — no agent/contributor guidance existed before this session.
2. **No tests** — zero test files. No unit tests for the timer machine, no integration tests for store actions, no component tests.
3. **No CI configuration** — no `.github/workflows/` or equivalent. Lint and typecheck are never run automatically.
4. **No `.env.example`** — Firebase config keys are documented nowhere; new contributors have no template.
5. **No error boundary** — the app has no React error boundary. A Firebase misconfiguration or XState crash will blank the entire page.
6. **No loading/error state in UI** — `isLoading` and `error` from `useCycleStore` are exposed by `useCycles()` but the `Homepage` only handles `isLoading`. Firestore errors are silently swallowed.

### What's wrong

1. **Firestore collection name mismatch** — `firebase-sync.ts` queries `users/{uid}/cycles`, but `firestore.rules` defines `users/{userId}/privateCycles`. One of them is wrong; data will silently fail to sync for authenticated users.
2. **`playSounds` duplication** — the flag exists in both `useSettingsStore` and `useCycleStore`. The timer reads from `useCycleStore`. `useSettingsStore.toggleSounds` has no effect on actual sound playback. This is a silent bug.
3. **`require()` for cross-store calls** — `cycle-store.ts` uses dynamic `require('@/features/timer')` to avoid circular imports. This bypasses TypeScript, breaks tree-shaking, and is fragile. The circular dependency should be resolved structurally.
4. **`ClientInitializer` race condition** — `loadGuestData()` is called unconditionally on mount, potentially overwriting Firestore-synced cycles before `SyncStoreGate` establishes the auth listener. The initialization order is not guaranteed.
5. **Stale migration scripts in repo root** — `migrate-phase1.sh`, `migrate-phase2-timer.sh`, `update-imports-phase1.js`, `update-imports-phase2.js`, `verify-imports.js` are one-time migration artifacts that should have been deleted after use.
6. **`devcontainer.json` uses universal image** — the 10 GB universal image is used with no `postCreateCommand` to install dependencies. Cold starts are slow and `node_modules` must be installed manually.
7. **`package.json` name is `nextn`** — the project name field is a placeholder and should match the actual project.

---

## Improvement Specs

### SPEC-1: Fix Firestore collection name mismatch

**Priority:** Critical  
**File:** `src/features/cycles/store/firebase-sync.ts`

The Firestore rules protect `privateCycles` but the sync code reads/writes `cycles`. Determine the correct collection name and make both files consistent.

```ts
// firebase-sync.ts — change one of:
const q = query(collection(db, "users", uid, "cycles"), ...)       // current
const q = query(collection(db, "users", uid, "privateCycles"), ...) // matches rules
```

Also update `saveCycle`, `createNewCycleInDb`, and `deleteCycle` in the same file.

---

### SPEC-2: Resolve `playSounds` duplication

**Priority:** High  
**Files:** `src/features/settings/store/settings-store.ts`, `src/features/cycles/store/cycle-store.ts`

`playSounds` should live in exactly one place. Options:

**Option A (recommended):** Remove `playSounds` from `useSettingsStore`. It was likely added there by mistake. The cycle store already persists it and the timer reads it from there.

**Option B:** Remove `playSounds` from `useCycleStore` and have the timer read from `useSettingsStore`. Update `timer-store.ts` accordingly.

Whichever option is chosen, remove the dead `toggleSounds` from the other store and update `useCycles()` and any components that call it.

---

### SPEC-3: Eliminate `require()` cross-store calls

**Priority:** High  
**Files:** `src/features/cycles/store/cycle-store.ts`

The three `require('@/features/timer')` calls exist to break a circular dependency:
- `cycles` store → `timer` store (to send `STOP_FOR_EDIT`, `SELECT_PHASE`, `SELECT_CYCLE`)
- `timer` store → `cycles` store (to read phase data on `finished`)

**Recommended fix:** Introduce a lightweight event bus or use Zustand's `subscribe` to decouple the stores.

```ts
// shared/lib/store-events.ts
type StoreEvent = { type: 'PHASE_FINISHED' } | { type: 'CYCLE_SELECTED'; duration: number };
type Listener = (event: StoreEvent) => void;
const listeners = new Set<Listener>();
export const storeEvents = {
  emit: (e: StoreEvent) => listeners.forEach(l => l(e)),
  on: (l: Listener) => { listeners.add(l); return () => listeners.delete(l); },
};
```

The timer store subscribes to `CYCLE_SELECTED`/`PHASE_SELECTED` events. The cycle store emits them. No circular imports.

---

### SPEC-4: Fix `ClientInitializer` race condition

**Priority:** High  
**Files:** `src/core/client-initializer.tsx`, `src/core/sync-store-gate.tsx`

`loadGuestData()` must not run if the user is already authenticated. The fix is to gate it on auth state:

```ts
// client-initializer.tsx
useEffect(() => {
  useTimerStore.getState().initializeTimer();
  // Only load guest data if auth is already resolved as guest
  const { isInitialized, isGuest } = useAuthStore.getState();
  if (!isInitialized || isGuest) {
    useCycleStore.getState().loadGuestData();
  }
}, []);
```

Alternatively, move `loadGuestData()` into `SyncStoreGate`'s `stopSync` path (it already calls `stopSync` which calls `loadGuestData` — verify this is sufficient and remove the call from `ClientInitializer`).

---

### SPEC-5: Add `.env.example`

**Priority:** Medium  
**File:** `.env.example` (new file)

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
```

---

### SPEC-6: Add error boundary

**Priority:** Medium  
**File:** `src/core/error-boundary.tsx` (new file), `src/app/layout.tsx`

Wrap the app in a React error boundary so Firebase/XState failures show a recoverable error UI instead of a blank screen.

```tsx
// src/core/error-boundary.tsx
'use client';
import { Component, ReactNode } from 'react';

export class AppErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center p-8 text-center">
          <div>
            <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">{this.state.error.message}</p>
            <button onClick={() => this.setState({ error: null })} className="mt-4 underline text-sm">
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Wrap `<ClientInitializer>` in `layout.tsx` with `<AppErrorBoundary>`.

---

### SPEC-7: Surface Firestore errors in UI

**Priority:** Medium  
**Files:** `src/shared/components/layout/homepage.tsx`

`useCycles()` exposes `error: string | null`. The `Homepage` component ignores it. Add a visible error state:

```tsx
if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-destructive">{error}</p>
    </div>
  );
}
```

---

### SPEC-8: Delete stale migration scripts

**Priority:** Low  
**Files to delete:**
- `migrate-phase1.sh`
- `migrate-phase2-timer.sh`
- `update-imports-phase1.js`
- `update-imports-phase2.js`
- `verify-imports.js`

These are one-time import migration scripts. They are committed to the repo root and add noise. Delete them.

---

### SPEC-9: Improve `devcontainer.json`

**Priority:** Low  
**File:** `.devcontainer/devcontainer.json`

Switch to a Node-specific image and add a `postCreateCommand` to install dependencies automatically:

```json
{
  "name": "FlowTime Focus",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:22",
  "postCreateCommand": "npm install",
  "forwardPorts": [9003],
  "portsAttributes": {
    "9003": { "label": "Dev Server", "onAutoForward": "openPreview" }
  }
}
```

---

### SPEC-10: Fix `package.json` name

**Priority:** Low  
**File:** `package.json`

```json
"name": "flowtimefocus"
```

---

### SPEC-11: Add basic tests for timer machine

**Priority:** Medium  
**File:** `src/features/timer/machines/timer-machine.test.ts` (new file)

The XState machine is the most critical logic in the app and has zero test coverage. Add unit tests using `@xstate/test` or plain `createActor`:

```ts
import { createActor } from 'xstate';
import { timerMachine } from './timer-machine';

test('transitions idle → running on START', () => {
  const actor = createActor(timerMachine, { input: { duration: 60 } }).start();
  actor.send({ type: 'START' });
  expect(actor.getSnapshot().matches('running')).toBe(true);
});

test('transitions running → finished when timeLeft reaches 0', () => {
  const actor = createActor(timerMachine, { input: { duration: 1 } }).start();
  actor.send({ type: 'START' });
  actor.send({ type: 'TICK' }); // timeLeft → 0
  expect(actor.getSnapshot().matches('finished')).toBe(true);
});
```

Install `vitest` or use Jest (whichever is added to the project).

---

## Implementation Order

| Priority | Spec | Effort |
|----------|------|--------|
| Critical | SPEC-1: Firestore collection mismatch | Small |
| High | SPEC-2: playSounds duplication | Small |
| High | SPEC-3: Eliminate require() | Medium |
| High | SPEC-4: ClientInitializer race | Small |
| Medium | SPEC-5: .env.example | Trivial |
| Medium | SPEC-6: Error boundary | Small |
| Medium | SPEC-7: Surface Firestore errors | Trivial |
| Medium | SPEC-11: Timer machine tests | Medium |
| Low | SPEC-8: Delete migration scripts | Trivial |
| Low | SPEC-9: devcontainer.json | Trivial |
| Low | SPEC-10: package.json name | Trivial |
