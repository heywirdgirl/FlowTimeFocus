import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { cycleTemplates } from './cycle-templates';
import { 
  deleteCycleFromDb, 
  createNewCycleInDb, 
  startSyncCycles, 
  stopSyncCycles 
} from './firebase-sync';
import { toast } from '@/shared/hooks/use-toast';
import type { Cycle, Phase } from '@/schemas';

// Default phase for new cycles
export const DEFAULT_PHASE: Omit<Phase, 'id'> = {
  title: 'Pomodoro',
  duration: 25, 
  type: 'work',
};

export interface CycleStore {
  cycles: Cycle[];
  currentCycleId: string | null;
  currentPhaseIndex: number;
  loading: boolean;
  error: string | null;
  setCycles: (cycles: Cycle[]) => void;
  setCurrentCycle: (cycleId: string) => void;
  setCurrentPhaseIndex: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  deleteCycle: (cycleId: string) => Promise<void>;
  canDeleteCycle: () => boolean;
  createCycle: (cycleToClone?: Cycle) => Promise<void>;
  updateCycle: (cycle: Cycle) => void;
  loadGuestData: () => void;
  startSync: (uid: string) => void;
  stopSync: () => void;
  get: () => CycleStore;
}

export const useCycleStore = create<CycleStore>((set, get) => ({
  cycles: [],
  currentCycleId: null,
  currentPhaseIndex: 0,
  loading: true,
  error: null,
  setCycles: (cycles) => set({ cycles }),
  setCurrentCycle: (cycleId) => {
    const { cycles } = get();
    const cycleExists = cycles.some((c) => c.id === cycleId);
    if (cycleExists) {
      set({ currentCycleId: cycleId, currentPhaseIndex: 0 });
    } else {
      console.warn(`Attempted to set non-existent cycleId: ${cycleId}`);
      if (cycles.length > 0) {
        set({ currentCycleId: cycles[0].id, currentPhaseIndex: 0 });
      }
    }
  },
  setCurrentPhaseIndex: (index) => set({ currentPhaseIndex: index }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  deleteCycle: async (cycleId) => {
    if (!get().canDeleteCycle()) {
        toast({ title: "Cannot delete the last cycle", variant: "destructive" });
        return;
    }
    
    try {
        const timerStore = require('@/features/timer').useTimerStore.getState();
        timerStore.send({ type: 'STOP_FOR_EDIT' });
        
        const { cycles, currentCycleId } = get();
        const user = require('@/features/auth').useAuthStore.getState().user;

        if (currentCycleId === cycleId) {
            const newCurrentCycle = cycles.find(c => c.id !== cycleId) || cycleTemplates[0];
            set({ currentCycleId: newCurrentCycle.id, currentPhaseIndex: 0 });
        }

        if (!user || user.isGuest) {
            set({ cycles: cycles.filter(c => c.id !== cycleId) });
            return;
        }
        
        console.log("Deleting cycle from Firebase:", cycleId);
        await deleteCycleFromDb(user.uid, cycleId);
        toast({ title: "Cycle deleted successfully" });
        
    } catch (error) {
        console.error("❌ Error in deleteCycle:", error);
        
        set({ 
            error: error instanceof Error ? error.message : "Failed to delete cycle" 
        });
        
        toast({ title: "Failed to delete cycle", variant: "destructive" });
    }
  },
  canDeleteCycle: () => get().cycles.length > 1,
  createCycle: async (cycleToClone) => {
    try {
        const { cycles } = get();
        let newCycle: Cycle;

        if (cycleToClone) {
            newCycle = {
                ...cycleToClone,
                id: uuidv4(),
                name: `${cycleToClone.name} (Copy)`,
                phases: cycleToClone.phases.map(p => ({
                    ...p,
                    id: uuidv4()
                })),
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
        } else {
            newCycle = {
                id: uuidv4(),
                name: "My New Cycle",
                phases: [{ ...DEFAULT_PHASE, id: uuidv4() }],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
        }

        const user = require('@/features/auth').useAuthStore.getState().user;
        
        if (!user || user.isGuest) {
            set({ cycles: [...cycles, newCycle], currentCycleId: newCycle.id });
            return;
        }

        console.log("Creating cycle in Firebase:", newCycle.name);
        await createNewCycleInDb(user.uid, newCycle);
        toast({ title: "Cycle created successfully" });
        
    } catch (error) {
        console.error("❌ Error in createCycle:", error);
        set({ 
            error: error instanceof Error ? error.message : "Failed to create cycle" 
        });
        toast({ title: "Failed to create cycle", variant: "destructive" });
    }
  },
  updateCycle: (updatedCycle) => {
    set((state) => ({
      cycles: state.cycles.map((cycle) =>
        cycle.id === updatedCycle.id ? updatedCycle : cycle
      ),
    }));
  },
  loadGuestData: () => {
    const { cycles } = get();
    if (cycles.length === 0) {
      console.log("Loading default cycles for guest user.");
      set({
        cycles: cycleTemplates,
        currentCycleId: cycleTemplates.length > 0 ? cycleTemplates[0].id : null,
        loading: false,
      });
    }
  },
  startSync: (uid) => {
    startSyncCycles(uid, {
      setCycles: get().setCycles,
      setLoading: get().setLoading,
      setError: get().setError,
      get: get().get,
    });
  },
  stopSync: () => {
    stopSyncCycles();
    set({ cycles: [], currentCycleId: null, loading: false }); // Reset state on logout
  },
  get: () => get(),
}));
