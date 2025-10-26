"use client";

import React, {
  createContext, useContext, useState, useEffect,
  ReactNode, useCallback
} from "react";
import { useAuth } from "./auth-context";
import { Cycle, Phase, AudioAsset } from "@/lib/types";
import {
  getCycles, updateCycle as updateCycleDAL, deleteCycle as deleteCycleDAL,
  addCycle as addCycleDAL,
  mergeGuestCyclesToFirestore
} from "@/dal/cycle-dal";
import defaultData from "@/lib/mock-data";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

const { mockAudioLibrary = [] } = defaultData;

// ... Interface definition remains the same
interface CycleContextType {
  allCycles: Cycle[];
  currentCycle: Cycle | null;
  currentPhase: Phase | null;
  currentPhaseIndex: number;
  setCurrentCycleById: (cycleId: string) => void;
  setCurrentPhaseIndex: (index: number) => void;
  advancePhase: () => number;
  resetCycle: () => void;
  updateCycle: (cycleId: string, updates: Partial<Cycle>) => Promise<void>;
  deleteCycle: (cycleId: string) => Promise<Cycle | void>;
  updatePhase: (cycleId: string, phaseId: string, updates: Partial<Phase>) => Promise<void>;
  addPhase: (cycleId: string, newPhase: Partial<Phase>) => Promise<void>;
  deletePhase: (cycleId: string, phaseId: string) => Promise<void>;
  cloneCycle: (cycleId: string) => Promise<void>;
  makeCurrentCycleEditable: () => Promise<Cycle | null>;
  audioLibrary: AudioAsset[];
  endOfCycleSound: AudioAsset | null;
  setEndOfCycleSound: (sound: AudioAsset | null) => void;
  isLoaded: boolean;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export function useCycle() {
  const context = useContext(CycleContext);
  if (!context) throw new Error("useCycle must be used within CycleProvider");
  return context;
}

export function CycleProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [allCycles, setAllCycles] = useState<Cycle[]>([]);
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [endOfCycleSound, setEndOfCycleSound] = useState<AudioAsset | null>(
    mockAudioLibrary.length > 0 ? mockAudioLibrary[0] : null
  );

  const loadCycles = useCallback(async () => {
    if (authLoading) return;
    setIsLoaded(false);
    try {
      const cycles = await getCycles(user?.uid);
      setAllCycles(cycles);
      
      // If there is no current cycle or the current one is no longer in the list, set a new one.
      if (!currentCycle || !cycles.some(c => c.id === currentCycle.id)) {
         setCurrentCycle(cycles.find(c => !c.isPublic) || cycles[0] || null);
      }

    } catch (error) {
      console.error("Failed to load cycles", error);
      toast({ title: "Error", description: "Could not load your cycles.", variant: "destructive" });
    } finally {
      setIsLoaded(true);
    }
  }, [user, authLoading, toast]); // Removed currentCycle

  useEffect(() => {
    if (user && !sessionStorage.getItem('merged')) {
      mergeGuestCyclesToFirestore(user.uid, user.displayName || 'User').finally(loadCycles);
      sessionStorage.setItem('merged', 'true');
    } else {
      loadCycles();
    }
    if (!user) {
        sessionStorage.removeItem('merged');
    }
  }, [user, loadCycles]);

