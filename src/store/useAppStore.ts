import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cycle, Phase, AudioAsset } from "@/lib/types";

interface AppStore {
  // --- Cycle State ---
  privateCycles: Cycle[];
  currentCycle: Cycle | null;
  currentPhaseIndex: number;
  
  // --- Settings State ---
  playSounds: boolean;
  theme: 'light' | 'dark' | 'system';
  audioLibrary: AudioAsset[];

  // --- Actions ---
  setCurrentCycle: (cycle: Cycle) => void;
  updatePhase: (phaseId: string, updates: Partial<Phase>) => void;
  advancePhase: () => void;
  toggleSound: () => void;
  // Các hàm Firebase CRUD sẽ đặt ở đây...
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      privateCycles: [],
      currentCycle: null,
      currentPhaseIndex: 0,
      playSounds: true,
      theme: 'system',
      audioLibrary: [
        { id: 'sound_1', name: 'Instant Win', url: '/sounds/instant-win.wav' },
        { id: 'sound_2', name: 'Winning Notification', url: '/sounds/winning-notification.wav' },
      ],

      setCurrentCycle: (cycle) => set({ currentCycle: cycle, currentPhaseIndex: 0 }),
      
      updatePhase: (phaseId, updates) => {
        const { currentCycle } = get();
        if (!currentCycle) return;
        const newPhases = currentCycle.phases.map(p => p.id === phaseId ? { ...p, ...updates } : p);
        set({ currentCycle: { ...currentCycle, phases: newPhases } });
      },

      advancePhase: () => {
        const { currentCycle, currentPhaseIndex } = get();
        if (currentCycle && currentPhaseIndex < currentCycle.phases.length - 1) {
          set({ currentPhaseIndex: currentPhaseIndex + 1 });
        } else {
          set({ currentPhaseIndex: 0 }); // Hoặc logic kết thúc cycle
        }
      },

      toggleSound: () => set((state) => ({ playSounds: !state.playSounds })),
    }),
    { name: 'flowtime-storage' } // Tự động lưu LocalStorage thay cho SettingsProvider
  )
);
