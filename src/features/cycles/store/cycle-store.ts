import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { cycleTemplates, DEFAULT_PHASE } from './cycle-templates';
import type { Cycle, Phase, CycleState } from "../types";
import { startSyncCycles, stopSyncCycles, saveCycle, deleteCycle as deleteCycleFromDb, createNewCycleInDb } from './firebase-sync';


export interface CycleActions {
    loadGuestData: () => void;
    startSync: (uid: string) => void;
    stopSync: () => void;
    setCurrentCycle: (cycleId: string) => void;
    setCurrentPhaseIndex: (index: number) => void;
    createNewCycle: () => Promise<void>;
    saveCurrentCycle: () => Promise<void>;
    deleteCycle: (cycleId: string) => Promise<void>;
    addPhase: () => void;
    updatePhase: (phaseId: string, updates: Partial<Phase>) => void;
    deletePhase: (phaseId: string) => void;
    toggleSounds: () => void; 
    updateCycle: (updates: Partial<Cycle>) => void;
    setCycles: (cycles: Cycle[]) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;

}

export type CycleStore = CycleState & CycleActions;

const initialState: Omit<CycleState, 'cycles' | 'currentCycleId'> = {
    currentPhaseIndex: 0,
    playSounds: true,
};

export const useCycleStore = create<CycleStore>()(
    persist(
        (set, get) => ({
            cycles: [],
            currentCycleId: null,
            ...initialState,

            // --- ACTIONS ---
            loadGuestData: () => {
                const guestCycles = cycleTemplates.map(template => ({ ...template, createdAt: Date.now() }));
                set({
                    cycles: guestCycles,
                    currentCycleId: guestCycles[0]?.id || null,
                    currentPhaseIndex: 0,
                    isLoading: false,
                });
                 const firstPhase = guestCycles[0]?.phases[0];
                 if (firstPhase) {
                     require('@/features/timer').useTimerStore.getState().send({ 
                         type: 'SELECT_CYCLE', 
                         duration: firstPhase.duration * 60,
                         title: firstPhase.title
                     });
                 }
            },

            startSync: (uid) => {
                startSyncCycles(uid, {
                    setCycles: get().setCycles,
                    setLoading: get().setLoading,
                    setError: get().setError,
                    get
                });
            },

            stopSync: () => {
                stopSyncCycles();
                get().loadGuestData();
            },

            setCurrentCycle: (cycleId) => {
                const cycle = get().cycles.find((c) => c.id === cycleId) || null;
                set({ currentCycleId: cycle?.id || null, currentPhaseIndex: 0 });

                const firstPhase = cycle?.phases[0];
                if (firstPhase) {
                    require('@/features/timer').useTimerStore.getState().send({ 
                        type: 'SELECT_CYCLE', 
                        duration: firstPhase.duration * 60
                    });
                }
            },

            setCurrentPhaseIndex: (index) => {
                const { cycles, currentCycleId } = get();
                const currentCycle = cycles.find(c => c.id === currentCycleId);
                const newPhase = currentCycle?.phases[index];

                set({ currentPhaseIndex: index });
                
                if (newPhase) {
                    require('@/features/timer').useTimerStore.getState().send({
                        type: 'SELECT_PHASE',
                        duration: newPhase.duration * 60
                    });
                }
            },

            createNewCycle: async () => {
                const { cycles, currentCycleId } = get();
                const newCycle: Cycle = {
                    id: uuidv4(),
                    name: "My New Cycle",
                    phases: [{ ...DEFAULT_PHASE, id: uuidv4() }],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };

                const user = require('@/features/auth').useAuthStore.getState().user;
                if (!user || user.isGuest) {
                    set({ cycles: [...cycles, newCycle], currentCycleId: newCycle.id });
                    return;
                }

                await createNewCycleInDb(user.uid, newCycle);
                // The sync will add the cycle to the store
            },

            saveCurrentCycle: async () => {
                const { cycles, currentCycleId } = get();
                const currentCycle = cycles.find(c => c.id === currentCycleId);
                const user = require('@/features/auth').useAuthStore.getState().user;

                if (!user || user.isGuest || !currentCycle) return;
                await saveCycle(user.uid, currentCycle);
            },

            deleteCycle: async (cycleId) => {
                require('@/features/timer').useTimerStore.getState().send({ type: 'STOP_FOR_EDIT' });
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
                await deleteCycleFromDb(user.uid, cycleId);
            },

            addPhase: () => {
                set(state => {
                    const currentCycle = state.cycles.find(c => c.id === state.currentCycleId);
                    if (!currentCycle) return {};
                    const newPhase: Phase = { ...DEFAULT_PHASE, id: uuidv4() };
                    const updatedPhases = [...currentCycle.phases, newPhase];
                    const updatedCycle = { ...currentCycle, phases: updatedPhases };
                    return {
                        cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
                    };
                });
            },

            updatePhase: (phaseId, updates) => {
                require('@/features/timer').useTimerStore.getState().send({ type: 'STOP_FOR_EDIT' });
                set(state => {
                    const currentCycle = state.cycles.find(c => c.id === state.currentCycleId);
                    if (!currentCycle) return {};
                    const updatedPhases = currentCycle.phases.map(p => p.id === phaseId ? { ...p, ...updates } : p);
                    const updatedCycle = { ...currentCycle, phases: updatedPhases };
                    return {
                        cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
                    };
                });
            },

            deletePhase: (phaseId) => {
                require('@/features/timer').useTimerStore.getState().send({ type: 'STOP_FOR_EDIT' });
                set(state => {
                    const currentCycle = state.cycles.find(c => c.id === state.currentCycleId);
                    if (!currentCycle) return {};
                    const updatedPhases = currentCycle.phases.filter(p => p.id !== phaseId);
                    const updatedCycle = { ...currentCycle, phases: updatedPhases };
                    return {
                        cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
                    };
                });
            },
            

updateCycle: (updates) => {
    set(state => {
        const currentCycle = state.cycles.find(c => c.id === state.currentCycleId);
        if (!currentCycle) return {};
        const updatedCycle = { ...currentCycle, ...updates };
        return {
            cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
        };
    });
},


            toggleSounds: () => set(state => ({ playSounds: !state.playSounds })),
            setCycles: (cycles) => set({ cycles }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
        }),
        {
            name: 'cycle-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setLoading(true);
                    state.playSounds = state.playSounds ?? true;
                }
            },
            partialize: (state) => ({
                currentCycleId: state.currentCycleId,
                currentPhaseIndex: state.currentPhaseIndex,
                playSounds: state.playSounds,
            }),
        }
    )
);
