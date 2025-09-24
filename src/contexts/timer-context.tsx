
"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { useSettings } from './settings-context';
import type { PhaseRecord } from '@/lib/types';
import { useCycle } from './cycle-context';
import { Howl } from 'howler';

interface TimerContextType {
  timeLeft: number;
  isActive: boolean;
  cyclesCompleted: number;
  sessionPhaseRecords: PhaseRecord[];
  startPause: (sessionsUntilLongRest: number) => void;
  reset: () => void;
  skip: (sessionsUntilLongRest: number) => void;
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
  const { currentCycle, currentPhase, currentPhaseIndex, advancePhase, resetCycle, logTraining, setCurrentPhaseIndex } = useCycle();
  
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [sessionPhaseRecords, setSessionPhaseRecords] = useState<PhaseRecord[]>([]);
  
  const getDuration = useCallback(() => {
    return currentPhase?.duration ? currentPhase.duration * 60 : 0;
  }, [currentPhase]);

  const [timeLeft, setTimeLeft] = useState(getDuration());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Howl | null>(null);
  const sessionsUntilLongRestRef = useRef(5);

  const playSound = useCallback(() => {
    if (!settings.playSounds) return;
    
    const soundUrl = currentPhase?.soundFile?.url || "/sounds/singing-bowl.mp3";
    
    if (soundUrl) {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
      const sound = new Howl({
        src: [soundUrl],
        html5: true,
      });
      sound.play();
      soundRef.current = sound;
    }
  }, [settings.playSounds, currentPhase]);
  
  useEffect(() => {
      setTimeLeft(getDuration());
  }, [currentPhase, getDuration]);

  // Main timer loop
  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else { // timeLeft <= 0
      // This is where the magic happens.
      // We advance the phase, which will trigger the useEffect above to set the new time.
      // We don't need to manually setTimeLeft here.
      handlePhaseEnd();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);


  const handlePhaseEnd = (skipped = false) => {
    if (currentPhase) {
        setSessionPhaseRecords(prev => [...prev, {
            title: currentPhase.title,
            duration: currentPhase.duration,
            completionStatus: skipped ? 'skipped' : 'completed',
        }]);
    }
    playSound();
    const nextPhaseIndex = advancePhase();

    if (nextPhaseIndex >= (currentCycle?.phases.length || 0)) {
        const newCyclesCompleted = cyclesCompleted + 1;
        setCyclesCompleted(newCyclesCompleted);

        logTraining({
            cycleId: currentCycle!.id,
            name: currentCycle!.name,
            cycleCount: 1,
            totalDuration: sessionPhaseRecords.reduce((acc, r) => acc + r.duration, 0) + (currentPhase?.duration ?? 0),
            status: 'completed',
            phaseRecords: [...sessionPhaseRecords, {
                title: currentPhase!.title,
                duration: currentPhase!.duration,
                completionStatus: skipped ? 'skipped' : 'completed',
            }]
        });
        
        setSessionPhaseRecords([]);
        setCurrentPhaseIndex(0);

        if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
          setIsActive(false); 
        }
    }
  };

  const reset = useCallback(() => {
    setIsActive(false);
    resetCycle();
    setCyclesCompleted(0);
    setSessionPhaseRecords([]);
  }, [resetCycle]);
  
  const startPause = (sessionsUntilLongRest: number) => {
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    if (cyclesCompleted >= sessionsUntilLongRest && sessionsUntilLongRest > 0) {
      reset();
    } else {
      setIsActive(!isActive);
    }
  };

  const skip = (sessionsUntilLongRest: number) => {
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    
    handlePhaseEnd(true);
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
