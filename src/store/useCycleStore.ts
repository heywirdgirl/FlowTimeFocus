
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, onSnapshot, setDoc, deleteDoc, collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from 'uuid';
import { OFFICIAL_TEMPLATES, DEFAULT_PHASE } from './cycle-templates';
import { useTimerStore } from './useTimerStore'; // Import timer store
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
    playSounds: boolean; // Add playSounds to state
}

export interface CycleActions {
    loadGuestData: () => void;
    startSyncCycles: (uid: string) => void;
    stopSyncCycles: () => void;
    setCurrentCycle: (cycleId: string) => void;
    setCurrentPhaseIndex: (index: number) => void;
    goToNextPhase: () => void;
    createNewCycle: () => Promise<void>;
    saveCurrentCycle: () => Promise<void>;
    deleteCycle: (cycleId: string) => Promise<void>;
    addPhase: () => void;
    updatePhase: (phaseId: string, updates: Partial<Phase>) => void;
    deletePhase: (phaseId: string) => void;
    toggleSounds: () => void; // Add toggleSounds action
}

export type CycleStore = CycleState & CycleActions;

// --- Store Implementation ---

const initialState: CycleState = {
    cycles: [],
    currentCycle: null,
    currentPhaseIndex: 0,
    isLoading: true,
    isGuestMode: true,
    userId: null,
    unsubscribe: null,
    playSounds: true, // Default to true
};

