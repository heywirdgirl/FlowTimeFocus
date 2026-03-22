"use client";

import { useEffect } from 'react';
import { useTimerStore } from '@/features/timer';

/**
 * Client-side initialization wrapper.
 *
 * Only initializes the timer actor here. Cycle data loading is handled by
 * SyncStoreGate, which calls loadGuestData() (via stopSync) for guests and
 * startSync() for authenticated users — avoiding a race where loadGuestData()
 * would overwrite Firestore-synced cycles.
 */
export function ClientInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useTimerStore.getState().initializeTimer();
  }, []);

  return <>{children}</>;
}
