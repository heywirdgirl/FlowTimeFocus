// src/app/providers.tsx - FINAL STACK
'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { CycleProvider } from '@/contexts/cycle-context';
import { HistoryProvider } from '@/contexts/history-context';
import { TimerProvider } from '@/contexts/timer-context'; // ✅
import { SettingsProvider } from '@/contexts/settings-context'; // ✅ If exists
import { useCycle } from '@/contexts/cycle-context';

function CycleBridge({ children }: { children: React.ReactNode }) {
  const { currentCycle } = useCycle();
  return <HistoryProvider currentCycle={currentCycle}>{children}</HistoryProvider>;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider> {/* ✅ If you have */}
        <CycleProvider>
          <CycleBridge>
            <TimerProvider> {/* ✅ FINAL! */}
              {children}
            </TimerProvider>
          </CycleBridge>
        </CycleProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}