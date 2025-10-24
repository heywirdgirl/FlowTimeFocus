// src/contexts/cycle-context.tsx - FIXED VERSION (Oct 21, 2025)
"use client";

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { useAuth } from "./auth-context";
import { Cycle, Phase, SoundFile } from "@/lib/types";
import { getCycles, createCycle, deleteCycle } from "@/dal";
import defaultData from "@/lib/mock-data";

const { mockCycles, mockAudioLibrary = [] } = defaultData;

interface CycleContextType {
  officialTemplates: Cycle[]; // <-- THÊM DÒNG NÀY
  allCycles: Cycle[];
  privateCycles: Cycle[];
  currentCycle: Cycle | null;
  currentPhase: Phase | null;
  currentPhaseIndex: number;
  setCurrentCycle: (cycle: Cycle) => void;
  setCurrentPhaseIndex: (index: number) => void;
  advancePhase: () => number;
  resetCycle: () => void;
  logTraining: (data: any) => void;
  deleteCycle: (cycleId: string) => Promise<void>;
  audioLibrary: SoundFile[];
  endOfCycleSound: SoundFile | null;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export function useCycle() {
  const context = useContext(CycleContext);
  if (!context) throw new Error("useCycle must be used within CycleProvider");
  return context;
}

export function CycleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // State cho template chính thức (luôn là mock data)
  const [officialTemplates, setOfficialTemplates] = useState<Cycle[]>(mockCycles);
  
  // State cho TẤT CẢ cycles (mock + DB)
  const [allCycles, setAllCycles] = useState<Cycle[]>(mockCycles);
  
  // State cho private cycles (CHỈ CỦA USER TỪ DB)
  const [privateCycles, setPrivateCycles] = useState<Cycle[]>([]); // <-- Giữ nguyên là mảng rỗng
  
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  useEffect(() => {
    const loadCycles = async () => {
      try {
        // Tải cycles từ DB (chỉ chạy khi user thay đổi)
        const cycles = (await getCycles(user?.uid)) || [];
        
        let privateCyclesData: Cycle[] = [];

        if (user) {
          // Nếu có user, lọc ra các cycle riêng tư
          privateCyclesData = cycles.filter(
            (c) => c.userId === user.uid && !c.isPublic
          );
        }
        
        // Cập nhật privateCycles (sẽ là [] nếu không có user, hoặc data thật nếu có user)
        setPrivateCycles(privateCyclesData);
        
        // Cập nhật allCycles (bao gồm mock, public từ DB, và private của user)
        setAllCycles([
          ...mockCycles,
          ...cycles.filter((c) => c.isPublic || c.userId === user?.uid),
        ]);

      } catch (error) {
        console.error("Failed to load cycles", error);
        // Lỗi thì fallback về mock và rỗng
        setAllCycles(mockCycles);
        setPrivateCycles([]);
      }
    };
    loadCycles();
  }, [user]); // Logic này đã đúng, nó sẽ tải lại khi user đăng nhập/đăng xuất

  useEffect(() => {
    // Đặt cycle mặc định khi tải trang
    if (allCycles?.length > 0 && !currentCycle) {
      setCurrentCycle(allCycles[0]);
    }
  }, [allCycles, currentCycle]);

  // ... (Toàn bộ phần code còn lại của file giữ nguyên) ...

  const advancePhase = () => {
    if (!currentCycle) return 0;
    const nextIndex = currentPhaseIndex + 1 >= currentCycle.phases.length ? 0 : currentPhaseIndex + 1;
    setCurrentPhaseIndex(nextIndex);
    return nextIndex;
  };

  const resetCycle = () => {
    setCurrentPhaseIndex(0);
  };

  const logTraining = async (data: any) => {
    // Placeholder
  };

  const deleteCycle = async (cycleId: string) => {
    try {
      await deleteCycle(cycleId, user?.uid);
      setAllCycles(prev => prev.filter(c => c.id !== cycleId));
      setPrivateCycles(prev => prev.filter(c => c.id !== cycleId));
      if (currentCycle?.id === cycleId) {
        setCurrentCycle(allCycles[0] || null);
      }
    } catch (error) {
      console.error("Failed to delete cycle", error);
    }
  };

  const value: CycleContextType = {
    officialTemplates, // <-- THÊM DÒNG NÀY
    allCycles,
    privateCycles,
    currentCycle,
    currentPhase: currentCycle?.phases[currentPhaseIndex] || null,
    currentPhaseIndex,
    setCurrentCycle,
    setCurrentPhaseIndex,
    advancePhase,
    resetCycle,
    logTraining,
    deleteCycle,
    audioLibrary: mockAudioLibrary,
    endOfCycleSound: mockAudioLibrary.length > 0 ? mockAudioLibrary[0] : null,
  };

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>;
}
