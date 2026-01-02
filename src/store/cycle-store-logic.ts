
import { doc, onSnapshot, setDoc, deleteDoc, collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from 'uuid';
import { GUEST_CYCLE, DEFAULT_PHASE } from './cycle-templates';
import type { Cycle, Phase } from '@/lib/types';
import type { CycleState, CycleStore } from './useCycleStore';

// This function creates the actions for the cycle store.
// It's separated from the state definition to improve modularity.
export const createCycleActions = (set: (fn: (state: CycleState) => CycleState) => void, get: () => CycleState): CycleStore => ({
    loadGuestData: () => {
        // Deep copy guest cycle to prevent mutation of the template
        const newGuestCycle = JSON.parse(JSON.stringify(GUEST_CYCLE));
        newGuestCycle.createdAt = new Date();

        set(state => ({
            ...state,
            cycles: [newGuestCycle],
            currentCycle: newGuestCycle,
            currentPhaseIndex: 0,
            isLoading: false,
            isGuestMode: true,
            userId: null
        }));
    },

    startSyncCycles: (uid) => {
        const { unsubscribe } = get();
        if (unsubscribe) unsubscribe();

        set(state => ({ ...state, isLoading: true, isGuestMode: false, userId: uid }));

        const q = query(collection(db, "users", uid, "cycles"), orderBy("createdAt", "desc"));
        const newUnsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                console.log("User has no cycles, creating a default one.");
                const newCycleData = { ...GUEST_CYCLE, id: undefined, createdAt: serverTimestamp() };
                delete (newCycleData as any).isTemplate;
                newCycleData.phases.forEach(p => delete (p as any).id);
                addDoc(collection(db, "users", uid, "cycles"), newCycleData);
            } else {
                const cycles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cycle));
                const currentCycleId = get().currentCycle?.id;
                const newCurrentCycle = cycles.find(c => c.id === currentCycleId) || cycles[0];
                set(state => ({ ...state, cycles, isLoading: false, currentCycle: newCurrentCycle }));
            }
        }, (error) => {
            console.error("Error syncing cycles:", error);
            set(state => ({ ...state, isLoading: false }));
        });

        set(state => ({ ...state, unsubscribe: newUnsubscribe }));
    },

    stopSyncCycles: () => {
        get().unsubscribe?.();
        set(state => ({ ...state, unsubscribe: null, userId: null }));
        get().loadGuestData(); // Reload guest data after unsubscribing
    },

    setCurrentCycle: (cycleId) => {
        const cycle = get().cycles.find((c) => c.id === cycleId) || null;
        set(state => ({ ...state, currentCycle: cycle, currentPhaseIndex: 0 }));
    },

    setCurrentPhaseIndex: (index) => set(state => ({ ...state, currentPhaseIndex: index })),

    goToNextPhase: () => {
        set(state => {
            if (!state.currentCycle) return state;
            const isLastPhase = state.currentPhaseIndex >= state.currentCycle.phases.length - 1;
            return { ...state, currentPhaseIndex: isLastPhase ? 0 : state.currentPhaseIndex + 1 };
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

        // If deleting the current cycle, switch to another one
        if (currentCycle?.id === cycleId) {
            const newCurrentCycle = cycles.find(c => c.id !== cycleId) || null;
            set(state => ({ ...state, currentCycle: newCurrentCycle, currentPhaseIndex: 0 }));
        }

        await deleteDoc(doc(db, "users", userId, "cycles", cycleId));
    },

    addPhase: () => {
        set(state => {
            if (!state.currentCycle || state.currentCycle.isTemplate) return state;
            const newPhase: Phase = { ...DEFAULT_PHASE, id: uuidv4() };
            const updatedPhases = [...state.currentCycle.phases, newPhase];
            const updatedCycle = { ...state.currentCycle, phases: updatedPhases };
            return {
                ...state,
                currentCycle: updatedCycle,
                cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
            };
        });
    },

    updatePhase: (phaseId, updates) => {
        set(state => {
            if (!state.currentCycle || state.currentCycle.isTemplate) return state;
            const updatedPhases = state.currentCycle.phases.map(p => p.id === phaseId ? { ...p, ...updates } : p);
            const updatedCycle = { ...state.currentCycle, phases: updatedPhases };
            return {
                ...state,
                currentCycle: updatedCycle,
                cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
            };
        });
    },

    deletePhase: (phaseId) => {
        set(state => {
            if (!state.currentCycle || state.currentCycle.isTemplate) return state;
            const updatedPhases = state.currentCycle.phases.filter(p => p.id !== phaseId);
            const updatedCycle = { ...state.currentCycle, phases: updatedPhases };
            return {
                ...state,
                currentCycle: updatedCycle,
                cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
            };
        });
    },
});

