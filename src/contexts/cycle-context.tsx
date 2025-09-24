"use client";

import { Cycle, Phase, TrainingHistory, AudioAsset } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";

// Mock data based on your types
const pomodoroCycle: Cycle = {
    id: "cycle_pomodoro",
    name: "Pomodoro Classic",
    description: "Làm việc 25 phút, nghỉ 5 phút.",
    phases: [
      { id: "p1", title: "Focus", duration: 25, description: "Work on your task.", soundFile: null, removable: true },
      { id: "p2", title: "Break", duration: 5, description: "Take a short break.", soundFile: null, removable: true },
    ],
    isPublic: true,
    authorId: "user123",
    authorName: "User",
    likes: 150, shares: 30,
    createdAt: "2025-09-23T10:00:00Z",
    updatedAt: "2025-09-23T10:00:00Z",
}

const wimHofCycle: Cycle = {
  id: "cycle_template_wimhof",
  name: "Wim Hof Morning",
  description: "Phương pháp thở Wim Hof để tăng năng lượng và tập trung.",
  phases: [
    {
      id: "phase_1",
      title: "Hít thở sâu",
      duration: 1,
      description: "Hít thở sâu 30 lần trong 1 phút.",
      soundFile: null,
    },
    {
      id: "phase_2",
      title: "Giữ hơi thở",
      duration: 1.5,
      description: "Giữ hơi thở sau khi thở ra.",
      soundFile: null,
    },
    {
      id: "phase_3",
      title: "Thở ra giữ",
      duration: 0.5,
      description: "Thở ra nhẹ nhàng và giữ 30 giây.",
      soundFile: null,
    },
  ],
  isPublic: true,
  authorId: "uid_system",
  authorName: "Timeflow Team",
  likes: 1337,
  shares: 42,
  createdAt: "2025-09-22T23:00:00Z",
  updatedAt: "2025-09-22T23:00:00Z",
};

const mockTrainingHistory: TrainingHistory[] = [
    {
      cycleId: "cycle_template_wimhof",
      name: "Wim Hof Morning",
      startTime: "2025-09-22T08:00:00Z",
      endTime: "2025-09-22T08:03:00Z",
      totalDuration: 3,
      cycleCount: 1,
      completedAt: new Date().toISOString(),
      status: 'completed'
    }
]

const mockAudioLibrary: AudioAsset[] = [
    {
        id: "audio_1",
        name: "rain.mp3",
        url: "/sounds/rain.mp3",
        uploadedAt: "2025-09-22T23:00:00Z"
    },
    {
        id: "audio_2",
        name: "singing-bowl.mp3",
        url: "/sounds/singing-bowl.mp3",
        uploadedAt: "2025-09-22T23:00:00Z"
    }
]


interface CycleContextType {
  privateCycles: Cycle[];
  currentCycle: Cycle | null;
  currentPhaseIndex: number;
  currentPhase: Phase | null;
  trainingHistory: TrainingHistory[];
  audioLibrary: AudioAsset[];
  setCurrentCycle: (cycle: Cycle) => void;
  setCurrentPhaseIndex: (index: number) => void;
  advancePhase: () => void;
  resetCycle: () => void;
  updateCycle: (updates: Partial<Cycle>) => void;
  updatePhase: (phaseId: string, updates: Partial<Phase>) => void;
  addPhaseAfter: (phaseId: string) => void;
  deletePhase: (phaseId: string) => void;
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
  const [privateCycles] = useState<Cycle[]>([pomodoroCycle, wimHofCycle]);
  const [currentCycle, setCurrentCycleState] = useState<Cycle | null>(privateCycles[0] || null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistory[]>(mockTrainingHistory);
  const [audioLibrary] = useState<AudioAsset[]>(mockAudioLibrary);

  const setCurrentCycle = (cycle: Cycle) => {
    setCurrentCycleState(cycle);
    setCurrentPhaseIndex(0);
  };

  const advancePhase = () => {
    if (currentCycle) {
      const nextPhaseIndex = (currentPhaseIndex + 1);
      if (nextPhaseIndex >= currentCycle.phases.length) {
        setCurrentPhaseIndex(0);
      } else {
        setCurrentPhaseIndex(nextPhaseIndex);
      }
    }
  };

  const resetCycle = () => {
      if(currentCycle) {
          // This should ideally reload from original source, but for now we just reset index
          setCurrentPhaseIndex(0);
      }
  }

  const updateCycle = useCallback((updates: Partial<Cycle>) => {
    setCurrentCycleState(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const updatePhase = useCallback((phaseId: string, updates: Partial<Phase>) => {
    setCurrentCycleState(prev => {
      if (!prev) return null;
      const newPhases = prev.phases.map(p => p.id === phaseId ? { ...p, ...updates } : p);
      return { ...prev, phases: newPhases };
    });
  }, []);
  
  const addPhaseAfter = useCallback((currentPhaseId: string) => {
    setCurrentCycleState(prev => {
      if (!prev) return null;
      const newPhase: Phase = {
        id: `phase_${Math.random().toString(36).substr(2, 9)}`,
        title: 'New Phase',
        duration: 5,
        description: 'A new phase.',
        soundFile: null,
        removable: true,
      };
      const currentIndex = prev.phases.findIndex(p => p.id === currentPhaseId);
      const newPhases = [...prev.phases];
      newPhases.splice(currentIndex + 1, 0, newPhase);
      return { ...prev, phases: newPhases };
    });
  }, []);
  
  const deletePhase = useCallback((phaseId: string) => {
    setCurrentCycleState(prev => {
      if (!prev || prev.phases.length <= 1) return prev;
      const newPhases = prev.phases.filter(p => p.id !== phaseId);
      const newIndex = Math.min(currentPhaseIndex, newPhases.length - 1);
      setCurrentPhaseIndex(newIndex);
      return { ...prev, phases: newPhases };
    });
  }, [currentPhaseIndex]);

  const currentPhase = useMemo(() => {
    return currentCycle?.phases[currentPhaseIndex] || null;
  }, [currentCycle, currentPhaseIndex]);

  const value = {
    privateCycles,
    currentCycle,
    currentPhaseIndex,
    currentPhase,
    trainingHistory,
    audioLibrary,
    setCurrentCycle,
    setCurrentPhaseIndex,
    advancePhase,
    resetCycle,
    updateCycle,
    updatePhase,
    addPhaseAfter,
    deletePhase,
  };

  return (
    <CycleContext.Provider value={value}>
        {children}
    </CycleContext.Provider>
  );
}
