export type Theme = 'light' | 'dark' | 'system';

export interface SettingsState {
  theme: Theme;
  playSounds: boolean;
}

export interface SettingsActions {
  setTheme: (theme: Theme) => void;
  toggleSounds: () => void;
}
