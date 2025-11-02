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

interface CycleContextType {
  allCycles: Cycle[];
  currentCycle: Cycle | null;
  currentPhase: Phase | null;
  currentPhaseIndex: number;
  isLoaded: boolean;
  isDirty: boolean;
  audioLibrary: AudioAsset[];
  endOfCycleSound: AudioAsset | null;

  setCurrentCycleById: (cycleId: string) => void;
  setCurrentPhaseIndex: (index: number) => void;
  advancePhase: () => number;
  resetCycle: () => void;
  setEndOfCycleSound: (sound: AudioAsset | null) => void;
  
  updateCycleInfo: (updates: Partial<Cycle>) => void;
  addPhase: (newPhase: Partial<Phase>) => void;
  updatePhase: (phaseId: string, updates: Partial<Phase>) => void;
  deletePhase: (phaseId: string) => void;

  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  cloneCycle: (cycleId: string) => Promise<void>;
  deleteCycle: (cycleId: string) => Promise<void>;
  makeCurrentCycleEditable: () => Promise<Cycle | null>; // THÊM HÀM NÀY
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
  const [isDirty, setIsDirty] = useState(false);
  const [endOfCycleSound, setEndOfCycleSound] = useState<AudioAsset | null>(
    mockAudioLibrary.length > 0 ? mockAudioLibrary[0] : null
  );

  const loadCycles = useCallback(async () => {
    if (authLoading) return;
    setIsLoaded(false);
    try {
      const cycles = await getCycles(user?.uid);
      setAllCycles(cycles);
      if (!currentCycle || !cycles.some(c => c.id === currentCycle.id)) {
        setCurrentCycle(cycles.find(c => !c.isPublic) || cycles[0] || null);
      }
    } catch (error) {
      console.error("Failed to load cycles", error);
    } finally {
      setIsLoaded(true);
      setIsDirty(false);
    }
  }, [user, authLoading]);

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

  const setCurrentCycleById = (cycleId: string) => {
    if (isDirty) {
      if (!confirm("You have unsaved changes. Are you sure you want to switch?")) return;
    }
    const cycle = allCycles.find(c => c.id === cycleId);
    if (cycle && cycle.id !== currentCycle?.id) {
      setCurrentCycle(cycle);
      setCurrentPhaseIndex(0);
      setIsDirty(false);
    }
  };

  const updateCycleInfo = (updates: Partial<Cycle>) => {
    if (!currentCycle) return;
    setCurrentCycle(prev => prev ? { ...prev, ...updates } : null);
    setIsDirty(true);
  };

  const addPhase = (newPhaseData: Partial<Phase>) => {
    if (!currentCycle) return;
    const phaseWithId: Phase = { id: uuidv4(), title: "New Phase", duration: 5, type: 'work', ...newPhaseData };
    setCurrentCycle(prev => prev ? { ...prev, phases: [...prev.phases, phaseWithId] } : null);
    setIsDirty(true);
  };

  const updatePhase = (phaseId: string, updates: Partial<Phase>) => {
    if (!currentCycle) return;
    const updatedPhases = currentCycle.phases.map(p => (p.id === phaseId ? { ...p, ...updates } : p));
    setCurrentCycle(prev => prev ? { ...prev, phases: updatedPhases } : null);
    setIsDirty(true);
  };

  const deletePhase = (phaseId: string) => {
    if (!currentCycle || currentCycle.phases.length <= 1) return;
    const updatedPhases = currentCycle.phases.filter(p => p.id !== phaseId);
    setCurrentCycle(prev => prev ? { ...prev, phases: updatedPhases } : null);
    setIsDirty(true);
  };

  const discardChanges = () => {
    if (currentCycle) {
      const originalCycle = allCycles.find(c => c.id === currentCycle.id);
      if (originalCycle) setCurrentCycle(originalCycle);
    }
    setIsDirty(false);
  };

