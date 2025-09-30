
# Flow Time App

This is a Next.js application designed for time management, likely implementing a "flow time" or Pomodoro-like technique.

## Project Structure

```
.
├── components.json
├── docs
│   └── blueprint.md
├── firestore.rules
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
│   └── sounds
├── README.md
├── src
│   ├── ai
│   │   ├── dev.ts
│   │   ├── flows
│   │   │   └── smart-session-recommendation.ts
│   │   └── genkit.ts
│   ├── app
│   │   ├── create
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── app
│   │   └── ui
│   ├── contexts
│   │   ├── cycle-context.tsx
│   │   ├── settings-context.tsx
│   │   └── timer-context.tsx
│   ├── hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   └── lib
│       ├── firebase.ts
│       ├── placeholder-images.json
│       ├── placeholder-images.ts
│       ├── types.ts
│       └── utils.ts
├── tailwind.config.ts
└── tsconfig.json
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
