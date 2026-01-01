
import { create } from 'zustand';
import { db } from "@/lib/firebase";
import { 
  collection, query, onSnapshot, doc, setDoc, addDoc, deleteDoc 
} from "firebase/firestore";
import { Cycle, Phase, AudioAsset, SessionPhaseRecord } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

// A default cycle to prevent the app from crashing if no cycles are loaded
const defaultCycle: Cycle = {
    id: 'default_cycle_id',
    name: 'Default',
    phases: [{ id: 'default_phase', title: 'Focus', duration: 25, removable: false }],
    authorId: 'system',
    isPublic: true,
};

interface CycleState {
  // Data
  privateCycles: Cycle[];
  currentCycle: Cycle | null;
  currentPhaseIndex: number;
  isLoading: boolean;
  
  // New state for progress tracking
  cyclesCompleted: number;
  sessionPhaseRecords: SessionPhaseRecord[];
  
  // Settings (inferred from timer-display)
  playSounds: boolean;
  audioLibrary: AudioAsset[];

  // Firebase Sync Logic
  syncUnsubscribe: (() => void) | null;
  
  // Actions - Sync
  startSyncCycles: (userId: string) => void;
  stopSyncCycles: () => void;
  
  // Actions - UI/Logic
  setCurrentCycle: (cycle: Cycle) => void;
  setCurrentPhaseIndex: (index: number) => void;
  advancePhase: (skipped?: boolean) => void;
  
  // Actions - CRUD
  updateCycle: (updates: Partial<Cycle>) => void; // Added for editing cycle name
  updatePhase: (phaseId: string, updates: Partial<Phase>) => Promise<void>;
  addPhase: (newPhaseData: Partial<Phase>) => Promise<void>;
  deletePhase: (phaseId: string) => Promise<void>;
  deleteCycle: (cycleId: string) => Promise<void>;
  saveCycleChanges: () => Promise<void>;
  createNewCycle: () => void;
}

