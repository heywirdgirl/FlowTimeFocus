
"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { CycleProvider } from "@/contexts/cycle-context";
import { HistoryProvider } from "@/contexts/history-context";
import { TimerProvider } from "@/contexts/timer-context";
import { SettingsProvider } from "@/contexts/settings-context";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CycleProvider>
          <HistoryProvider>
            <TimerProvider>
              {children}
            </TimerProvider>
          </HistoryProvider>
        </CycleProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
