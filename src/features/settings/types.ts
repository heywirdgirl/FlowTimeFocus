export type Theme = 'light' | 'dark' | 'system';

export interface SettingsState {
  theme: Theme;
}

export interface SettingsActions {
  setTheme: (theme: Theme) => void;
}
