"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { useAuth } from "./auth-context";
import { Cycle, Phase, AudioAsset } from "@/lib/types";
import { getCycles, updateCycle, deleteCycle } from "@/dal"; // Loại bỏ createCycle, cloneCycleDAL
import defaultData from "@/lib/mock-data";
import { v4 as uuidv4 } from "uuid";

const { mockCycles, mockAudioLibrary = [] } = defaultData;

interface CycleContextType {
  officialTemplates: Cycle[];
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
  // Loại bỏ createCycle
  updateCycle: (cycleId: string, updatedData: Partial<Cycle>) => Promise<void>;
  deleteCycle: (cycleId: string) => Promise<void>;
  updatePhase: (cycleId: string, phaseId: string, updates: Partial<Phase>) => Promise<void>;
  addPhase: (cycleId: string, newPhase: Partial<Phase>) => Promise<void>;
  deletePhase: (cycleId: string, phaseId: string) => Promise<void>;
  saveCycleChanges: (cycleId: string) => Promise<void>;
  cloneCycle: (cycleId: string) => Promise<void>; // Giữ clone, nhưng từ state
  audioLibrary: AudioAsset[];
  endOfCycleSound: AudioAsset | null;
  setEndOfCycleSound: (sound: AudioAsset | null) => void;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export function useCycle() {
  const context = useContext(CycleContext);
  if (!context) throw new Error("useCycle must be used within CycleProvider");
  return context;
}

export function CycleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [officialTemplates, setOfficialTemplates] = useState<Cycle[]>(mockCycles);
  const [allCycles, setAllCycles] = useState<Cycle[]>(mockCycles);
  const [privateCycles, setPrivateCycles] = useState<Cycle[]>([]);
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [endOfCycleSound, setEndOfCycleSound] = useState<AudioAsset | null>(
    mockAudioLibrary.length > 0 ? mockAudioLibrary[0] : null
  );

  const isCloningRef = useRef(false); // Flag để ngăn loop

  useEffect(() => {
    const loadCycles = async () => {
      if (isCloningRef.current) return; // Skip nếu đang clone
      try {
        const cycles = (await getCycles(user?.uid)) || [];
        let privateCyclesData: Cycle[] = [];

        if (user) {
          privateCyclesData = cycles.filter((c) => c.authorId === user.uid && !c.isPublic);
        }

        setPrivateCycles(privateCyclesData);
        setAllCycles([
          ...mockCycles,
          ...cycles.filter((c) => c.isPublic || c.authorId === user?.uid),
        ]);
      } catch (error) {
        console.error("Failed to load cycles", error);
        setAllCycles(mockCycles);
        setPrivateCycles([]);
      }
    };
    loadCycles();
  }, [user]);

  useEffect(() => {
    if (allCycles?.length > 0 && !currentCycle) {
      setCurrentCycle(allCycles[0]);
    }
  }, [allCycles, currentCycle]);

  const requireAuth = (action: string) => {
    if (!user) {
      throw new Error(`Please log in to ${action} cycles`);
    }
  };

  const updateCycle = async (cycleId: string, updatedData: Partial<Cycle>) => {
    requireAuth("update");
    try {
      await updateCycle(cycleId, updatedData, user.uid);
      setAllCycles((prev) =>
        prev.map((c) => (c.id === cycleId ? { ...c, ...updatedData } : c))
      );
      setPrivateCycles((prev) =>
        prev.map((c) => (c.id === cycleId ? { ...c, ...updatedData } : c))
      );
      if (currentCycle?.id === cycleId) {
        setCurrentCycle({ ...currentCycle, ...updatedData });
      }
    } catch (error) {
      console.error("Failed to update cycle", error);
      throw error;
    }
  };

  const deleteCycle = async (cycleId: string) => {
    requireAuth("delete");
    try {
      await deleteCycle(cycleId, user.uid);
      setAllCycles((prev) => prev.filter((c) => c.id !== cycleId));
      setPrivateCycles((prev) => prev.filter((c) => c.id !== cycleId));
      if (currentCycle?.id === cycleId) {
        setCurrentCycle(allCycles[0] || null);
      }
    } catch (error) {
      console.error("Failed to delete cycle", error);
      throw error;
    }
  };

  const updatePhase = async (cycleId: string, phaseId: string, updates: Partial<Phase>) => {
    requireAuth("update");
    try {
      const cycle = allCycles.find((c) => c.id === cycleId);
      if (!cycle) throw new Error("Cycle not found");

      const updatedPhases = cycle.phases.map((phase) =>
        phase.id === phaseId ? { ...phase, ...updates } : phase
      );
      await updateCycle(cycleId, { phases: updatedPhases });
    } catch (error) {
      console.error("Failed to update phase", error);
      throw error;
    }
  };

  const addPhase = async (cycleId: string, newPhase: Partial<Phase>) => {
    requireAuth("add phases to");
    try {
      const cycle = allCycles.find((c) => c.id === cycleId);
      if (!cycle) throw new Error("Cycle not found");

      const phaseWithId = { ...newPhase, id: uuidv4() } as Phase;
      const updatedPhases = [...cycle.phases, phaseWithId];
      await updateCycle(cycleId, { phases: updatedPhases });
    } catch (error) {
      console.error("Failed to add phase", error);
      throw error;
    }
  };

  const deletePhase = async (cycleId: string, phaseId: string) => {
    requireAuth("delete phases from");
    try {
      const cycle = allCycles.find((c) => c.id === cycleId);
      if (!cycle) throw new Error("Cycle not found");

      const updatedPhases = cycle.phases.filter((phase) => phase.id !== phaseId);
      await updateCycle(cycleId, { phases: updatedPhases });
    } catch (error) {
      console.error("Failed to delete phase", error);
      throw error;
    }
  };

  const saveCycleChanges = async (cycleId: string) => {
    requireAuth("save changes to");
    try {
      const cycle = allCycles.find((c) => c.id === cycleId);
      if (!cycle) throw new Error("Cycle not found");
      await updateCycle(cycleId, cycle);
    } catch (error) {
      console.error("Failed to save cycle changes", error);
      throw error;
    }
  };

  // 🔥 SỬA CLONE CYCLE: Chỉ clone từ currentCycle trong state
  const cloneCycle = useCallback(async (cycleId: string) => {
    requireAuth("clone");
    if (isCloningRef.current || !currentCycle) {
      console.warn("Clone in progress or no current cycle");
      return;
    }
    isCloningRef.current = true;
    try {
      // Clone trực tiếp từ currentCycle (không cần Firestore)
      const newCycle: Cycle = {
        ...currentCycle,
        id: uuidv4(), // ID mới
        name: `[Copy] ${currentCycle.name}`,
        authorId: user.uid,
        authorName: user.displayName || "Unknown",
        isPublic: false,
        likes: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update state
      setAllCycles((prev) => [...prev, newCycle]);
      setPrivateCycles((prev) => [...prev, newCycle]);
      setCurrentCycle(newCycle);
      console.log("Cloned cycle from state:", newCycle.id); // Debug
    } catch (error) {
      console.error("Failed to clone cycle from state", error);
      throw error;
    } finally {
      isCloningRef.current = false;
    }
  }, [user, currentCycle]); // Dependencies: user và currentCycle

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

  const value: CycleContextType = {
    officialTemplates,
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
    updateCycle,
    deleteCycle,
    updatePhase,
    addPhase,
    deletePhase,
    saveCycleChanges,
    cloneCycle, // Giữ clone từ state
    audioLibrary: mockAudioLibrary,
    endOfCycleSound,
    setEndOfCycleSound,
  };

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>;
}