"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth";
import { useCycleStore } from "@/features/cycles";

/**
 * This component acts as a gate to synchronize Firestore data with the Zustand store.
 * It listens to the auth state and starts or stops the synchronization accordingly.
 * It renders nothing to the DOM.
 */
export function SyncStoreGate() {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const startSync = useCycleStore((s) => s.startSyncCycles);
  const stopSync = useCycleStore((s) => s.stopSyncCycles);

  useEffect(() => {
    const unsubscribe = useAuthStore.getState().initialize();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    if (user?.uid) {
      startSync(user.uid);
    } else {
      stopSync();
    }
  }, [user, isInitialized, startSync, stopSync]);

  return null;
}
