# FlowTime Focus

A timer app for structured focus sessions built on Next.js 15. Users can create custom cycles — sequences of timed phases (work, break, breathing, etc.) — and run them with a state-machine-driven countdown timer.

**Key features:**
- Custom cycle builder: define any number of phases with individual durations
- Built-in templates: Classic Pomodoro, Wim Hof Breathing, Meditation Training
- Timer driven by an XState v5 state machine (`idle → running ⇄ paused → finished`)
- Background color shifts to reflect the active session type (focus vs. rest)
- Firebase Auth + Firestore sync for authenticated users; guest mode with in-memory state
- Theme support (light/dark)

**Stack:** Next.js 15 (App Router) · TypeScript · Zustand · XState v5 · Firebase · Shadcn UI · Tailwind CSS

## Project Structure

The project follows feature-driven design — each feature is a self-contained module with its own components, hooks, and store.

```
src
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── popover.tsx
│       ├── select.tsx
│       └── tooltip.tsx
├── core
│   ├── client-initializer.tsx
│   ├── index.ts
│   └── sync-store-gate.tsx
├── features
│   ├── auth
│   │   ├── components
│   │   │   └── email-auth-dialog.tsx
│   │   ├── hooks
│   │   │   └── use-auth.ts
│   │   ├── index.ts
│   │   ├── store
│   │   │   └── auth-store.ts
│   │   └── types.ts
│   ├── cycles
│   │   ├── components
│   │   │   ├── cycle-card.tsx
│   │   │   ├── cycle-list.tsx
│   │   │   └── phase-editor.tsx
│   │   ├── hooks
│   │   │   └── use-cycles.ts
│   │   ├── index.ts
│   │   ├── store
│   │   │   ├── cycle-store.ts
│   │   │   ├── cycle-templates.ts
│   │   │   └── firebase-sync.ts
│   │   ├── types.ts
│   │   └── utils
│   │       └── cycle-helpers.ts
│   ├── settings
│   │   ├── hooks
│   │   │   └── use-settings.ts
│   │   ├── index.ts
│   │   ├── store
│   │   │   └── settings-store.ts
│   │   └── types.ts
│   ├── theme
│   │   └── index.ts
│   └── timer
│       ├── components
│       │   └── timer-display.tsx
│       ├── hooks
│       │   └── use-timer.ts
│       ├── index.ts
│       ├── machines
│       │   └── timer-machine.ts
│       ├── store
│       │   └── timer-store.ts
│       └── types.ts
└── shared
    ├── components
    │   ├── layout
    │   │   ├── footer.tsx
    │   │   ├── header.tsx
    │   │   ├── homepage.tsx
    │   │   └── index.ts
    │   ├── theme
    │   │   ├── index.ts
    │   │   └── theme-provider.tsx
    │   └── ui
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── dialog.tsx
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── index.ts
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet-new.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       └── tooltip.tsx
    ├── hooks
    │   ├── index.ts
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── lib
    │   ├── firebase.ts
    │   ├── index.ts
    │   ├── placeholder-images.json
    │   ├── placeholder-images.ts
    │   └── utils.ts
    └── types
        └── index.ts
```

### Core Concepts of the New Structure:

*   **`src/app`**: Contains global styles, layout, and the main entry point of the application (`page.tsx`).
*   **`src/core`**: Holds the essential, application-wide logic that needs to be initialized or configured at the root of the project.
    *   `client-initializer.tsx`: Initializes client-side services and libraries.
    *   `sync-store-gate.tsx`: Manages the synchronization of the Zustand store with Firebase.
*   **`src/features`**: Each feature of the application (e.g., `auth`, `cycles`, `timer`, `theme`) is a self-contained module. Each feature folder typically contains its own `components`, `hooks`, and `store`.
*   **`src/shared`**: Contains code that is shared across multiple features. This includes reusable UI `components` (from Shadcn UI), `hooks`, `lib` (like Firebase configuration), and `types`.
*   **`src/components/ui`**: Contains freshly scaffolded Shadcn UI primitives for the app shell and new component wiring, such as `button`, `dialog`, `dropdown-menu`, `popover`, `select`, and `tooltip`.

## Main File Functionalities

### `src/app/layout.tsx` & `src/app/page.tsx`
These files are the main entry points for the application's UI. `layout.tsx` sets up the global page structure and providers like `ThemeProvider`. `page.tsx` renders the primary `Homepage` component, which is now located in `src/shared/components/layout`.

### `src/features`
This directory contains the core features of the application.

*   **`features/auth`**: Manages user authentication, including the UI for login (`email-auth-dialog.tsx`), authentication hooks (`use-auth.ts`), and the authentication store (`auth-store.ts`).
*   **`features/cycles`**: Manages the "flow time" cycles. It includes components for listing and editing cycles (`cycle-list.tsx`, `phase-editor.tsx`), hooks for interacting with cycles (`use-cycles.ts`), and the cycle store (`cycle-store.ts`).
*   **`features/theme`**: Manages the application's theme (light/dark mode).
*   **`features/timer`**: This is where the timer logic resides.
    *   **`machines/timer-machine.ts`**: Defines the core logic of the timer using an **XState state machine**. It handles states like `idle`, `running`, `paused`, and `finished`.
    *   **`store/timer-store.ts`**: Manages the state of the timer itself, powered by the XState state machine.
    *   **`components/timer-display.tsx`**: The UI component that displays the timer.

### `src/shared/components/ui/`
This directory contains reusable UI components built with **Shadcn UI**, such as `Button`, `Dialog`, and `Card`, used consistently throughout the application.

### `src/shared/lib/firebase.ts`
This file configures the Firebase connection for the application.
