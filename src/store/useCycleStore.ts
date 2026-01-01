
import { create } from 'zustand';
import { Cycle, Phase, CompletionStatus } from '@/types/cycle';
import { doc, onSnapshot, setDoc, deleteDoc, updateDoc, collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from 'uuid';

// --- Guest Data Template ---
const GUEST_PHASES: Phase[] = [
    { id: uuidv4(), title: "Focus", duration: 25, completionStatus: 'pending' },
    { id: uuidv4(), title: "Short Break", duration: 5, completionStatus: 'pending' },
    { id: uuidv4(), title: "Focus", duration: 25, completionStatus: 'pending' },
    { id: uuidv4(), title: "Short Break", duration: 5, completionStatus: 'pending' },
    { id: uuidv4(), title: "Focus", duration: 25, completionStatus: 'pending' },
    { id: uuidv4(), title: "Short Break", duration: 5, completionStatus: 'pending' },
    { id: uuidv4(), title: "Focus", duration: 25, completionStatus: 'pending' },
    { id: uuidv4(), title: "Long Break", duration: 15, completionStatus: 'pending' },
];

const GUEST_CYCLE: Cycle = {
    id: 'guest-cycle',
    name: "Default Pomodoro",
    phases: GUEST_PHASES,
    createdAt: new Date(),
};

// --- Store Definition ---
interface CycleState {
    cycles: Cycle[];
    currentCycle: Cycle | null;
    currentPhaseIndex: number;
    isLoading: boolean;
    isGuestMode: boolean;
    userId: string | null;
    unsubscribe: (() => void) | null;

    loadGuestData: () => void;
    startSyncCycles: (uid: string) => void;
    stopSyncCycles: () => void;
    setCurrentCycle: (cycleId: string) => void;
    setCurrentPhaseIndex: (index: number) => void;
    goToNextPhase: () => void;

    // Cycle and Phase Manipulation
    createNewCycle: () => void;
    updateCycle: (updates: Partial<Omit<Cycle, 'id' | 'phases'>>) => void;
    saveCycleChanges: () => Promise<void>;
    deleteCycle: (cycleId: string) => Promise<void>;
    addPhase: (newPhase: Partial<Phase>) => void;
    updatePhase: (phaseId: string, updates: Partial<Phase>) => void;
    deletePhase: (phaseId: string) => void;
}

export const useCycleStore = create<CycleState>((set, get) => ({
    // Initial State
    cycles: [],
    currentCycle: null,
    currentPhaseIndex: 0,
    isLoading: true,
    isGuestMode: true,
    userId: null,
    unsubscribe: null,

    loadGuestData: () => {
        const newGuestCycle = { ...GUEST_CYCLE, phases: GUEST_CYCLE.phases.map(p => ({...p})) };
        set({
            cycles: [newGuestCycle],
            currentCycle: newGuestCycle,
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
            const cycles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cycle));
            if (cycles.length === 0) {
                 console.log("User has no cycles, creating a default one.");
                 const defaultCycle = { ...GUEST_CYCLE, id: undefined, createdAt: serverTimestamp() };
                 addDoc(collection(db, "users", uid, "cycles"), defaultCycle);
            } else {
                set({
                    cycles,
                    isLoading: false,
                    currentCycle: get().currentCycle ? cycles.find(c => c.id === get().currentCycle!.id) || cycles[0] : cycles[0],
                    currentPhaseIndex: 0,
                });
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
    },
    
    setCurrentPhaseIndex: (index) => set({ currentPhaseIndex: index }),

    goToNextPhase: () => {
        set(state => {
            if (!state.currentCycle) return {};
            const isLastPhase = state.currentPhaseIndex >= state.currentCycle.phases.length - 1;
            return { currentPhaseIndex: isLastPhase ? 0 : state.currentPhaseIndex + 1 };
        });
    },

    createNewCycle: () => {
        const newCycle: Cycle = {
            id: `guest-${Date.now()}`,
            name: "New Custom Cycle",
            phases: [{ id: uuidv4(), title: "Focus", duration: 25, completionStatus: 'pending' }],
            createdAt: new Date(),
        };
        set(state => ({ 
            cycles: [...state.cycles, newCycle],
            currentCycle: newCycle, 
            currentPhaseIndex: 0,
        }));
    },

    updateCycle: (updates) => {
        set(state => {
            if (!state.currentCycle) return {};
            const updatedCycle = { ...state.currentCycle, ...updates };
            return {
                currentCycle: updatedCycle,
                cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
            };
        });
    },

    saveCycleChanges: async () => {
        const { userId, isGuestMode, currentCycle } = get();
        if (isGuestMode || !userId || !currentCycle) return;
        
        const cycleRef = doc(db, "users", userId, "cycles", currentCycle.id);
        await setDoc(cycleRef, { ...currentCycle, updatedAt: serverTimestamp() }, { merge: true });
    },

    deleteCycle: async (cycleId: string) => {
        const { userId, isGuestMode, cycles } = get();
        if (isGuestMode || !userId) return;
        await deleteDoc(doc(db, "users", userId, "cycles", cycleId));
    },

    addPhase: (newPhase) => {
        set(state => {
            if (!state.currentCycle) return {};
            const phaseToAdd: Phase = { 
                id: uuidv4(), 
                title: newPhase.title || "New Phase", 
                duration: newPhase.duration || 5, 
                completionStatus: 'pending'
            };
            const updatedPhases = [...state.currentCycle.phases, phaseToAdd];
            const updatedCycle = { ...state.currentCycle, phases: updatedPhases };
            return {
                currentCycle: updatedCycle,
                cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
            };
        });
    },

    updatePhase: (phaseId, updates) => {
        set(state => {
            if (!state.currentCycle) return {};
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
            if (!state.currentCycle) return {};
            const updatedPhases = state.currentCycle.phases.filter(p => p.id !== phaseId);
            const updatedCycle = { ...state.currentCycle, phases: updatedPhases };
            return {
                currentCycle: updatedCycle,
                cycles: state.cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c)
            };
        });
    },
}));

// Initialize for guest user
useCycleStore.getState().loadGuestData();

// Add uuid package to the project
// You will need to run `npm install uuid` and `npm install --save-dev @types/uuid`