export const useCycleStore = create<CycleStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            // --- ACTIONS ---
            loadGuestData: () => {
                const guestCycles = OFFICIAL_TEMPLATES.map(template => ({ ...template, createdAt: new Date() }));
                set({
                    cycles: guestCycles,
                    currentCycle: guestCycles[0] || null,
                    currentPhaseIndex: 0,
                    isLoading: false,
                    isGuestMode: true,
                    userId: null
                });
            },

            startSyncCycles: (uid) => {
                const { unsubscribe } = get();
                if (unsubscribe) unsubscribe();

                set({ isLoading: true, isGuestMode: false, userId: uid });

                const q = query(collection(db, "users", uid, "cycles"), orderBy("createdAt", "desc"));
                const newUnsubscribe = onSnapshot(q, (snapshot) => {
                    if (snapshot.empty) {
                        console.log("User has no cycles, creating a default one.");
                        const defaultTemplate = OFFICIAL_TEMPLATES.find(t => t.id === 'template-pomodoro');
                        if (defaultTemplate) {
                            const newCycleData = { ...defaultTemplate, createdAt: serverTimestamp() };
                            delete (newCycleData as any).id;
                            delete (newCycleData as any).isTemplate;
                            addDoc(collection(db, "users", uid, "cycles"), newCycleData);
                        }
                    } else {
                        const cycles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cycle));
                        const currentCycleId = get().currentCycle?.id;
                        const newCurrentCycle = cycles.find(c => c.id === currentCycleId) || cycles[0];
                        set({ cycles, isLoading: false, currentCycle: newCurrentCycle });
                    }
                }, (error) => {
                    console.error("Error syncing cycles:", error);
                    set({ isLoading: false });
                });

                set({ unsubscribe: newUnsubscribe });
            },

            stopSyncCycles: () => {
                get().unsubscribe?.();
                set({ unsubscribe: null, userId: null });
                get().loadGuestData();
            },

            setCurrentCycle: (cycleId) => {
                const cycle = get().cycles.find((c) => c.id === cycleId) || null;
                set({ currentCycle: cycle, currentPhaseIndex: 0 });

                // Proactively update the timer store
                const firstPhase = cycle?.phases[0];
                if (firstPhase) {
                    useTimerStore.getState().send({ 
                        type: 'UPDATE_DURATION', 
                        duration: firstPhase.duration * 60 
                    });
                }
            },

            setCurrentPhaseIndex: (index) => {
                set({ currentPhaseIndex: index });

                // Proactively update the timer store
                const { currentCycle } = get();
                const newPhase = currentCycle?.phases[index];
                if (newPhase) {
                    useTimerStore.getState().send({
                        type: 'UPDATE_DURATION',
                        duration: newPhase.duration * 60
                    });
                }
            },

            goToNextPhase: () => {
                set(state => {
                    if (!state.currentCycle) return {};
                    const isLastPhase = state.currentPhaseIndex >= state.currentCycle.phases.length - 1;
                    const nextIndex = isLastPhase ? 0 : state.currentPhaseIndex + 1;

                    // Proactively update the timer store
                    const nextPhase = state.currentCycle.phases[nextIndex];
                    if (nextPhase) {
                        useTimerStore.getState().send({ 
                            type: 'UPDATE_DURATION', 
                            duration: nextPhase.duration * 60 
                        });
                    }
                    
                    return { currentPhaseIndex: nextIndex };
                });
            },

            createNewCycle: async () => {
                const { userId, isGuestMode } = get();
                const newCycle: Omit<Cycle, 'id' | 'createdAt'> = {
                    name: "My New Cycle",
                    isTemplate: false,
                    phases: [{ ...DEFAULT_PHASE, id: uuidv4() }],
                };

                if (isGuestMode || !userId) {
                    const localCycle: Cycle = { ...newCycle, id: `guest-${uuidv4()}`, createdAt: new Date() };
                    set(state => ({ cycles: [...state.cycles, localCycle], currentCycle: localCycle }));
                    return;
                }

                await addDoc(collection(db, "users", userId, "cycles"), {
                    ...newCycle,
                    createdAt: serverTimestamp(),
                });
            },

            saveCurrentCycle: async () => {
                const { userId, isGuestMode, currentCycle } = get();
                if (isGuestMode || !userId || !currentCycle || currentCycle.isTemplate) return;

                const { id, ...cycleData } = currentCycle;
                const cycleRef = doc(db, "users", userId, "cycles", id);
                await setDoc(cycleRef, { ...cycleData, updatedAt: serverTimestamp() }, { merge: true });
            },

            deleteCycle: async (cycleId) => {
                const { userId, isGuestMode, cycles, currentCycle } = get();
                if (isGuestMode || !userId) return;

                const cycleToDelete = cycles.find(c => c.id === cycleId);
                if (cycleToDelete?.isTemplate) return;

                if (currentCycle?.id === cycleId) {
                    const newCurrentCycle = cycles.find(c => c.id !== cycleId && !c.isTemplate) || OFFICIAL_TEMPLATES[0];
                    set({ currentCycle: newCurrentCycle, currentPhaseIndex: 0 });
                }

                await deleteDoc(doc(db, "users", userId, "cycles", cycleId));
            },

            addPhase: () => {
                set(state => {
                    if (!state.currentCycle || state.currentCycle.isTemplate) return {};
                    const newPhase: Phase = { ...DEFAULT_PHASE, id: uuidv4() };
                    const updatedPhases = [...state.currentCycle.phases, newPhase];
                    const updatedCycle = { ...state.currentCycle, phases: updatedPhases };
                    return {
                        currentCycle: updatedCycle,
                        cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
                    };
                });
            },

            updatePhase: (phaseId, updates) => {
                set(state => {
                    if (!state.currentCycle || state.currentCycle.isTemplate) return {};
                    const updatedPhases = state.currentCycle.phases.map(p => p.id === phaseId ? { ...p, ...updates } : p);
                    const updatedCycle = { ...state.currentCycle, phases: updatedPhases };
                    return {
                        currentCycle: updatedCycle,
                        cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
                    };
                });
            },

            deletePhase: (phaseId) => {
                set(state => {
                    if (!state.currentCycle || state.currentCycle.isTemplate) return {};
                    const updatedPhases = state.currentCycle.phases.filter(p => p.id !== phaseId);
                    const updatedCycle = { ...state.currentCycle, phases: updatedPhases };
                    return {
                        currentCycle: updatedCycle,
                        cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
                    };
                });
            },

            toggleSounds: () => set(state => ({ playSounds: !state.playSounds }))
        }),
        {
            name: 'cycle-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isLoading = true;
                    // Ensure playSounds has a default value on rehydration
                    state.playSounds = state.playSounds ?? true;
                }
            },
             // Only persist a subset of the state
            partialize: (state) => ({
                currentCycleId: state.currentCycle?.id,
                currentPhaseIndex: state.currentPhaseIndex,
                userId: state.userId,
                isGuestMode: state.isGuestMode,
                playSounds: state.playSounds,
            }),
        }
    )
);
