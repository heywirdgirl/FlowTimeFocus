
"use client";

import { Cycle, Phase, TrainingHistory, AudioAsset, PhaseRecord } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";

// Mock data based on your types
const pomodoroCycle: Cycle = {
    id: "cycle_pomodoro",
    name: "Pomodoro Classic",
    phases: [
      { id: "p1", title: "Focus", duration: 25, soundFile: null, removable: true },
      { id: "p2", title: "Break", duration: 5, soundFile: null, removable: true },
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
  phases: [
    {
      id: "phase_1",
      title: "Hít thở sâu",
      duration: 1,
      soundFile: null,
    },
    {
      id: "phase_2",
      title: "Giữ hơi thở",
      duration: 1.5,
      soundFile: null,
    },
    {
      id: "phase_3",
      title: "Thở ra giữ",
      duration: 0.5,
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
      status: 'completed',
      phaseRecords: [
        { title: 'Hít thở sâu', duration: 1, completionStatus: 'completed' },
        { title: 'Giữ hơi thở', duration: 1.5, completionStatus: 'completed' },
        { title: 'Thở ra giữ', duration: 0.5, completionStatus: 'completed' },
      ]
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
  advancePhase: () => number;
  resetCycle: () => void;
  updateCycle: (updates: Partial<Cycle>) => void;
  updatePhase: (phaseId: string, updates: Partial<Phase>) => void;
  addPhase: (newPhaseData: Partial<Phase>) => void;
  deletePhase: (phaseId: string) => void;
  logTraining: (log: Omit<TrainingHistory, 'completedAt' | 'startTime' | 'endTime'>) => void;
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
  const [privateCycles, setPrivateCycles] = useState<Cycle[]>([pomodoroCycle, wimHofCycle]);
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
       setCurrentPhaseIndex(nextPhaseIndex);
       return nextPhaseIndex;
    }
    return 0;
  };

  const resetCycle = () => {
      if(currentCycle) {
          // This should ideally reload from original source, but for now we just reset index
          setCurrentPhaseIndex(0);
      }
  }

  const logTraining = useCallback((log: Omit<TrainingHistory, 'completedAt' | 'startTime' | 'endTime'>) => {
    const newLog: TrainingHistory = {
      ...log,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }
    setTrainingHistory(prev => [newLog, ...prev]);
  }, []);

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
  
  const addPhase = useCallback((newPhaseData: Partial<Phase>) => {
    setCurrentCycleState(prev => {
        if (!prev) return null;
        if (!newPhaseData.title || newPhaseData.duration === undefined) return prev;
        const newPhase: Phase = {
            id: `phase_${Math.random().toString(36).substr(2, 9)}`,
            title: newPhaseData.title,
            duration: newPhaseData.duration,
            soundFile: null,
            removable: true,
            ...newPhaseData,
        };
        const newPhases = [...prev.phases, newPhase];
        return { ...prev, phases: newPhases };
    });
}, []);
  
  const deletePhase = useCallback((phaseId: string) => {
    setCurrentCycleState(prev => {
      if (!prev || prev.phases.length <= 1) return prev;
      const newPhases = prev.phases.filter(p => p.id !== phaseId);
      const newIndex = Math.min(currentPhaseIndex, newPhases.length - 1);
      if (currentPhaseIndex >= newPhases.length) {
          setCurrentPhaseIndex(0);
      }
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
    addPhase,
    deletePhase,
    logTraining,
  };

  return (
    <CycleContext.Provider value={value}>
        {children}
    </CycleContext.Provider>
  );
}
