
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { Cycle, Phase, SoundFile } from '@/lib/types';
import { getAllCycles, createCycle, deleteCycle as deleteCycleDAL } from '@/dal';
import defaultData from '@/lib/mock-data';

// CORRECTED: Import individual cycles and create an array
const { pomodoroCycle, wimHofCycle, defaultCycle, mockAudioLibrary } = defaultData;
const mockCycles = [pomodoroCycle, wimHofCycle];

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
  deleteCycle: (cycleId: string) => Promise<void>;
  audioLibrary: SoundFile[];
  endOfCycleSound: SoundFile | null;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export function useCycle() {
  const context = useContext(CycleContext);
  if (!context) throw new Error('useCycle must be used within CycleProvider');
  return context;
}

export function CycleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allCycles, setAllCycles] = useState<Cycle[]>(mockCycles);
  const [privateCycles, setPrivateCycles] = useState<Cycle[]>([]);
  // SIMPLIFIED: Initialize with a default cycle
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(defaultCycle);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  useEffect(() => {
    const loadCycles = async () => {
      if (!user) {
        setAllCycles(mockCycles);
        setPrivateCycles([]);
        return;
      }
      try {
        const cycles = await getAllCycles();
        setAllCycles([...mockCycles, ...cycles]);
        setPrivateCycles(cycles.filter((c) => !c.isPublic));
      } catch (error) {
        console.error('Failed to load cycles', error);
      }
    };
    loadCycles();
  }, [user]);

  useEffect(() => {
    // When the current cycle changes, reset the phase index
    setCurrentPhaseIndex(0);
  }, [currentCycle]);


  const advancePhase = () => {
    if (!currentCycle) return 0;
    const nextIndex = currentPhaseIndex + 1 >= currentCycle.phases.length ? 0 : currentPhaseIndex + 1;
    setCurrentPhaseIndex(nextIndex);
    return nextIndex;
  };

  const resetCycle = () => {
    setCurrentPhaseIndex(0);
  };

  const deleteCycle = async (cycleId: string) => {
    try {
      await deleteCycleDAL(cycleId);
      setAllCycles((prev) => prev.filter((c) => c.id !== cycleId));
      setPrivateCycles((prev) => prev.filter((c) => c.id !== cycleId));
      if (currentCycle?.id === cycleId) {
        setCurrentCycle(allCycles[0] || null);
      }
    } catch (error) { 
      console.error('Failed to delete cycle', error);
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
    deleteCycle,
    audioLibrary: mockAudioLibrary,
    endOfCycleSound: mockAudioLibrary.length > 0 ? mockAudioLibrary[0] : null,
  };

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>;
}
