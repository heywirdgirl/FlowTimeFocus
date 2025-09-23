"use client";

import { Cycle, Phase, TrainingHistory } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";

// Mock data based on your types
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

const pomodoroCycle: Cycle = {
    id: "cycle_pomodoro",
    name: "Classic Focus",
    description: "Làm việc 25 phút, nghỉ 5 phút.",
    phases: [
      { id: "p1", title: "Focus", duration: 25, description: "Work on your task.", soundFile: null },
      { id: "p2", title: "Short Break", duration: 5, description: "Take a short break.", soundFile: null },
    ],
    isPublic: false,
    authorId: "user123",
    authorName: "User",
    likes: 0, shares: 0,
    createdAt: "2025-09-23T10:00:00Z",
    updatedAt: "2025-09-23T10:00:00Z",
}

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


interface CycleContextType {
  privateCycles: Cycle[];
  currentCycle: Cycle | null;
  currentPhaseIndex: number;
  currentPhase: Phase | null;
  trainingHistory: TrainingHistory[];
  setCurrentCycle: (cycle: Cycle) => void;
  advancePhase: () => void;
  resetCycle: () => void;
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
  const [privateCycles] = useState<Cycle[]>([wimHofCycle, pomodoroCycle]);
  const [currentCycle, setCurrentCycleState] = useState<Cycle | null>(privateCycles[0] || null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistory[]>(mockTrainingHistory);

  const setCurrentCycle = (cycle: Cycle) => {
    setCurrentCycleState(cycle);
    setCurrentPhaseIndex(0);
  };

  const advancePhase = () => {
    if (currentCycle) {
      const nextPhaseIndex = (currentPhaseIndex + 1);
      if (nextPhaseIndex >= currentCycle.phases.length) {
        // Cycle finished, you might want to record history here.
        // For now, let's just reset to the beginning of the cycle.
        setCurrentPhaseIndex(0);
      } else {
        setCurrentPhaseIndex(nextPhaseIndex);
      }
    }
  };

  const resetCycle = () => {
      if(currentCycle) {
          setCurrentCycle(currentCycle);
      }
  }

  const currentPhase = useMemo(() => {
    return currentCycle?.phases[currentPhaseIndex] || null;
  }, [currentCycle, currentPhaseIndex]);

  const value = {
    privateCycles,
    currentCycle,
    currentPhaseIndex,
    currentPhase,
    trainingHistory,
    setCurrentCycle,
    advancePhase,
    resetCycle,
  };

  return (
    <CycleContext.Provider value={value}>
        {children}
    </CycleContext.Provider>
  );
}
