
"use client";

import { Cycle, Phase, TrainingHistory, AudioAsset } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from "react";
import { getFirestore, doc, setDoc, addDoc, collection, onSnapshot, query, deleteDoc } from "firebase/firestore";
import { AuthContext } from "./auth-context";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const mockAudioLibrary: AudioAsset[] = [
    {
        id: "audio_instant_win",
        name: "Instant Win",
        url: "/sounds/instant-win.wav",
        uploadedAt: "2025-09-26T17:58:00Z"
    },
    {
        id: "audio_winning_notification",
        name: "Winning Notification",
        url: "/sounds/winning-notification.wav",
        uploadedAt: "2025-09-26T17:58:00Z"
    }
];


// Mock data based on your types
const pomodoroCycle: Cycle = {
    id: "cycle_pomodoro",
    name: "Pomodoro Classic",
    phases: [
      { id: "p1", title: "Focus", duration: 25, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name}, removable: false },
      { id: "p2", title: "Break", duration: 5, soundFile: { url: mockAudioLibrary[1].url, name: mockAudioLibrary[1].name}, removable: false },
      { id: "p3", title: "Focus", duration: 25, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name}, removable: false },
      { id: "p4", title: "Break", duration: 5, soundFile: { url: mockAudioLibrary[1].url, name: mockAudioLibrary[1].name}, removable: false },
      { id: "p5", title: "Focus", duration: 25, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name}, removable: false },
      { id: "p6", title: "Break", duration: 5, soundFile: { url: mockAudioLibrary[1].url, name: mockAudioLibrary[1].name}, removable: false },
      { id: "p7", title: "Focus", duration: 25, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name}, removable: false },
      { id: "p8", title: "Long Break", duration: 15, soundFile: { url: mockAudioLibrary[7].url, name: mockAudioLibrary[7].name}, removable: false },
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
      title: "Deep Breathing",
      duration: 1,
      soundFile: { url: mockAudioLibrary[2].url, name: mockAudioLibrary[2].name},
    },
    {
      id: "phase_2",
      title: "Breath Hold",
      duration: 1.5,
      soundFile: { url: mockAudioLibrary[3].url, name: mockAudioLibrary[3].name},
    },
    {
      id: "phase_3",
      title: "Recovery Breath",
      duration: 0.5,
      soundFile: { url: mockAudioLibrary[4].url, name: mockAudioLibrary[4].name},
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

const defaultCycle: Cycle = {
    id: "cycle_default_empty",
    name: "Select a cycle",
    phases: [],
    isPublic: false,
    authorId: "system",
    authorName: "System",
    likes: 0,
    shares: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
        { title: 'Deep Breathing', duration: 1, completionStatus: 'completed' },
        { title: 'Breath Hold', duration: 1.5, completionStatus: 'completed' },
        { title: 'Recovery Breath', duration: 0.5, completionStatus: 'completed' },
      ]
    }
]


interface CycleContextType {
  privateCycles: Cycle[];
  currentCycle: Cycle | null;
  currentPhaseIndex: number;
  currentPhase: Phase | null;
  trainingHistory: TrainingHistory[];
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
  logTraining: (log: Omit<TrainingHistory, 'completedAt' | 'startTime' | 'endTime'>) => void;
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
  
