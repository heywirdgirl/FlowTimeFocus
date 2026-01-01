
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useSettingStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark', // Default theme set to dark
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'settings-storage', // Name for localStorage key
    }
  )
);
