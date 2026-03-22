import { useSettingsStore } from '../store/settings-store';
import { useCycleStore } from '@/features/cycles/store/cycle-store';

/**
 * Convenient hook for accessing and modifying user settings.
 *
 * theme/setTheme live in useSettingsStore (persisted separately).
 * playSounds/toggleSounds live in useCycleStore — that is the single
 * source of truth read by the timer.
 */
export function useSettings() {
  const { theme, setTheme } = useSettingsStore();
  const playSounds = useCycleStore((s) => s.playSounds);
  const toggleSounds = useCycleStore((s) => s.toggleSounds);

  return {
    theme,
    setTheme,
    playSounds,
    toggleSounds,
  };
}