  // ✨ FIX: Correctly create a private copy without the old ID.
  const createPrivateCopy = async (cycleToClone: Cycle): Promise<Cycle> => {
    const { id: originalId, ...dataToClone } = cycleToClone;

    const newCycleData: Omit<Cycle, 'id'> = {
      ...dataToClone,
      isPublic: false, // Ensure the copy is private
      authorId: user?.uid ?? 'guest',
      authorName: user?.displayName ?? 'Guest',
      name: cycleToClone.isPublic ? cycleToClone.name : `${cycleToClone.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      shares: 0,
      originalId: originalId, // Keep track of where it came from
    };

    const newCycle = await addCycleDAL(newCycleData as Cycle, user?.uid);
    
    setAllCycles(prev => [...prev, newCycle]);
    toast({
      title: cycleToClone.isPublic ? "Copied to My Cycles" : "Cycle Duplicated",
      description: `A new private copy named '${newCycle.name}' is now in your list.`,
    });
    return newCycle;
  };

  const makeCurrentCycleEditable = async (): Promise<Cycle | null> => {
    if (!currentCycle) return null;
    
    if (currentCycle.isPublic) {
      const privateCopy = await createPrivateCopy(currentCycle);
      setCurrentCycle(privateCopy);
      return privateCopy;
    }
    
    return currentCycle;
  };

  const cloneCycle = async (cycleId: string) => {
    const cycleToClone = allCycles.find(c => c.id === cycleId);
    if (!cycleToClone) return;

    const newCopy = await createPrivateCopy(cycleToClone);
    setCurrentCycle(newCopy);
  };

  const updateCycleState = (updatedCycle: Cycle) => {
    setAllCycles(prev => prev.map(c => (c.id === updatedCycle.id ? updatedCycle : c)));
    if (currentCycle?.id === updatedCycle.id) {
      setCurrentCycle(updatedCycle);
    }
  };

  const updateCycle = async (cycleId: string, updates: Partial<Cycle>) => {
    const editableCycle = await makeCurrentCycleEditable();
    if (!editableCycle || editableCycle.id !== cycleId) return;
    
    await updateCycleDAL(editableCycle.id, updates, user?.uid);
    const updatedCycle = { ...editableCycle, ...updates, updatedAt: new Date().toISOString() };
    updateCycleState(updatedCycle);
  };

  const deleteCycle = async (cycleId: string) => {
      const cycleToDelete = allCycles.find(c => c.id === cycleId);
      if (!cycleToDelete || cycleToDelete.isPublic) return;

      await deleteCycleDAL(cycleId, user?.uid);
      const remainingCycles = allCycles.filter(c => c.id !== cycleId);
      setAllCycles(remainingCycles);

      if (currentCycle?.id === cycleId) {
        const newCurrent = remainingCycles.find(c => !c.isPublic) || allCycles.find(c => c.isPublic) || null;
        setCurrentCycle(newCurrent);
      }
      toast({ title: "Cycle Deleted", description: `'${cycleToDelete.name}' has been removed.`});
  };

  const updatePhase = async (cycleId: string, phaseId: string, updates: Partial<Phase>) => {
      const editableCycle = await makeCurrentCycleEditable();
      if (!editableCycle || editableCycle.id !== cycleId) return;

      const updatedPhases = editableCycle.phases.map(p => p.id === phaseId ? { ...p, ...updates } : p);
      await updateCycle(editableCycle.id, { phases: updatedPhases });
  };

  const addPhase = async (cycleId: string, newPhaseData: Partial<Phase>) => {
      const editableCycle = await makeCurrentCycleEditable();
      if (!editableCycle || editableCycle.id !== cycleId) return;

      const phaseWithId: Phase = { id: uuidv4(), title: "New Phase", duration: 5, type: 'work', ...newPhaseData };
      const updatedPhases = [...editableCycle.phases, phaseWithId];
      await updateCycle(editableCycle.id, { phases: updatedPhases });
  };

  const deletePhase = async (cycleId: string, phaseId: string) => {
      const editableCycle = await makeCurrentCycleEditable();
      if (!editableCycle || editableCycle.id !== cycleId || editableCycle.phases.length <= 1) return;

      const updatedPhases = editableCycle.phases.filter(p => p.id !== phaseId);
      await updateCycle(editableCycle.id, { phases: updatedPhases });
  };

  const setCurrentCycleById = (cycleId: string) => {
      const cycle = allCycles.find(c => c.id === cycleId);
      if (cycle && cycle.id !== currentCycle?.id) {
          setCurrentCycle(cycle);
          setCurrentPhaseIndex(0);
      }
  };

  const advancePhase = () => {
      if (!currentCycle) return 0;
      const nextIndex = (currentPhaseIndex + 1) % currentCycle.phases.length;
      setCurrentPhaseIndex(nextIndex);
      return nextIndex;
  };

  const resetCycle = () => setCurrentPhaseIndex(0);

  const value = { allCycles, currentCycle, currentPhase: currentCycle?.phases[currentPhaseIndex] || null, currentPhaseIndex, isLoaded, audioLibrary: mockAudioLibrary, endOfCycleSound, setEndOfCycleSound, setCurrentCycleById, advancePhase, resetCycle, updateCycle, deleteCycle, updatePhase, addPhase, deletePhase, cloneCycle, makeCurrentCycleEditable };

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>;
}