  const [privateCycles, setPrivateCycles] = useState<Cycle[]>([]);
  const [currentCycle, setCurrentCycleState] = useState<Cycle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPhaseIndex, setCurrentPhaseIndexState] = useState(0);
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistory[]>(mockTrainingHistory);
  const [audioLibrary] = useState<AudioAsset[]>(mockAudioLibrary);
  const [endOfCycleSound, setEndOfCycleSound] = useState<AudioAsset | null>(audioLibrary[7] || null);

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    if (!user) {
      const mockData = [pomodoroCycle, wimHofCycle];
      setPrivateCycles(mockData);
      if (!currentCycle) {
        setCurrentCycleState(mockData[0] || null);
      }
      setIsLoading(false);
      return;
    }

    const q = query(collection(db, `users/${user.uid}/privateCycles`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cyclesFromDb = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cycle));
      
      if (cyclesFromDb.length > 0) {
        setPrivateCycles(cyclesFromDb);
        setCurrentCycleState(prev => 
            prev && cyclesFromDb.some(c => c.id === prev.id) ? prev : cyclesFromDb[0]
        );
      } else {
        const mockData = [pomodoroCycle, wimHofCycle];
        setPrivateCycles(mockData);
        setCurrentCycleState(mockData[0] || null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching private cycles:", error);
      const mockData = [pomodoroCycle, wimHofCycle];
      setPrivateCycles(mockData);
      setCurrentCycleState(mockData[0] || null);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, currentCycle]);

  const setCurrentCycle = (cycle: Cycle) => {
    setCurrentCycleState(cycle);
    setCurrentPhaseIndexState(0);
  };

  const advancePhase = useCallback(() => {
      const nextIndex = currentPhaseIndex + 1;
      setCurrentPhaseIndexState(nextIndex);
      return nextIndex;
  }, [currentPhaseIndex]);
  
  const setCurrentPhaseIndex = (index: number) => {
      if (currentCycle && index >= 0 && index < currentCycle.phases.length) {
          setCurrentPhaseIndexState(index);
      }
  }

  const resetCycle = () => {
      setCurrentPhaseIndexState(0);
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
      if (currentPhaseIndex >= newPhases.length) {
          setCurrentPhaseIndexState(newPhases.length - 1);
      }
      return { ...prev, phases: newPhases };
    });
  }, [currentPhaseIndex]);

  const deleteCycle = useCallback(async (cycleId: string) => {
    if (user) {
        try {
            if (!cycleId.startsWith("cycle_template_")) {
                const cycleRef = doc(db, `users/${user.uid}/privateCycles`, cycleId);
                await deleteDoc(cycleRef);
            }
        } catch (error) {
            console.error("Error deleting cycle from Firestore: ", error);
        }
    }

    const updatedCycles = privateCycles.filter(c => c.id !== cycleId);
    setPrivateCycles(updatedCycles);

    if (currentCycle?.id === cycleId) {
        const newCurrent = updatedCycles.find(c => c.id !== cycleId) || defaultCycle;
        setCurrentCycleState(newCurrent);
        setCurrentPhaseIndexState(0);
        
        if (updatedCycles.length === 0) {
            setPrivateCycles([defaultCycle]);
        }
    }
  }, [user, currentCycle, privateCycles]);

  const saveCycleChanges = useCallback(async () => {
    if (!user || !currentCycle || currentCycle.id.startsWith('cycle_template_')) {
      toast({ title: "Error", description: "Cannot save template or no user.", variant: "destructive" });
      return;
    }
  
    try {
      const cycleToSave = { ...currentCycle, updatedAt: new Date().toISOString() };
      cycleToSave.authorId = user.uid;
      cycleToSave.isPublic = false;
  
      const cycleRef = doc(db, `users/${user.uid}/privateCycles`, cycleToSave.id);
      await setDoc(cycleRef, cycleToSave, { merge: true });
  
      toast({ title: "Saved", description: "Cycle changes saved successfully!" });
    } catch (error) {
      console.error("Error saving cycle changes: ", error);
      toast({ title: "Error", description: "Save failed. Please try again.", variant: "destructive" });
    }
  }, [user, currentCycle, toast]);

  const createNewCycle = useCallback(async () => {
    if (!user || !currentCycle) {
      return;
    }
  
    try {
      const { id, ...cycleData } = currentCycle;
  
      const newCycleData = {
        ...cycleData,
        name: currentCycle.name,
        authorId: user.uid,
        isPublic: false,
      };
  
      const privateCyclesCol = collection(db, `users/${user.uid}/privateCycles`);
      const docRef = await addDoc(privateCyclesCol, newCycleData);
      setCurrentCycleState({ ...newCycleData, id: docRef.id });
  
      toast({ title: "Created", description: `New cycle "${newCycleData.name}" saved! You can rename it anytime.` });
    } catch (error) {
      console.error("Error creating new cycle: ", error);
      toast({ title: "Error", description: "Failed to create cycle.", variant: "destructive" });
    }
  }, [user, currentCycle, toast]);


  const currentPhase = useMemo(() => {
    if (!currentCycle) return null;
    const index = Math.min(currentPhaseIndex, currentCycle.phases.length -1);
    return currentCycle.phases[index] || null;
  }, [currentCycle, currentPhaseIndex]);

  const value = {
    privateCycles,
    currentCycle,
    currentPhaseIndex,
    currentPhase,
    trainingHistory,
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
