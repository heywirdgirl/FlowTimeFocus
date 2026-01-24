import { useSettingsStore } from './store/settings-store';

/**
 * Convenient hook for accessing and modifying user settings.
 */
export function useSettings() {
  const { theme, setTheme, playSounds, toggleSounds } = useSettingsStore();

  return {
    theme,
    setTheme,
    playSounds,
    toggleSounds,
  };
}
