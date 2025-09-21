import { FlowTimeApp } from '@/components/app/flow-time-app';
import { SettingsProvider } from '@/contexts/settings-context';
import { TimerProvider } from '@/contexts/timer-context';

export default function Home() {
  return (
    <SettingsProvider>
      <TimerProvider>
        <FlowTimeApp />
      </TimerProvider>
    </SettingsProvider>
  );
}
