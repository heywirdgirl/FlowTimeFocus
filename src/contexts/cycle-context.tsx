"use client";

import { Cycle, Phase, TrainingHistory, AudioAsset } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from "react";
import { getFirestore, doc, setDoc, addDoc, collection, onSnapshot, query, where, deleteDoc } from "firebase/firestore";
import { AuthContext } from "./auth-context";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import defaultData from "@/lib/mock-data"; // 🔥 IMPORT DEFAULT EXPORT

// 🔥 EXTRACT TỪ mock-data.ts
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
  if (!context) {
    throw new Error("useCycle must be used within a CycleProvider");
  }
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
  const [audioLibrary, setAudioLibrary] = useState<AudioAsset[]>(mockAudioLibrary); // 🔥 FIX: USE MOCK DATA
  const [endOfCycleSound, setEndOfCycleSound] = useState<AudioAsset | null>(mockAudioLibrary[0] || null); // 🔥 FIX

  // 🔥 LOAD ALL CYCLES (Public + Private) - FIXED
  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    if (!user) {
      // 🔥 GUEST: MOCK PUBLIC CYCLES (pomodoro + wimHof)
      const publicCycles = [pomodoroCycle, wimHofCycle];
      setAllCycles(publicCycles);
      setPrivateCycles([]);
      setCurrentCycleState(defaultCycle);
      setIsLoading(false);
      return;
    }

    // 🔥 AUTH USER: MOCK + FIRESTORE
    const publicCycles = [pomodoroCycle, wimHofCycle];
    setAllCycles(prev => [...publicCycles, ...prev.filter(c => c.authorId === user.uid)]);
    
    // Load private cycles from Firestore
    const privateQ = query(collection(db, 'cycle'), where('authorId', '==', user.uid));
    const unsubPrivate = onSnapshot(privateQ, (snapshot) => {
      const privateCyclesData = snapshot.docs.map(doc => ({ 
        id: doc.id, ...doc.data() as Cycle 
      }));
      setPrivateCycles(privateCyclesData);
      setAllCycles([...publicCycles, ...privateCyclesData]);
      setIsLoading(false);
    });

    // 🔥 Load audio library from mock + Firestore
    const audioQ = query(collection(db, 'audio'), where('authorId', '==', user.uid));
    onSnapshot(audioQ, (snapshot) => {
      const firestoreAudio = snapshot.docs.map(doc => ({ 
        id: doc.id, ...doc.data() as AudioAsset 
      }));
      const combinedAudio = [...mockAudioLibrary, ...firestoreAudio];
      setAudioLibrary(combinedAudio);
      setEndOfCycleSound(combinedAudio[0] || null);
    });

    // Set default nếu chưa có
    if (!currentCycle) {
      setCurrentCycleState(defaultCycle);
    }

    return () => unsubPrivate();
  }, [user, authLoading]);

  // 🔥 LOG TRAINING - FIXED
  const logTraining = useCallback(() => {
    if (!currentCycle) return;
    
    const totalDuration = currentCycle.phases.reduce(
      (sum, p) => sum + p.duration, 0
    );
    
    const newHistory: TrainingHistory = {
      id: `hist_${Date.now()}`,
      cycleId: currentCycle.id,
      name: currentCycle.name,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      totalDuration,
      cycleCount: 1,
      completedAt: new Date().toISOString(),
      status: 'completed'
    };

    const updatedCycle = {
      ...currentCycle,
      trainingHistory: [...currentCycle.trainingHistory, newHistory],
      updatedAt: new Date().toISOString()
    };

    setCurrentCycleState(updatedCycle);
    
    if (user && !currentCycle.id.startsWith('cycle_template_')) {
      const cycleRef = doc(db, 'cycle', updatedCycle.id);
      setDoc(cycleRef, updatedCycle, { merge: true });
    }
    
    toast({ title: "🎉 Completed!", description: `${totalDuration}m session logged!` });
  }, [currentCycle, user, toast]);

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
        soundFile: audioLibrary[0] || null, // 🔥 USE audioLibrary
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

  const deleteCycle = useCallback(async (cycleId: string) => {
    if (user && !cycleId.startsWith("cycle_template_")) {
      await deleteDoc(doc(db, 'cycle', cycleId));
    }
    setAllCycles(prev => prev.filter(c => c.id !== cycleId));
    setPrivateCycles(prev => prev.filter(c => c.id !== cycleId));
    
    if (currentCycle?.id === cycleId) {
      const newCurrent = allCycles.find(c => c.id !== cycleId) || defaultCycle;
      setCurrentCycleState(newCurrent);
      setCurrentPhaseIndexState(0);
    }
  }, [user, currentCycle, allCycles]);

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
      const cycleRef = doc(db, 'cycle', cycleToSave.id);
      await setDoc(cycleRef, cycleToSave, { merge: true });
      toast({ title: "Saved ✅", description: "Cycle updated!" });
    } catch (error) {
      toast({ title: "Error", description: "Save failed.", variant: "destructive" });
    }
  }, [user, currentCycle, toast]);

  const createNewCycle = useCallback(async () => {
    if (!user || !currentCycle) return;
    
    try {
      const { id, ...cycleData } = currentCycle;
      const newCycleData = {
        ...cycleData,
        id: `cycle_${Date.now()}`,
        authorId: user.uid,
        isPublic: false,
        trainingHistory: [], // 🔥 RESET history for new cycle
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'cycle'), newCycleData);
      const savedCycle = { ...newCycleData, id: docRef.id };
      setCurrentCycleState(savedCycle);
      setPrivateCycles(prev => [...prev, savedCycle]);
      setAllCycles(prev => [...prev, savedCycle]);
      
      toast({ title: "Created ✅", description: `New cycle "${newCycleData.name}" saved!` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create cycle.", variant: "destructive" });
    }
  }, [user, currentCycle, toast]);

  const currentPhase = useMemo(() => {
    if (!currentCycle) return null;
    const index = Math.min(currentPhaseIndex, currentCycle.phases.length - 1);
    return currentCycle.phases[index] || null;
  }, [currentCycle, currentPhaseIndex]);

  const value = {
    privateCycles,
    allCycles,
    currentCycle,
    currentPhaseIndex,
    currentPhase,
    audioLibrary,
    endOfCycleSound,
    isLoading,
    setEndOfCycleSound,
    setCurrentCycle,
    setCurrentPhaseIndex,
    advancePhase,
    resetCycle,
    updateCycle,
    updatePhase,
    addPhase,
    deletePhase,
    deleteCycle,
    logTraining,
    saveCycleChanges,
    createNewCycle,
  };

  return (
    <CycleContext.Provider value={value}>
      {children}
    </CycleContext.Provider>
  );
}