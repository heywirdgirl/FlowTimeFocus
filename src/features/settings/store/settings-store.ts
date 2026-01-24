import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsState, SettingsActions } from '../types';


export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      playSounds: true,
      toggleSounds: () => set((state) => ({ playSounds: !state.playSounds })),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => (
        {
          theme: state.theme, 
          playSounds: state.playSounds
        }
      ), 
    }
  )
);
