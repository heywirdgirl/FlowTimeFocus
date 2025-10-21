"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { Cycle, Phase, SoundFile } from "@/lib/types";
import { getCycles, createCycle, deleteCycle } from "@/dal";
import defaultData from "@/lib/mock-data";

const { mockCycles, audioLibrary } = defaultData;

interface CycleContextType {
  allCycles: Cycle[];
  privateCycles: Cycle[];
  currentCycle: Cycle | null;
  currentPhase: Phase | null;
  currentPhaseIndex: number;
  setCurrentCycle: (cycle: Cycle) => void;
  setCurrentPhaseIndex: (index: number) => void; // 🔥 FIX 1: ADD THIS!
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
  const [allCycles, setAllCycles] = useState<Cycle[]>(mockCycles);
  const [privateCycles, setPrivateCycles] = useState<Cycle[]>([]);
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  // Load cycles
  useEffect(() => {
    const loadCycles = async () => {
      if (!user) {
        setAllCycles(mockCycles);
        setPrivateCycles([]);
        return;
      }
      try {
        const cycles = await getCycles();
        setAllCycles([...mockCycles, ...cycles]);
        setPrivateCycles(cycles.filter(c => !c.isPublic));
      } catch (error) {
        console.error("Failed to load cycles", error);
      }
    };
    loadCycles();
  }, [user]);

  // Set initial cycle
  useEffect(() => {
    if (allCycles.length > 0 && !currentCycle) {
      setCurrentCycle(allCycles[0]);
    }
  }, [allCycles]);

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
    // Placeholder for logging to history (handled by history-context)
  };

  const deleteCycle = async (cycleId: string) => {
    try {
      await deleteCycle(cycleId);
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
    allCycles,
    privateCycles,
    currentCycle,
    currentPhase: currentCycle?.phases[currentPhaseIndex] || null,
    currentPhaseIndex,
    setCurrentCycle,
    setCurrentPhaseIndex, // 🔥 FIX 2: EXPORT THIS!
    advancePhase,
    resetCycle,
    logTraining,
    deleteCycle,
    audioLibrary,
    endOfCycleSound: audioLibrary[0] || null,
  };

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>;
}