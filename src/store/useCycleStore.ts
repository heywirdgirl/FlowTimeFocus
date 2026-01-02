
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCycleActions } from './cycle-store-logic';
import type { Cycle, Phase } from '@/lib/types';

// --- State and Store Types ---

export interface CycleState {
    cycles: Cycle[];
    currentCycle: Cycle | null;
    currentPhaseIndex: number;
    isLoading: boolean;
    isGuestMode: boolean;
    userId: string | null;
    unsubscribe: (() => void) | null;
}

export interface CycleActions {
    loadGuestData: () => void;
    startSyncCycles: (uid: string) => void;
    stopSyncCycles: () => void;
    setCurrentCycle: (cycleId: string) => void;
    setCurrentPhaseIndex: (index: number) => void;
    goToNextPhase: () => void;
    saveCurrentCycle: () => Promise<void>;
    deleteCycle: (cycleId: string) => Promise<void>;
    addPhase: () => void;
    updatePhase: (phaseId: string, updates: Partial<Phase>) => void;
    deletePhase: (phaseId: string) => void;
}

// The complete store type
export type CycleStore = CycleState & CycleActions;

// --- Store Definition ---

const initialState: CycleState = {
    cycles: [],
    currentCycle: null,
    currentPhaseIndex: 0,
    isLoading: true,
    isGuestMode: true,
    userId: null,
    unsubscribe: null,
};

export const useCycleStore = create<CycleStore>()(
    persist(
        (set, get) => ({
            ...initialState,
            ...createCycleActions(set as any, get as any),
        }),
        {
            name: 'cycle-storage', // name of the item in the storage (must be unique)
            partialize: (state) => ({
                // Only persist non-serializable or less critical parts
                currentCycle: state.currentCycle,
                currentPhaseIndex: state.currentPhaseIndex,
            }),
            // Do not persist the unsubscribe function
            onRehydrateStorage: () => (state) => {
                if (state) state.unsubscribe = null;
            },
        }
    )
);

// Initialize for guest user if no user is logged in
useCycleStore.getState().loadGuestData();
