import { create } from 'zustand';
import { db } from "@/lib/firebase";
import { 
  collection, query, onSnapshot, doc, setDoc, addDoc, deleteDoc 
} from "firebase/firestore";
import { Cycle, Phase, AudioAsset } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

interface CycleState {
  // Dữ liệu
  privateCycles: Cycle[];
  currentCycle: Cycle | null;
  currentPhaseIndex: number;
  isLoading: boolean;
  
  // Firebase Sync Logic
  syncUnsubscribe: (() => void) | null;
  
  // Actions - Sync
  startSyncCycles: (userId: string) => void;
  stopSyncCycles: () => void;
  
  // Actions - UI/Logic
  setCurrentCycle: (cycle: Cycle) => void;
  setCurrentPhaseIndex: (index: number) => void;
  updatePhase: (phaseId: string, updates: Partial<Phase>) => Promise<void>;
  addPhase: (newPhaseData: Partial<Phase>) => Promise<void>;
  deletePhase: (phaseId: string) => Promise<void>;
}

export const useCycleStore = create<CycleState>((set, get) => ({
  privateCycles: [],
  currentCycle: null,
  currentPhaseIndex: 0,
  isLoading: false,
  syncUnsubscribe: null,

  // --- HÀM QUAN TRỌNG: ĐỒNG BỘ FIREBASE ---
  startSyncCycles: (userId: string) => {
    // Nếu đang có sync cũ thì dừng lại để tránh rò rỉ bộ nhớ
    get().stopSyncCycles();

    set({ isLoading: true });

    const q = query(collection(db, `users/${userId}/privateCycles`));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cycles = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Cycle));

      set({ 
        privateCycles: cycles, 
        isLoading: false,
        // Nếu chưa có currentCycle hoặc cycle hiện tại vừa bị xóa, lấy cái đầu tiên
        currentCycle: get().currentCycle && cycles.some(c => c.id === get().currentCycle?.id)
          ? get().currentCycle
          : cycles[0] || null
      });
    }, (error) => {
      console.error("Firestore Sync Error:", error);
      set({ isLoading: false });
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

  // --- ACTIONS CHỈNH SỬA (Kết hợp Local & Remote) ---
  setCurrentCycle: (cycle) => set({ currentCycle: cycle, currentPhaseIndex: 0 }),
  
  setCurrentPhaseIndex: (index) => set({ currentPhaseIndex: index }),

  updatePhase: async (phaseId, updates) => {
    const { currentCycle } = get();
    if (!currentCycle) return;

    const newPhases = currentCycle.phases.map(p => 
      p.id === phaseId ? { ...p, ...updates } : p
    );
    const updatedCycle = { ...currentCycle, phases: newPhases };

    // Update Local UI trước để mượt (Optimistic Update)
    set({ currentCycle: updatedCycle });

    // Sau đó update lên Firebase (nếu không phải template)
    if (!currentCycle.id.startsWith('cycle_template_')) {
        const cycleRef = doc(db, `users/${currentCycle.authorId}/privateCycles`, currentCycle.id);
        await setDoc(cycleRef, updatedCycle, { merge: true });
    }
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

    const updatedCycle = { ...currentCycle, phases: [...currentCycle.phases, newPhase] };
    
    set({ currentCycle: updatedCycle });
    
    if (!currentCycle.id.startsWith('cycle_template_')) {
        const cycleRef = doc(db, `users/${currentCycle.authorId}/privateCycles`, currentCycle.id);
        await setDoc(cycleRef, updatedCycle);
    }
  }
}));
