"use client";

import { TimerProvider } from "@/contexts/timer-context";
import { HistoryProvider } from "@/contexts/history-context";
import { CycleProvider } from "@/contexts/cycle-context"; // Loại bỏ SettingsProvider

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TimerProvider>
      <CycleProvider>
        <HistoryProvider>
          {children}
        </HistoryProvider>
      </CycleProvider>
    </TimerProvider>
  );
}