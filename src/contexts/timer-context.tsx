"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { useSettings } from './settings-context';
import type * as Tone from 'tone';
import { useCycle } from './cycle-context';
import type { PhaseRecord } from '@/lib/types';

interface TimerContextType {
  timeLeft: number;
  isActive: boolean;
  cyclesCompleted: number;
  sessionPhaseRecords: PhaseRecord[];
  startPause: () => void;
  reset: () => void;
  skip: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const { currentCycle, currentPhaseIndex, advancePhase, resetCycle, logTraining, setCurrentPhaseIndex, currentPhase } = useCycle();
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const [sessionPhaseRecords, setSessionPhaseRecords] = useState<PhaseRecord[]>([]);

  const getDuration = useCallback(() => {
    if (currentCycle && currentCycle.phases[currentPhaseIndex]) {
        const duration = currentCycle.phases[currentPhaseIndex].duration;
        return duration > 0 ? duration * 60 : 0;
    }
    return 0;
  }, [currentCycle, currentPhaseIndex]);

  const [timeLeft, setTimeLeft] = useState(getDuration());

  const synth = useRef<Tone.Synth | null>(null);
  const toneLoaded = useRef(false);

  useEffect(() => {
    if (toneLoaded.current) return;
    import('tone').then(Tone => {
      synth.current = new Tone.Synth().toDestination();
      toneLoaded.current = true;
    });
  }, []);

  const playSound = useCallback((note: string) => {
    if (settings.playSounds && synth.current) {
      synth.current.triggerAttackRelease(note, "8n");
    }
  }, [settings.playSounds]);
  
  const handleSessionEnd = useCallback((status: 'completed' | 'skipped') => {
    if (currentPhase) {
      setSessionPhaseRecords(prev => [...prev, {
        title: currentPhase.title,
        duration: currentPhase.duration,
        completionStatus: status,
      }]);
    }

    playSound('C5'); // Sound for phase end
    
    const nextPhaseIndex = advancePhase();

    if (currentCycle && nextPhaseIndex >= currentCycle.phases.length) {
      const newCyclesCompleted = cyclesCompleted + 1;
      setCyclesCompleted(newCyclesCompleted);

      logTraining({
        cycleId: currentCycle.id,
        name: currentCycle.name,
        cycleCount: 1,
        totalDuration: sessionPhaseRecords.reduce((acc, r) => acc + r.duration, 0) + (currentPhase?.duration || 0),
        status: 'completed',
        phaseRecords: [...sessionPhaseRecords, {
          title: currentPhase!.title,
          duration: currentPhase!.duration,
          completionStatus: status,
        }]
      })
      setSessionPhaseRecords([]);
      
      setCurrentPhaseIndex(0);

      if (settings.sessionsUntilLongRest > 0 && newCyclesCompleted >= settings.sessionsUntilLongRest) {
          setIsActive(false); // Stop the timer
          return;
      }
    }
  }, [playSound, advancePhase, currentCycle, currentPhaseIndex, cyclesCompleted, settings.sessionsUntilLongRest, logTraining, currentPhase, sessionPhaseRecords, setCurrentPhaseIndex]);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft <= 0) {
      handleSessionEnd('completed');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleSessionEnd]);

  useEffect(() => {
    setTimeLeft(getDuration());
  }, [currentPhaseIndex, currentCycle, getDuration]);
  
  const startPause = () => {
    if (cyclesCompleted >= settings.sessionsUntilLongRest && settings.sessionsUntilLongRest > 0) {
      reset();
      // Don't auto-start, let the user begin the new set of cycles.
    } else {
      setIsActive(!isActive);
    }
  };

  const reset = () => {
    setIsActive(false);
    resetCycle();
    setCyclesCompleted(0);
    setTimeLeft(getDuration());
    setSessionPhaseRecords([]);
  };

  const skip = () => {
    // a skip should not keep the timer running if it was paused
    handleSessionEnd('skipped');
    if (!isActive) {
        setTimeLeft(getDuration()); // Ensure new duration is set if paused
    }
  };

  const value = {
    timeLeft,
    isActive,
    cyclesCompleted,
    sessionPhaseRecords,
    startPause,
    reset,
    skip
  }

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};
