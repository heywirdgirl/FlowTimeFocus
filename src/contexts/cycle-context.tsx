// src/contexts/cycle-context.tsx - FIXED VERSION (Oct 21, 2025)
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./auth-context";
import { Cycle, Phase, SoundFile } from "@/lib/types";
import { getCycles, createCycle, deleteCycle } from "@/dal";
import defaultData from "@/lib/mock-data";

const { mockCycles, mockAudioLibrary = [] } = defaultData;

interface CycleContextType {
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
  const [allCycles, setAllCycles] = useState<Cycle[]>(mockCycles); // Use mockCycles array
  const [privateCycles, setPrivateCycles] = useState<Cycle[]>([]);
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  useEffect(() => {
    const loadCycles = async () => {
      try {
        const cycles = await getCycles(user?.uid) || [];
        const privateCyclesData = user ? cycles.filter(c => c.userId === user.uid && !c.isPublic) : [];
        setAllCycles([...mockCycles, ...cycles.filter(c => c.isPublic || c.userId === user?.uid)]);
        setPrivateCycles(privateCyclesData);
      } catch (error) {
        console.error("Failed to load cycles", error);
        setAllCycles(mockCycles); // Fallback to mock data
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