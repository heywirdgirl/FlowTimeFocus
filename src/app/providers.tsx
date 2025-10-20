// src/app/providers.tsx - ALL CLIENT CONTEXTS
'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { CycleProvider } from '@/contexts/cycle-context';
import { HistoryProvider } from '@/contexts/history-context';
import { useCycle } from '@/contexts/cycle-context';
import { TimerProvider } from '@/contexts/timer-context';

function CycleBridge({ children }: { children: React.ReactNode }) {
  const { currentCycle } = useCycle(); // ✅ Safe - inside CycleProvider
  return <HistoryProvider currentCycle={currentCycle}>{children}</HistoryProvider>;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CycleProvider>
        <CycleBridge>
          <TimerProvider>
            {children}
          </TimerProvider>
        </CycleBridge>
      </CycleProvider>
    </AuthProvider>
  );
}