"use client";

import { useEffect } from 'react';
import { useTimerStore } from '@/features/timer';
import { useCycleStore } from '@/features/cycles';

/**
 * Client-side initialization wrapper.
 * This component handles the initialization of all necessary stores and services
 * that should only run on the client.
 */
export function ClientInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize stores
    useTimerStore.getState().initializeTimer();
    useCycleStore.getState().loadCycles();
  }, []);

  return <>{children}</>;
}
