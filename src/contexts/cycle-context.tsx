// src/contexts/cycle-context.tsx - DAL INTEGRATED (Oct 19, 2025)
// 🔥 100% SỬ DỤNG DAL - KHÔNG CÒN FIRESTORE DIRECT CALLS!

"use client";

import { Cycle, Phase, TrainingHistory, AudioAsset } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from "react";
import { AuthContext } from "./auth-context";
import { 
  getPublicCycles, getPrivateCycles, createCycle, updateCycle, deleteCycle,
  addPhaseToCycle, removePhaseFromCycle, getCycleById 
} from "@/dal"; // 🔥 DAL IMPORTS
import { 
  createTrainingHistory, getTrainingHistory // 🔥 HISTORY DAL
} from "@/dal";
import { getUserProfile, addAudioAsset } from "@/dal";
import { useToast } from "@/hooks/use-toast";
import defaultData from "@/lib/mock-data";

const { mockAudioLibrary, pomodoroCycle, wimHofCycle, defaultCycle } = defaultData;

interface CycleContextType {
  privateCycles: Cycle[];
  allCycles: Cycle[];  
  currentCycle: Cycle | null;
  currentPhaseIndex: number;
  currentPhase: Phase | null;
  audioLibrary: AudioAsset[];
  endOfCycleSound: AudioAsset | null;
  isLoading: boolean;
  setEndOfCycleSound: (sound: AudioAsset | null) => void;
  setCurrentCycle: (cycle: Cycle) => void;
  setCurrentPhaseIndex: (index: number) => void;
  advancePhase: () => number;
  resetCycle: () => void;
  updateCycle: (updates: Partial<Cycle>) => void;
  updatePhase: (phaseId: string, updates: Partial<Phase>) => void;
  addPhase: (newPhaseData: Partial<Phase>) => void;
  deletePhase: (phaseId: string) => void;
  deleteCycle: (cycleId: string) => void;
  logTraining: () => void;
  saveCycleChanges: () => void;
  createNewCycle: () => void;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export function useCycle() {
  const context = useContext(CycleContext);
  if (!context) throw new Error("useCycle must be used within a CycleProvider");
  return context;
}

export function CycleProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { toast } = useToast();
  
