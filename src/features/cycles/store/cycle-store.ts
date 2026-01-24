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
    addPhase: (cycleId: string) => void;
    updatePhase: (cycleId: string, phaseId: string, updates: Partial<Phase>) => void;
    deletePhase: (cycleId: string, phaseId: string) => void;
    toggleSounds: () => void; 
    updateCycle: (cycleId: string, updates: Partial<Cycle>) => void;
    setCycles: (cycles: Cycle[]) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    canDeletePhase: (cycleId: string) => boolean;
    canDeleteCycle: () => boolean;
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
                const { cycles } = get();
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
            },

            saveCurrentCycle: async () => {
                const { cycles, currentCycleId } = get();
                const currentCycle = cycles.find(c => c.id === currentCycleId);
                const user = require('@/features/auth').useAuthStore.getState().user;

                if (!user || user.isGuest || !currentCycle) return;
                await saveCycle(user.uid, currentCycle);
            },

            deleteCycle: async (cycleId) => {
                if (get().cycles.length <= 1) {
                    console.warn('Cannot delete the last cycle');
                    return;
                }
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

            addPhase: (cycleId) => {
                set(state => {
                    const cycle = state.cycles.find(c => c.id === cycleId);
                    if (!cycle) return {};
                    const newPhase: Phase = { ...DEFAULT_PHASE, id: uuidv4() };
                    const updatedPhases = [...cycle.phases, newPhase];
                    const updatedCycle = { ...cycle, phases: updatedPhases, updatedAt: Date.now() };
                    return {
                        cycles: state.cycles.map(c => c.id === cycleId ? updatedCycle : c)
                    };
                });
            },

            updatePhase: (cycleId, phaseId, updates) => {
                require('@/features/timer').useTimerStore.getState().send({ type: 'STOP_FOR_EDIT' });
                set(state => {
                    const cycle = state.cycles.find(c => c.id === cycleId);
                    if (!cycle) return {};
                    const updatedPhases = cycle.phases.map(p => p.id === phaseId ? { ...p, ...updates } : p);
                    const updatedCycle = { ...cycle, phases: updatedPhases, updatedAt: Date.now() };
                    return {
                        cycles: state.cycles.map(c => c.id === cycleId ? updatedCycle : c)
                    };
                });
            },

            deletePhase: (cycleId, phaseId) => {
                set(state => {
                    const cycle = state.cycles.find(c => c.id === cycleId);
                    if (!cycle) return {};
                    
                    if (cycle.phases.length <= 1) {
                        console.warn('Cannot delete the last phase of a cycle. A cycle must have at least one phase.');
                        return {};
                    }
                    
                    require('@/features/timer').useTimerStore.getState().send({ type: 'STOP_FOR_EDIT' });
                    
                    const updatedPhases = cycle.phases.filter(p => p.id !== phaseId);
                    const updatedCycle = { ...cycle, phases: updatedPhases, updatedAt: Date.now() };
                    
                    const { currentPhaseIndex } = state;
                    const deletedPhaseIndex = cycle.phases.findIndex(p => p.id === phaseId);
                    let newPhaseIndex = currentPhaseIndex;
                    
                    if (deletedPhaseIndex === currentPhaseIndex) {
                        newPhaseIndex = Math.max(0, currentPhaseIndex - 1);
                    } else if (deletedPhaseIndex < currentPhaseIndex) {
                        newPhaseIndex = currentPhaseIndex - 1;
                    }
                    newPhaseIndex = Math.min(newPhaseIndex, updatedPhases.length - 1);
                    
                    return {
                        cycles: state.cycles.map(c => c.id === cycleId ? updatedCycle : c),
                        currentPhaseIndex: newPhaseIndex
                    };
                });
            },

            canDeletePhase: (cycleId) => {
                const cycle = get().cycles.find(c => c.id === cycleId);
                return cycle ? cycle.phases.length > 1 : false;
            },

            canDeleteCycle: () => get().cycles.length > 1,

            updateCycle: (cycleId, updates) => {
                set(state => {
                    const cycle = state.cycles.find(c => c.id === cycleId);
                    if (!cycle) return {};
                    const updatedCycle = { ...cycle, ...updates, updatedAt: Date.now() };
                    return {
                        cycles: state.cycles.map(c => c.id === cycleId ? updatedCycle : c)
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