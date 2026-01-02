
# Flow Time App

This is a Next.js application designed for time management using a highly configurable "flow time" or Pomodoro-like technique. It uses Zustand for state management, XState for the timer logic, and Firebase for backend data persistence and authentication.

## Project Structure

```
src
├── ai
│   └── timer-machine.ts
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── app
│   │   ├── client-initializer.tsx
│   │   ├── cycle-list.tsx
│   │   ├── cycle-progress-bar.tsx
│   │   ├── email-auth-dialog.tsx
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   ├── homepage.tsx
│   │   ├── phase-editor.tsx
│   │   ├── sortable-phase-card.tsx
│   │   ├── syncStoreGate.tsx
│   │   ├── task-manager.tsx
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── timer-display.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── ... (Shadcn UI components)
│       └── tooltip.tsx
├── hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib
│   ├── firebase.ts
│   ├── placeholder-images.json
│   ├── placeholder-images.ts
│   ├── types.ts
│   └── utils.ts
└── store
    ├── cycle-templates.ts
    ├── store-initializer.ts
    ├── use-auth-store.ts
    ├── useCycleStore.ts
    ├── use-setting-store.ts
    └── useTimerStore.ts
```

## Main File Functionalities

### `src/app/layout.tsx` & `src/app/page.tsx`
These files are the main entry points for the application's UI. `layout.tsx` sets up the global page structure and providers like `ThemeProvider` and our client-side store initializer. `page.tsx` renders the primary `Homepage` component.

### `src/components/app/homepage.tsx`
This component renders the main user interface, bringing together the timer display, cycle and phase management, and other user-facing elements.

### `src/store/`
This directory is the heart of our client-side state management, using **Zustand**.
- **`useCycleStore.ts`**: Manages the state for pomodoro cycles, phases, and user-specific cycle data. Handles CRUD operations for cycles and phases and syncs with Firebase.
- **`useTimerStore.ts`**: Manages the state of the timer itself, powered by an XState state machine. It holds the timer's actor, current time left, and its active state.
- **`useAuthStore.ts`**: Manages user authentication state, including user ID and guest status.
- **`store-initializer.ts`**: A client-side-only file used to initialize and synchronize stores when the app loads.

### `src/ai/timer-machine.ts`
This file defines the core logic of the timer using an **XState state machine**. It handles states like `idle`, `running`, `paused`, and `finished`, and manages transitions between them based on events like `START`, `PAUSE`, `SKIP`, and `RESET`.

### `src/components/ui/`
This directory contains reusable UI components built with **Shadcn UI**, such as `Button`, `Dialog`, and `Card`, used consistently throughout the application.