  const [allCycles, setAllCycles] = useState<Cycle[]>([]);  
  const [privateCycles, setPrivateCycles] = useState<Cycle[]>([]);
  const [currentCycle, setCurrentCycleState] = useState<Cycle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhaseIndex, setCurrentPhaseIndexState] = useState(0);
  const [audioLibrary, setAudioLibrary] = useState<AudioAsset[]>(mockAudioLibrary);
  const [endOfCycleSound, setEndOfCycleSound] = useState<AudioAsset | null>(mockAudioLibrary[0] || null);

  // 🔥 LOAD CYCLES - SỬ DỤNG DAL
  useEffect(() => {
    const loadCycles = async () => {
      if (authLoading) {
        setIsLoading(true);
        return;
      }

      setIsLoading(true);
      
      if (!user) {
        // GUEST: Mock public cycles
        const publicCycles = [pomodoroCycle, wimHofCycle];
        setAllCycles(publicCycles);
        setPrivateCycles([]);
        setCurrentCycleState(defaultCycle);
        setIsLoading(false);
        return;
      }

      try {
        // 🔥 DAL CALLS - PARALLEL
        const [publicCycles, privateCycles] = await Promise.all([
          getPublicCycles(),
          getPrivateCycles()
        ]);
        
        setAllCycles([...publicCycles, ...privateCycles]);
        setPrivateCycles(privateCycles);
        
        // Set default cycle
        if (!currentCycle) {
          setCurrentCycleState(defaultCycle);
        }
      } catch (error) {
        toast({ 
          title: "Load Error", 
          description: "Failed to load cycles", 
          variant: "destructive" 
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCycles();
  }, [user, authLoading, toast]);

  // 🔥 LOG TRAINING - SỬ DỤNG HISTORY DAL
  const logTraining = useCallback(async () => {
    if (!currentCycle || !user) return;
    
    try {
      const totalDuration = currentCycle.phases.reduce((sum, p) => sum + p.duration, 0);
      
      const historyData: Omit<TrainingHistory, 'id'> = {
        cycleId: currentCycle.id,
        name: currentCycle.name,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        totalDuration,
        cycleCount: 1,
        completedAt: new Date().toISOString(),
        status: 'completed'
      };

      // 🔥 DAL CALL
      await createTrainingHistory(historyData);
      
      toast({ 
        title: "🎉 Completed!", 
        description: `${totalDuration}m session logged!` 
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to log session", 
        variant: "destructive" 
      });
    }
  }, [currentCycle, user, toast]);

  // 🔥 SAVE CYCLE CHANGES - SỬ DỤNG DAL
  const saveCycleChanges = useCallback(async () => {
    if (!user || !currentCycle || currentCycle.id.startsWith('cycle_template_')) {
      toast({ title: "Error", description: "Cannot save template.", variant: "destructive" });
      return;
    }

    try {
      const cycleToSave = { 
        ...currentCycle, 
        updatedAt: new Date().toISOString(),
        authorId: user.uid,
        isPublic: false
      };
      
      // 🔥 DAL CALL
      await updateCycle(currentCycle.id, cycleToSave);
      toast({ title: "Saved ✅", description: "Cycle updated!" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Save failed.", 
        variant: "destructive" 
      });
    }
  }, [user, currentCycle, toast]);

  // 🔥 CREATE NEW CYCLE - SỬ DỤNG DAL
  const createNewCycle = useCallback(async () => {
    if (!user || !currentCycle) return;
    
    try {
      const { id, ...cycleData } = currentCycle;
      const newCycleData: Omit<Cycle, 'id'> = {
        ...cycleData,
        authorId: user.uid,
        isPublic: false,
        likes: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 🔥 DAL CALL
      const savedCycle = await createCycle(newCycleData);
      
      setCurrentCycleState(savedCycle);
      setPrivateCycles(prev => [...prev, savedCycle]);
      setAllCycles(prev => [...prev, savedCycle]);
      
      toast({ 
        title: "Created ✅", 
        description: `New cycle "${newCycleData.name}" saved!` 
      });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create cycle.", 
        variant: "destructive" 
      });
    }
  }, [user, currentCycle, toast]);

  // 🔥 DELETE CYCLE - SỬ DỤNG DAL
  const deleteCycle = useCallback(async (cycleId: string) => {
    if (cycleId.startsWith("cycle_template_")) return;
    
    try {
      // 🔥 DAL CALL
      await deleteCycle(cycleId);
      
      setAllCycles(prev => prev.filter(c => c.id !== cycleId));
      setPrivateCycles(prev => prev.filter(c => c.id !== cycleId));
      
      if (currentCycle?.id === cycleId) {
        const newCurrent = allCycles.find(c => c.id !== cycleId) || defaultCycle;
        setCurrentCycleState(newCurrent);
        setCurrentPhaseIndexState(0);
      }
      
      toast({ title: "Deleted ✅", description: "Cycle removed!" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Delete failed.", 
        variant: "destructive" 
      });
    }
  }, [currentCycle, allCycles, toast]);

  // 🔥 LOCAL STATE FUNCTIONS (không cần DAL)
  const setCurrentCycle = useCallback((cycle: Cycle) => {
    setCurrentCycleState(cycle);
    setCurrentPhaseIndexState(0);
  }, []);

  const advancePhase = useCallback(() => {
    if (!currentCycle) return 0;
    const nextIndex = Math.min(currentPhaseIndex + 1, currentCycle.phases.length - 1);
    setCurrentPhaseIndexState(nextIndex);
    return nextIndex;
  }, [currentCycle, currentPhaseIndex]);
  
  const setCurrentPhaseIndex = useCallback((index: number) => {
    if (!currentCycle) return;
    const validIndex = Math.max(0, Math.min(index, currentCycle.phases.length - 1));
    setCurrentPhaseIndexState(validIndex);
  }, [currentCycle]);

  const resetCycle = useCallback(() => {
    setCurrentPhaseIndexState(0);
  }, []);

  const updateCycle = useCallback((updates: Partial<Cycle>) => {
    setCurrentCycleState(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const updatePhase = useCallback((phaseId: string, updates: Partial<Phase>) => {
    setCurrentCycleState(prev => {
      if (!prev) return null;
      const newPhases = prev.phases.map(p => 
        p.id === phaseId ? { ...p, ...updates } : p
      );
      return { ...prev, phases: newPhases };
    });
  }, []);

  const addPhase = useCallback((newPhaseData: Partial<Phase>) => {
    setCurrentCycleState(prev => {
      if (!prev) return null;
      if (!newPhaseData.title || newPhaseData.duration === undefined) return prev;
      const newPhase: Phase = {
        id: `phase_${Math.random().toString(36).substr(2, 9)}`,
        title: newPhaseData.title!,
        duration: newPhaseData.duration!,
        soundFile: audioLibrary[0] || null,
        removable: true,
        ...newPhaseData,
      };
      return { ...prev, phases: [...prev.phases, newPhase] };
    });
  }, [audioLibrary]);

  const deletePhase = useCallback((phaseId: string) => {
    setCurrentCycleState(prev => {
      if (!prev || prev.phases.length <= 1) return prev;
      const newPhases = prev.phases.filter(p => p.id !== phaseId);
      const newIndex = Math.min(currentPhaseIndex, newPhases.length - 1);
      setCurrentPhaseIndexState(newIndex);
      return { ...prev, phases: newPhases };
    });
  }, [currentPhaseIndex]);

  // 🔥 PHASE CRUD - SỬ DỤNG DAL (khi save)
  const savePhaseChanges = useCallback(async (phaseId: string) => {
    if (!currentCycle || !user) return;
    const phase = currentCycle.phases.find(p => p.id === phaseId);
    if (!phase) return;
    
    try {
      await addPhaseToCycle(currentCycle.id, phase);
      toast({ title: "Phase saved!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }, [currentCycle, user, toast]);

  const currentPhase = useMemo(() => {
    if (!currentCycle) return null;
    const index = Math.min(currentPhaseIndex, currentCycle.phases.length - 1);
    return currentCycle.phases[index] || null;
  }, [currentCycle, currentPhaseIndex]);

  const value = {
    privateCycles, allCycles, currentCycle, currentPhaseIndex, currentPhase,
    audioLibrary, endOfCycleSound, isLoading,
    setEndOfCycleSound,
    setCurrentCycle, setCurrentPhaseIndex, advancePhase, resetCycle,
    updateCycle, updatePhase, addPhase, deletePhase, deleteCycle,
    logTraining, saveCycleChanges, createNewCycle,
  };

  return (
    <CycleContext.Provider value={value}>
      {children}
    </CycleContext.Provider>
  );
}