# Architecture

Overview
- Web app Next.js (App Router) + TypeScript
- UI: Tailwind + shadcn components
- State: XState v5 (timer), Zustand (app/global data)
- Backend: Firebase Auth + Firestore (no custom backend in v1)

High-level flow
- Client renders UI → XState controls timer state
- User cycles stored in Firestore under `users/{id}/cycles`
- Sync logic: guest (local) → on login merge → Firestore

Hosting & infra
- Vercel / Next.js static + serverless for future API routes
- Firebase for auth/storage

Dependencies (key): Next.js, React, XState, Zustand, Firebase, TailwindCSS