  const saveChanges = async () => {
    if (!currentCycle || !isDirty) return;
    const isNewCycle = currentCycle.isPublic || !allCycles.some(c => c.id === currentCycle.id && !c.isPublic);

    try {
      if (isNewCycle) {
        const { id, ...dataToSave } = currentCycle;
        const newCycleData = {
          ...dataToSave,
          isPublic: false,
          authorId: user?.uid ?? 'guest',
          authorName: user?.displayName ?? 'Guest',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likes: 0,
          shares: 0,
          originalId: currentCycle.id,
        };
        const savedCycle = await addCycleDAL(newCycleData as Cycle, user?.uid);
        setAllCycles(prev => [...prev.filter(c => c.id !== savedCycle.originalId), savedCycle]);
        setCurrentCycle(savedCycle);
        toast({ title: "Cycle Saved", description: `A new private cycle '${savedCycle.name}' was created.` });
      } else {
        const updates = { ...currentCycle, updatedAt: new Date().toISOString() };
        await updateCycleDAL(currentCycle.id, updates, user?.uid);
        setAllCycles(prev => prev.map(c => c.id === currentCycle.id ? updates : c));
        toast({ title: "Changes Saved", description: `'${currentCycle.name}' has been updated.` });
      }
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast({ title: "Error Saving", variant: "destructive" });
    }
  };

  const cloneCycle = async (cycleId: string) => {
    const cycleToClone = allCycles.find(c => c.id === cycleId);
    if (!cycleToClone) return;

    const newCycleData = { 
      ...cycleToClone, 
      name: `${cycleToClone.name} (Copy)`,
      isPublic: false,
      authorId: user?.uid ?? 'guest',
      authorName: user?.displayName ?? 'Guest',
      originalId: cycleToClone.id
    };
    delete newCycleData.id;

    const newCopy = await addCycleDAL(newCycleData as Cycle, user?.uid);
    setAllCycles(prev => [...prev, newCopy]);
    setCurrentCycle(newCopy);
    setIsDirty(false);
    toast({ title: "Cycle Cloned", description: `Switched to new copy '${newCopy.name}'`});
  };

  const deleteCycle = async (cycleId: string) => {
    await deleteCycleDAL(cycleId, user?.uid);
    if (currentCycle?.id === cycleId) {
      setCurrentCycle(allCycles.find(c => c.id !== cycleId) || null);
    }
    setAllCycles(prev => prev.filter(c => c.id !== cycleId));
    toast({ title: "Cycle Deleted" });
  };

  // THÊM HÀM NÀY
  const makeCurrentCycleEditable = async (): Promise<Cycle | null> => {
    if (!currentCycle) return null;
    if (currentCycle.authorId === user?.uid) return currentCycle;

    const newCycleData = {
      ...currentCycle,
      id: uuidv4(),
      name: `[Copy] ${currentCycle.name}`,
      isPublic: false,
      authorId: user?.uid ?? 'guest',
      authorName: user?.displayName ?? 'Guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      shares: 0,
    };

    try {
      const savedCycle = await addCycleDAL(newCycleData as Cycle, user?.uid);
      setAllCycles(prev => [...prev, savedCycle]);
      setCurrentCycle(savedCycle);
      setIsDirty(false);
      toast({
        title: "Bắt đầu chỉnh sửa",
        description: `Đã tạo bản sao để chỉnh sửa '${savedCycle.name}'`,
      });
      return savedCycle;
    } catch (error) {
      console.error("Failed to clone for editing", error);
      toast({ title: "Lỗi", description: "Không thể tạo bản sao.", variant: "destructive" });
      return null;
    }
  };

  const advancePhase = () => {
    if (!currentCycle) return 0;
    const nextIndex = (currentPhaseIndex + 1) % currentCycle.phases.length;
    setCurrentPhaseIndex(nextIndex);
    return nextIndex;
  };
  const resetCycle = () => setCurrentPhaseIndex(0);

  const value = { 
    allCycles, currentCycle, currentPhase: currentCycle?.phases[currentPhaseIndex] || null, 
    currentPhaseIndex, isLoaded, audioLibrary: mockAudioLibrary, endOfCycleSound, 
    setEndOfCycleSound, setCurrentCycleById, advancePhase, resetCycle, isDirty,
    updateCycleInfo, addPhase, updatePhase, deletePhase, 
    saveChanges, discardChanges, cloneCycle, deleteCycle,
    makeCurrentCycleEditable // XUẤT RA ĐÂY
  };  

  return <CycleContext.Provider value={value}>{children}</CycleContext.Provider>;
}