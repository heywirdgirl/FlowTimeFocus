import { CycleProvider } from '@/contexts/cycle-context';
import { SettingsProvider } from '@/contexts/settings-context';
import { TimerProvider } from '@/contexts/timer-context';
import { Homepage } from '@/components/app/homepage';

export default function Home() {
  return (
    <SettingsProvider>
      <CycleProvider>
        <TimerProvider>
          <Homepage />
        </TimerProvider>
      </CycleProvider>
    </SettingsProvider>
  );
}
