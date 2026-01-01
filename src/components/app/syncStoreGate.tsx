
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useCycleStore } from "@/store/useCycleStore";
import { useCallback } from "react";

/**
 * This component acts as a gate to synchronize Firestore data with the Zustand store.
 * It listens to the auth state and starts or stops the synchronization accordingly.
 * It renders nothing to the DOM.
 */
export function SyncStoreGate() {
  // Initialize the auth listener when the app mounts
  useEffect(() => {
    const unsubscribe = useAuthStore.getState().initialize();
    // Cleanup the listener when the app unmounts
    return () => unsubscribe();
  }, []);

  // Select state values individually to prevent unnecessary re-renders
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // Select actions. These are stable and won't cause re-renders.
  const startSync = useCycleStore((s) => s.startSyncCycles);
  const stopSync = useCycleStore((s) => s.stopSyncCycles);

  useEffect(() => {
    // Only proceed if the auth state has been initialized
    if (!isInitialized) return;

    if (user?.uid) {
      console.log("User detected, starting sync for UID:", user.uid);
      startSync(user.uid);
    } else {
      console.log("No user detected, loading guest data.");
      // Use stopSync to clean up any previous sync and load guest data
      stopSync();
    }
    
  }, [user, isInitialized, startSync, stopSync]);

  return null; // This component does not render anything
}
