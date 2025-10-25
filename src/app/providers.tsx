"use client";

import { AuthProvider } from "@/contexts/auth-context"; // Import AuthProvider
import { TimerProvider } from "@/contexts/timer-context";
import { HistoryProvider } from "@/contexts/history-context";
import { CycleProvider } from "@/contexts/cycle-context";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider> {/* Đặt ngoài cùng */}
      <CycleProvider>
        <TimerProvider>
          <HistoryProvider>
            {children}
          </HistoryProvider>
        </TimerProvider>
      </CycleProvider>
    </AuthProvider>
  );
}