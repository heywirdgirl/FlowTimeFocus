"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useCycleStore } from "@/store/use-cycle-store";

export function SyncStoreGate() {
  const { user } = useAuth();
  const startSync = useCycleStore((s) => s.startSyncCycles);
  const stopSync = useCycleStore((s) => s.stopSyncCycles);

  useEffect(() => {
    if (user?.uid) {
      startSync(user.uid);
    } else {
      stopSync();
    }
    
    // Cleanup khi đóng trình duyệt hoặc logout
    return () => stopSync();
  }, [user, startSync, stopSync]);

  return null; // Component này không hiển thị gì cả
}
