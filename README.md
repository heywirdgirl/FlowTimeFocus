# Flow Time App v1

This is a Next.js application designed for time management using a highly configurable "flow time" or Pomodoro-like technique. It uses Zustand for state management, XState for the timer logic, and Firebase for backend data persistence and authentication.

## Project Structure

The project is organized following the principles of feature-driven design, which helps in separating concerns and improving scalability.

```
src
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── homepage.tsx
│   ├── layout.tsx
│   └── page.tsx
├── core
│   ├── client-initializer.tsx
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
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toaster.tsx
    │       ├── toast.tsx
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
    │   ├── types.ts
    │   └── utils.ts
    └── types
        └── index.ts
```

### Core Concepts of the New Structure:

*   **`src/app`**: Contains global styles, layout, and the main entry point of the application (`page.tsx`). It also includes the `homepage.tsx` which is the main page of the app.
*   **`src/core`**: Holds the essential, application-wide logic that needs to be initialized or configured at the root of the project.
    *   `client-initializer.tsx`: Initializes client-side services and libraries.
    *   `sync-store-gate.tsx`: Manages the synchronization of the Zustand store with Firebase.
*   **`src/features`**: Each feature of the application (e.g., `auth`, `cycles`, `timer`) is a self-contained module. Each feature folder typically contains its own `components`, `hooks`, and `store`.
*   **`src/shared`**: Contains code that is shared across multiple features. This includes reusable UI `components` (from Shadcn UI), `hooks`, `lib` (like Firebase configuration), and `types`.

## Main File Functionalities

### `src/app/layout.tsx` & `src/app/page.tsx`
These files are the main entry points for the application's UI. `layout.tsx` sets up the global page structure and providers like `ThemeProvider`. `page.tsx` renders the primary `Homepage` component.

### `src/features`
This directory contains the core features of the application.

*   **`features/auth`**: Manages user authentication, including the UI for login (`email-auth-dialog.tsx`), authentication hooks (`use-auth.ts`), and the authentication store (`auth-store.ts`).
*   **`features/cycles`**: Manages the "flow time" cycles. It includes components for listing and editing cycles (`cycle-list.tsx`, `phase-editor.tsx`), hooks for interacting with cycles (`use-cycles.ts`), and the cycle store (`cycle-store.ts`).
*   **`features/timer`**: This is where the timer logic resides.
    *   **`machines/timer-machine.ts`**: Defines the core logic of the timer using an **XState state machine**. It handles states like `idle`, `running`, `paused`, and `finished`.
    *   **`store/timer-store.ts`**: Manages the state of the timer itself, powered by the XState state machine.
    *   **`components/timer-display.tsx`**: The UI component that displays the timer.

### `src/shared/components/ui/`
This directory contains reusable UI components built with **Shadcn UI**, such as `Button`, `Dialog`, and `Card`, used consistently throughout the application.

### `src/shared/lib/firebase.ts`
This file configures the Firebase connection for the application.
