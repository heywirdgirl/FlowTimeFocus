"use client";

import { TimerProvider } from "@/contexts/timer-context";
import { HistoryProvider } from "@/contexts/history-context";
import { CycleProvider } from "@/contexts/cycle-context";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CycleProvider> {/* Đặt ngoài cùng */}
      <TimerProvider>
        <HistoryProvider>
          {children}
        </HistoryProvider>
      </TimerProvider>
    </CycleProvider>
  );
}