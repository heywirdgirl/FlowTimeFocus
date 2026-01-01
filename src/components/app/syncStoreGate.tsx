
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useCycleStore } from "@/store/useCycleStore"; // Corrected import path

/**
 * This component acts as a gate to synchronize Firestore data with the Zustand store.
 * It listens to the auth state and starts or stops the synchronization accordingly.
 * It renders nothing to the DOM.
 */
export function SyncStoreGate() {
  // Initialize the auth listener
  useEffect(() => {
    const unsubscribe = useAuthStore.getState().initialize();
    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const user = useAuthStore((s) => s.user);
  const startSync = useCycleStore((s) => s.startSyncCycles);
  const stopSync = useCycleStore((s) => s.stopSyncCycles);

  useEffect(() => {
    if (user?.uid) {
      console.log("User found, starting sync for UID:", user.uid);
      startSync(user.uid);
    } else {
      console.log("No user, stopping sync.");
      stopSync();
    }
    
    // The main cleanup is handled by the unmount of the component, 
    // but we can also stop sync if the user object changes to null.
    return () => {
        if (!user?.uid) {
            stopSync();
        }
    };
  }, [user, startSync, stopSync]);

  return null; // This component does not render anything
}
