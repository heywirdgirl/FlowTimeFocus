
# Flow Time App

This is a Next.js application designed for time management, likely implementing a "flow time" or Pomodoro-like technique.

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
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib
│   ├── firebase.ts
│   ├── placeholder-images.json
│   ├── placeholder-images.ts
│   ├── types.ts
│   └── utils.ts
└── store
    ├── use-auth-store.ts
    ├── useCycleStore.ts
    ├── use-setting-store.ts
    └── useTimerStore.ts
```

## Main File Functionalities

### `src/app/page.tsx`

This is the main entry point for the application's UI. It sets up the core context providers (`SettingsProvider`, `CycleProvider`, `TimerProvider`) and renders the `Homepage` component.

### `src/components/app/homepage.tsx`

This component likely renders the main user interface for the application, including the timer display, cycle information, and task management.

### `src/contexts/`

-   **`cycle-context.tsx`**: Manages the state related to cycles or phases of a work session.
-   **`settings-context.tsx`**: Manages user-configurable settings for the application.
-   **`timer-context.tsx`**: Manages the state and logic for the timer.

### `src/components/ui/`

This directory contains reusable UI components used throughout the application, such as buttons, dialogs, and cards, built with Shadcn UI.

### `src/ai/`

This directory contains files related to AI functionalities.
- **`genkit.ts`**: Seems to be the main configuration file for Genkit.
- **`flows/smart-session-recommendation.ts`**: This file likely contains the logic for a Genkit flow that provides smart session recommendations.
- **`dev.ts`**: This file is likely used for development and testing of the AI flows.