export const useCycleStore = create<CycleState>((set, get) => ({
  // Initial State
  privateCycles: [],
  currentCycle: null,
  currentPhaseIndex: 0,
  isLoading: true, // Start with loading true
  cyclesCompleted: 0,
  sessionPhaseRecords: [],
  playSounds: true, // Default value
  audioLibrary: [], // Default value
  syncUnsubscribe: null,

  // --- SYNC ---
  startSyncCycles: (userId: string) => {
    get().stopSyncCycles();
    set({ isLoading: true });

    const q = query(collection(db, `users/${userId}/privateCycles`));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cycles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cycle));
      const currentCycleId = get().currentCycle?.id;
      const currentCycleExists = cycles.some(c => c.id === currentCycleId);

      let newCurrentCycle = get().currentCycle;
      if (!currentCycleExists) {
          newCurrentCycle = cycles[0] || defaultCycle;
      }

      set({ 
        privateCycles: cycles, 
        isLoading: false,
        currentCycle: newCurrentCycle
      });

    }, (error) => {
      console.error("Firestore Sync Error:", error);
      set({ isLoading: false, currentCycle: defaultCycle }); // Fallback to default
    });

    set({ syncUnsubscribe: unsubscribe });
  },

  stopSyncCycles: () => {
    const { syncUnsubscribe } = get();
    if (syncUnsubscribe) {
      syncUnsubscribe();
      set({ syncUnsubscribe: null });
    }
  },

  // --- UI/LOGIC ACTIONS ---
  setCurrentCycle: (cycle) => set({ 
      currentCycle: cycle, 
      currentPhaseIndex: 0, 
      cyclesCompleted: 0, 
      sessionPhaseRecords: [] 
  }),
  
  setCurrentPhaseIndex: (index) => set({ currentPhaseIndex: index }),

  advancePhase: (skipped = false) => {
    const { currentCycle, currentPhaseIndex, cyclesCompleted, sessionPhaseRecords } = get();
    if (!currentCycle) return;

    const newRecords = [
        ...sessionPhaseRecords,
        {
            phaseId: currentCycle.phases[currentPhaseIndex].id,
            completionStatus: skipped ? 'skipped' : 'completed'
        } as SessionPhaseRecord
    ];

    let nextPhaseIndex = currentPhaseIndex + 1;
    let newCyclesCompleted = cyclesCompleted;

    if (nextPhaseIndex >= currentCycle.phases.length) {
        nextPhaseIndex = 0;
        newCyclesCompleted += 1;
        set({
            cyclesCompleted: newCyclesCompleted,
            currentPhaseIndex: nextPhaseIndex,
            sessionPhaseRecords: [] // Clear records for new cycle
        });
    } else {
        set({
            currentPhaseIndex: nextPhaseIndex,
            sessionPhaseRecords: newRecords
        });
    }
  },

  // --- CRUD ACTIONS ---
  updateCycle: (updates) => {
      const { currentCycle } = get();
      if (!currentCycle) return;
      
      const updatedCycle = { ...currentCycle, ...updates };
      set({ currentCycle: updatedCycle });
  },

  updatePhase: async (phaseId, updates) => {
    const { currentCycle } = get();
    if (!currentCycle) return;

    const newPhases = currentCycle.phases.map(p => 
      p.id === phaseId ? { ...p, ...updates } : p
    );
    get().updateCycle({ phases: newPhases });
  },

  addPhase: async (newPhaseData) => {
    const { currentCycle } = get();
    if (!currentCycle) return;

    const newPhase: Phase = {
        id: `phase_${Math.random().toString(36).substr(2, 9)}`,
        title: newPhaseData.title || "New Phase",
        duration: newPhaseData.duration || 5,
        soundFile: null,
        removable: true,
        ...newPhaseData,
    };
    
    get().updateCycle({ phases: [...currentCycle.phases, newPhase] });
  },
  
  deletePhase: async (phaseId: string) => {
    const { currentCycle } = get();
    if (!currentCycle) return;
    const newPhases = currentCycle.phases.filter(p => p.id !== phaseId);
    get().updateCycle({ phases: newPhases });
  },

  saveCycleChanges: async () => {
    const { currentCycle } = get();
    if (!currentCycle || !currentCycle.authorId || currentCycle.id.startsWith('cycle_template_')) return;

    try {
        const cycleRef = doc(db, `users/${currentCycle.authorId}/privateCycles`, currentCycle.id);
        await setDoc(cycleRef, currentCycle, { merge: true });
        toast({ title: "Success", description: "Cycle saved successfully."});
    } catch (error) {
        console.error("Error saving cycle:", error);
        toast({ title: "Error", description: "Could not save changes."});
    }
  },

  createNewCycle: () => {
    const { privateCycles } = get();
    const newCycle: Cycle = {
        id: `cycle_${Date.now()}`,
        name: "New Custom Cycle",
        phases: [{ id: 'new_phase_1', title: "Focus", duration: 25, removable: true }],
        authorId: useCycleStore.getState().privateCycles[0]?.authorId || 'unknown_user',
        isPublic: false,
    };
    set({
        privateCycles: [...privateCycles, newCycle],
        currentCycle: newCycle,
        currentPhaseIndex: 0,
        cyclesCompleted: 0,
        sessionPhaseRecords: []
    });
    toast({title: "New Cycle Created", description: "Edit the details and save your changes."});
  },

  deleteCycle: async (cycleId: string) => {
    const { privateCycles, currentCycle } = get();
    const cycleToDelete = privateCycles.find(c => c.id === cycleId);
    if (!cycleToDelete || !cycleToDelete.authorId) return;

    const newCycles = privateCycles.filter(c => c.id !== cycleId);
    
    if (currentCycle && currentCycle.id === cycleId) {
        get().setCurrentCycle(newCycles[0] || defaultCycle);
    }
    set({ privateCycles: newCycles });

    try {
        await deleteDoc(doc(db, `users/${cycleToDelete.authorId}/privateCycles`, cycleId));
        toast({ title: "Cycle Deleted" });
    } catch (error) {
        set({ privateCycles, currentCycle }); 
        toast({ title: "Error", description: "Could not delete cycle." });
    }
  }
}));
